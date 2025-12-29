package com.foresight.backend.controller;

import com.foresight.backend.dto.AddStockRequest;
import com.foresight.backend.dto.PortfolioResponse;
import com.foresight.backend.model.PortfolioHolding;
import com.foresight.backend.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<PortfolioHolding>> getUserPortfolio(@PathVariable Long userId) {
        List<PortfolioHolding> portfolio = portfolioService.getUserPortfolio(userId);
        return ResponseEntity.ok(portfolio);
    }

    @PostMapping
    public ResponseEntity<PortfolioHolding> addStock(@RequestBody AddStockRequest request) {
        PortfolioHolding holding = portfolioService.addStockToPortfolio(
                request.getUserId(),
                request.getSymbol(),
                request.getQuantity(),
                request.getBuyPrice()
        );
        return ResponseEntity.ok(holding);
    }

    @GetMapping("/analysis/{userId}")
    public ResponseEntity<PortfolioResponse> getPortfolioAnalysis(@PathVariable Long userId) {
        PortfolioResponse analysis = portfolioService.getPortfolioAnalysis(userId);
        return ResponseEntity.ok(analysis);
    }

    @DeleteMapping("/{holdingId}")
    public ResponseEntity<Void> removeStock(@PathVariable Long holdingId) {
        portfolioService.removeStock(holdingId);
        return ResponseEntity.noContent().build();
    }
}
