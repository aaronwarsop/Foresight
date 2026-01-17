package com.foresight.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.foresight.backend.dto.StockPriceUpdate;
import com.foresight.backend.model.Stock;
import com.foresight.backend.service.FinnhubService;
import com.foresight.backend.service.StockPriceService;
import com.foresight.backend.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private FinnhubService finnhubService;

    @Autowired
    private StockPriceService stockPriceService;

    @Autowired
    private StockRepository stockRepository;

    @GetMapping("/{symbol}/quote")
    public ResponseEntity<StockPriceUpdate> getStockQuote(@PathVariable String symbol) {
        StockPriceUpdate quote = stockPriceService.fetchAndBroadcastStockPrice(symbol);
        return ResponseEntity.ok(quote);
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<Stock> getStockInfo(@PathVariable String symbol) {
        Stock stock = stockRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Stock not found: " + symbol));
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/search/{query}")
    public ResponseEntity<List<Map<String, String>>> searchStocks(@PathVariable String query) {
        try {
            JsonNode searchResults = finnhubService.searchSymbols(query);
            List<Map<String, String>> stocks = new ArrayList<>();

            if (searchResults != null && searchResults.has("result")) {
                JsonNode results = searchResults.get("result");

                // Limit to top 20 results for performance
                int count = 0;
                for (JsonNode result : results) {
                    if (count >= 20) break;

                    // Only include stocks (type = "Common Stock" or "ETP")
                    String type = result.has("type") ? result.get("type").asText() : "";
                    if (type.equals("Common Stock") || type.equals("ETP") || type.equals("ETF")) {
                        String symbol = result.get("symbol").asText();
                        Map<String, String> stock = new HashMap<>();
                        stock.put("symbol", symbol);
                        stock.put("name", result.get("description").asText());
                        stock.put("type", type);

                        // Generate a logo URL using a free service (Clearbit) as fallback
                        // This works for many major companies
                        String domain = extractDomainFromSymbol(symbol);
                        if (domain != null) {
                            stock.put("logo", "https://logo.clearbit.com/" + domain);
                        }

                        stocks.add(stock);
                        count++;
                    }
                }
            }

            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            System.err.println("Error searching stocks: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    private String extractDomainFromSymbol(String symbol) {
        // Simple mapping for common stocks - in production you'd use a proper lookup
        // For now, return null to use placeholder
        return null;
    }
}
