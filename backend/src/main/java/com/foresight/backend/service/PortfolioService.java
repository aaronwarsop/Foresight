package com.foresight.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.foresight.backend.dto.PortfolioResponse;
import com.foresight.backend.dto.StockPriceUpdate;
import com.foresight.backend.model.PortfolioHolding;
import com.foresight.backend.model.Stock;
import com.foresight.backend.model.User;
import com.foresight.backend.repository.PortfolioHoldingRepository;
import com.foresight.backend.repository.StockRepository;
import com.foresight.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioHoldingRepository portfolioHoldingRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FinnhubService finnhubService;

    public List<PortfolioHolding> getUserPortfolio(Long userId) {
        return portfolioHoldingRepository.findByUserId(userId);
    }

    @Transactional
    public PortfolioHolding addStockToPortfolio(Long userId, String symbol, Integer quantity, BigDecimal buyPrice) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get or create stock
        Stock stock = stockRepository.findBySymbol(symbol)
                .orElseGet(() -> createNewStock(symbol));

        // Check if user already has this stock
        Optional<PortfolioHolding> existingHolding = portfolioHoldingRepository.findByUserAndStock(user, stock);

        if (existingHolding.isPresent()) {
            // Update existing holding
            PortfolioHolding holding = existingHolding.get();
            BigDecimal totalInvested = holding.getTotalInvested().add(buyPrice.multiply(BigDecimal.valueOf(quantity)));
            Integer totalQuantity = holding.getQuantity() + quantity;
            BigDecimal avgBuyPrice = totalInvested.divide(BigDecimal.valueOf(totalQuantity), 2, RoundingMode.HALF_UP);

            holding.setQuantity(totalQuantity);
            holding.setAverageBuyPrice(avgBuyPrice);
            holding.setTotalInvested(totalInvested);

            updateHoldingValues(holding, stock.getCurrentPrice());
            return portfolioHoldingRepository.save(holding);
        } else {
            // Create new holding
            PortfolioHolding holding = new PortfolioHolding();
            holding.setUser(user);
            holding.setStock(stock);
            holding.setQuantity(quantity);
            holding.setAverageBuyPrice(buyPrice);
            holding.setTotalInvested(buyPrice.multiply(BigDecimal.valueOf(quantity)));

            updateHoldingValues(holding, stock.getCurrentPrice());
            return portfolioHoldingRepository.save(holding);
        }
    }

    public PortfolioResponse getPortfolioAnalysis(Long userId) {
        List<PortfolioHolding> holdings = portfolioHoldingRepository.findByUserId(userId);

        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalCurrentValue = BigDecimal.ZERO;
        BigDecimal totalDividendYield = BigDecimal.ZERO;
        int stockCount = holdings.size();

        for (PortfolioHolding holding : holdings) {
            // Update current values with latest stock price
            StockPriceUpdate priceUpdate = finnhubService.getStockQuote(holding.getStock().getSymbol());
            updateHoldingValues(holding, priceUpdate.getCurrentPrice());
            portfolioHoldingRepository.save(holding);

            totalInvested = totalInvested.add(holding.getTotalInvested());
            totalCurrentValue = totalCurrentValue.add(holding.getCurrentValue());

            if (holding.getStock().getDividendYield() != null) {
                totalDividendYield = totalDividendYield.add(holding.getStock().getDividendYield());
            }
        }

        BigDecimal totalProfitLoss = totalCurrentValue.subtract(totalInvested);
        BigDecimal totalProfitLossPercentage = totalInvested.compareTo(BigDecimal.ZERO) > 0
                ? totalProfitLoss.divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        BigDecimal avgDividendYield = stockCount > 0
                ? totalDividendYield.divide(BigDecimal.valueOf(stockCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new PortfolioResponse(
                holdings,
                totalInvested,
                totalCurrentValue,
                totalProfitLoss,
                totalProfitLossPercentage,
                avgDividendYield
        );
    }

    @Transactional
    public void removeStock(Long holdingId) {
        // Get the holding to find the associated stock
        PortfolioHolding holding = portfolioHoldingRepository.findById(holdingId)
                .orElseThrow(() -> new RuntimeException("Holding not found"));

        Long stockId = holding.getStock().getId();

        // Delete the holding
        portfolioHoldingRepository.deleteById(holdingId);

        // Check if any other holdings reference this stock
        Long remainingHoldings = portfolioHoldingRepository.countByStockId(stockId);

        // If no other holdings reference this stock, delete it
        if (remainingHoldings == 0) {
            stockRepository.deleteById(stockId);
        }
    }

    private Stock createNewStock(String symbol) {
        try {
            System.out.println("Creating new stock for symbol: " + symbol);
            JsonNode profile = finnhubService.getCompanyProfile(symbol);
            System.out.println("Company profile: " + profile);

            StockPriceUpdate quote = finnhubService.getStockQuote(symbol);
            System.out.println("Quote: " + quote);

            Stock stock = new Stock();
            stock.setSymbol(symbol);

            // Handle cases where company name might be null or missing
            String companyName = symbol; // Default to symbol
            if (profile != null && profile.has("name") && !profile.get("name").isNull()) {
                companyName = profile.get("name").asText();
            }
            stock.setCompanyName(companyName);
            stock.setCurrentPrice(quote.getCurrentPrice());

            // Fetch and populate dividend data
            populateDividendData(stock, symbol);

            // Fetch and populate earnings data
            populateEarningsData(stock, symbol);

            System.out.println("Saving stock: " + stock);
            return stockRepository.save(stock);
        } catch (Exception e) {
            System.err.println("Failed to create stock for symbol: " + symbol);
            e.printStackTrace();
            throw new RuntimeException("Failed to create stock for symbol: " + symbol, e);
        }
    }

    private void populateDividendData(Stock stock, String symbol) {
        try {
            JsonNode dividends = finnhubService.getDividends(symbol);
            if (dividends != null && dividends.isArray() && dividends.size() > 0) {
                // Calculate annual dividend from the last year of dividends
                BigDecimal annualDividend = BigDecimal.ZERO;
                LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
                LocalDateTime nextDividendDate = null;

                for (JsonNode dividend : dividends) {
                    if (dividend.has("date") && dividend.has("amount")) {
                        String dateStr = dividend.get("date").asText();
                        LocalDateTime dividendDate = LocalDateTime.parse(dateStr + "T00:00:00");

                        // Sum up dividends from the last year for annual calculation
                        if (dividendDate.isAfter(oneYearAgo)) {
                            BigDecimal amount = BigDecimal.valueOf(dividend.get("amount").asDouble());
                            annualDividend = annualDividend.add(amount);
                        }

                        // Find the most recent dividend date as a proxy for next dividend
                        // (In production, you'd use a more sophisticated prediction)
                        if (nextDividendDate == null || dividendDate.isAfter(nextDividendDate)) {
                            nextDividendDate = dividendDate;
                        }
                    }
                }

                stock.setAnnualDividend(annualDividend);

                // Calculate dividend yield
                if (stock.getCurrentPrice() != null && stock.getCurrentPrice().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal dividendYield = annualDividend
                            .divide(stock.getCurrentPrice(), 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100));
                    stock.setDividendYield(dividendYield);
                }

                // Set estimated next dividend date (approximately 3 months after last)
                if (nextDividendDate != null) {
                    stock.setNextDividendDate(nextDividendDate.plusMonths(3));
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not populate dividend data for " + symbol + ": " + e.getMessage());
        }
    }

    private void populateEarningsData(Stock stock, String symbol) {
        try {
            JsonNode earningsCalendar = finnhubService.getEarningsCalendar(symbol);
            if (earningsCalendar != null && earningsCalendar.has("earningsCalendar")) {
                JsonNode earnings = earningsCalendar.get("earningsCalendar");
                if (earnings.isArray() && earnings.size() > 0) {
                    // Find the next upcoming earnings date
                    LocalDateTime now = LocalDateTime.now();
                    LocalDateTime nextEarningsDate = null;

                    for (JsonNode earning : earnings) {
                        if (earning.has("date")) {
                            String dateStr = earning.get("date").asText();
                            LocalDateTime earningsDate = LocalDateTime.parse(dateStr + "T00:00:00");

                            // Find the closest future earnings date
                            if (earningsDate.isAfter(now)) {
                                if (nextEarningsDate == null || earningsDate.isBefore(nextEarningsDate)) {
                                    nextEarningsDate = earningsDate;
                                }
                            }
                        }
                    }

                    if (nextEarningsDate != null) {
                        stock.setNextEarningsDate(nextEarningsDate);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not populate earnings data for " + symbol + ": " + e.getMessage());
        }
    }

    private void updateHoldingValues(PortfolioHolding holding, BigDecimal currentPrice) {
        if (currentPrice != null) {
            BigDecimal currentValue = currentPrice.multiply(BigDecimal.valueOf(holding.getQuantity()));
            BigDecimal profitLoss = currentValue.subtract(holding.getTotalInvested());
            BigDecimal profitLossPercentage = holding.getTotalInvested().compareTo(BigDecimal.ZERO) > 0
                    ? profitLoss.divide(holding.getTotalInvested(), 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            holding.setCurrentValue(currentValue);
            holding.setProfitLoss(profitLoss);
            holding.setProfitLossPercentage(profitLossPercentage);
        }
    }
}
