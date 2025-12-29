package com.foresight.backend.service;

import com.foresight.backend.dto.StockPriceUpdate;
import com.foresight.backend.model.Stock;
import com.foresight.backend.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockPriceService {

    @Autowired
    private FinnhubService finnhubService;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Fetches real-time stock prices every 10 seconds and broadcasts to WebSocket clients
     * Respects Finnhub rate limit of 60 calls/min (we'll update ~5 stocks per call)
     */
    @Scheduled(fixedRate = 10000)
    public void updateStockPrices() {
        List<Stock> stocks = stockRepository.findAll();

        for (Stock stock : stocks) {
            try {
                StockPriceUpdate update = finnhubService.getStockQuote(stock.getSymbol());

                // Update stock entity in database
                stock.setCurrentPrice(update.getCurrentPrice());
                stockRepository.save(stock);

                // Broadcast to WebSocket subscribers
                messagingTemplate.convertAndSend("/topic/stocks/" + stock.getSymbol(), update);
            } catch (Exception e) {
                System.err.println("Failed to update price for " + stock.getSymbol() + ": " + e.getMessage());
            }
        }
    }

    /**
     * Manually fetch and broadcast a single stock price update
     */
    public StockPriceUpdate fetchAndBroadcastStockPrice(String symbol) {
        StockPriceUpdate update = finnhubService.getStockQuote(symbol);
        messagingTemplate.convertAndSend("/topic/stocks/" + symbol, update);
        return update;
    }
}
