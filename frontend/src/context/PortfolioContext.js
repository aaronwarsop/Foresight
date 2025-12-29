import React, { createContext, useState, useContext, useCallback } from 'react';
import { portfolioAPI } from '../services/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioAnalysis, setPortfolioAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioAPI.getUserPortfolio(userId);
      setPortfolio(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPortfolioAnalysis = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioAPI.getPortfolioAnalysis(userId);
      setPortfolioAnalysis(response.data);
      setPortfolio(response.data.holdings);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching portfolio analysis:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addStock = useCallback(async (userId, symbol, quantity, buyPrice) => {
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioAPI.addStock(userId, symbol, quantity, buyPrice);
      await fetchPortfolio(userId);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding stock:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPortfolio]);

  const removeStock = useCallback(async (userId, holdingId) => {
    setLoading(true);
    setError(null);
    try {
      await portfolioAPI.removeStock(holdingId);
      await fetchPortfolio(userId);
    } catch (err) {
      setError(err.message);
      console.error('Error removing stock:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPortfolio]);

  const value = {
    portfolio,
    portfolioAnalysis,
    loading,
    error,
    fetchPortfolio,
    fetchPortfolioAnalysis,
    addStock,
    removeStock,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
