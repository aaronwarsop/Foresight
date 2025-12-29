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

    public FinnhubService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public StockPriceUpdate getStockQuote(String symbol) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/quote")
                    .queryParam("symbol", symbol)
                    .queryParam("token", apiKey)
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            JsonNode json = objectMapper.readTree(response);

            BigDecimal currentPrice = BigDecimal.valueOf(json.get("c").asDouble());
            BigDecimal change = BigDecimal.valueOf(json.get("d").asDouble());
            BigDecimal changePercent = BigDecimal.valueOf(json.get("dp").asDouble());

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
}
