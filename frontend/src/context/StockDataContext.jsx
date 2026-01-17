import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import WebSocketService from '../services/websocket';
import { stockAPI } from '../services/api';

const StockDataContext = createContext();

export const StockDataProvider = ({ children }) => {
  const [stockPrices, setStockPrices] = useState({});
  const [subscribedSymbols, setSubscribedSymbols] = useState(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    WebSocketService.connect(
      () => {
        console.log('Stock data WebSocket connected');
        setConnected(true);
      },
      (error) => {
        console.error('Stock data WebSocket error:', error);
        setConnected(false);
      }
    );

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const subscribeToStock = useCallback((symbol) => {
    if (subscribedSymbols.has(symbol)) {
      return;
    }

    WebSocketService.subscribeToStock(symbol, (priceUpdate) => {
      setStockPrices((prev) => ({
        ...prev,
        [symbol]: priceUpdate,
      }));
    });

    setSubscribedSymbols((prev) => new Set(prev).add(symbol));
  }, [subscribedSymbols]);

  const unsubscribeFromStock = useCallback((symbol) => {
    WebSocketService.unsubscribeFromStock(symbol);
    setSubscribedSymbols((prev) => {
      const newSet = new Set(prev);
      newSet.delete(symbol);
      return newSet;
    });
  }, []);

  const fetchStockQuote = useCallback(async (symbol) => {
    try {
      const response = await stockAPI.getStockQuote(symbol);
      setStockPrices((prev) => ({
        ...prev,
        [symbol]: response.data,
      }));
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }, []);

  const value = {
    stockPrices,
    connected,
    subscribeToStock,
    unsubscribeFromStock,
    fetchStockQuote,
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};

export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (!context) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};
