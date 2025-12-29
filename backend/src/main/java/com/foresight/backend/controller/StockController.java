package com.foresight.backend.controller;

import com.foresight.backend.dto.StockPriceUpdate;
import com.foresight.backend.model.Stock;
import com.foresight.backend.service.FinnhubService;
import com.foresight.backend.service.StockPriceService;
import com.foresight.backend.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> searchStocks(@PathVariable String query) {
        // This would integrate with Finnhub symbol search API
        // For now, returning a placeholder
        return ResponseEntity.ok("Search functionality coming soon");
    }
}
