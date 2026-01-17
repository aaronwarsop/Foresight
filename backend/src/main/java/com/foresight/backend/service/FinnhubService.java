package com.foresight.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foresight.backend.dto.StockPriceUpdate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FinnhubService {

    @Value("${finnhub.api.key}")
    private String apiKey;

    @Value("${finnhub.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private int apiCallCount = 0;
    private long lastResetTime = System.currentTimeMillis();

    public FinnhubService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    private void logApiCall(String endpoint) {
        apiCallCount++;
        long currentTime = System.currentTimeMillis();
        long elapsedMinutes = (currentTime - lastResetTime) / 60000;

        if (elapsedMinutes >= 1) {
            System.out.println("Finnhub API Usage: " + apiCallCount + " calls in the last minute");
            apiCallCount = 0;
            lastResetTime = currentTime;
        }
    }

    public StockPriceUpdate getStockQuote(String symbol) {
        try {
            logApiCall("quote");
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/quote")
                    .queryParam("symbol", symbol)
                    .queryParam("token", apiKey)
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            JsonNode json = objectMapper.readTree(response);

            BigDecimal currentPrice = BigDecimal.valueOf(json.get("c").asDouble());
            BigDecimal change = BigDecimal.valueOf(json.get("d").asDouble());
            BigDecimal changePercent = BigDecimal.valueOf(json.get("dp").asDouble());

            // Check if the price is 0, which usually means the symbol is not found or not supported
            if (currentPrice.compareTo(BigDecimal.ZERO) == 0) {
                System.err.println("Warning: Stock quote returned 0 for symbol: " + symbol);
                System.err.println("Response: " + response);
                throw new RuntimeException("Stock quote not available for symbol: " + symbol + ". This symbol may not be supported or may require an exchange suffix (e.g., .L for London)");
            }

            return new StockPriceUpdate(
                    symbol,
                    currentPrice,
                    change,
                    changePercent,
                    LocalDateTime.now()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch stock quote for " + symbol, e);
        }
    }

    public JsonNode getCompanyProfile(String symbol) {
        try {
            logApiCall("profile");
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/stock/profile2")
                    .queryParam("symbol", symbol)
                    .queryParam("token", apiKey)
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            return objectMapper.readTree(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch company profile for " + symbol, e);
        }
    }

    public JsonNode getDividends(String symbol) {
        try {
            logApiCall("dividend");
            // Get dividends from the last 2 years to find the most recent and calculate annual
            String fromDate = LocalDateTime.now().minusYears(2).toLocalDate().toString();
            String toDate = LocalDateTime.now().toLocalDate().toString();

            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/stock/dividend")
                    .queryParam("symbol", symbol)
                    .queryParam("from", fromDate)
                    .queryParam("to", toDate)
                    .queryParam("token", apiKey)
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            return objectMapper.readTree(response);
        } catch (Exception e) {
            System.err.println("Warning: Failed to fetch dividends for " + symbol + ": " + e.getMessage());
            return null;
        }
    }

    public JsonNode getEarningsCalendar(String symbol) {
        try {
            logApiCall("earnings");
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/calendar/earnings")
                    .queryParam("symbol", symbol)
                    .queryParam("token", apiKey)
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            return objectMapper.readTree(response);
        } catch (Exception e) {
            System.err.println("Warning: Failed to fetch earnings calendar for " + symbol + ": " + e.getMessage());
            return null;
        }
    }

    public JsonNode searchSymbols(String query) {
        try {
            logApiCall("search");
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search")
                    .queryParam("q", query)
                    .queryParam("token", apiKey)
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            return objectMapper.readTree(response);
        } catch (Exception e) {
            System.err.println("Warning: Failed to search symbols for query: " + query + ": " + e.getMessage());
            return null;
        }
    }
}
