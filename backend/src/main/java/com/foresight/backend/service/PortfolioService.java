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
        portfolioHoldingRepository.deleteById(holdingId);
    }

    private Stock createNewStock(String symbol) {
        try {
            JsonNode profile = finnhubService.getCompanyProfile(symbol);
            StockPriceUpdate quote = finnhubService.getStockQuote(symbol);

            Stock stock = new Stock();
            stock.setSymbol(symbol);
            stock.setCompanyName(profile.get("name").asText());
            stock.setCurrentPrice(quote.getCurrentPrice());

            return stockRepository.save(stock);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create stock for symbol: " + symbol, e);
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
