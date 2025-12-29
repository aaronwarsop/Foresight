import { useState, useEffect, useCallback } from 'react';
import { accountAPI } from '../services/api';

export const useAccountData = (userId) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccountData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await accountAPI.getAccountInfo(userId);
      setAccountData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching account data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addDeposit = useCallback(async (amount, description) => {
    if (!userId) return;

    try {
      await accountAPI.addDeposit(userId, amount, description);
      await fetchAccountData();
    } catch (err) {
      console.error('Error adding deposit:', err);
      throw err;
    }
  }, [userId, fetchAccountData]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return {
    accountData,
    loading,
    error,
    refresh: fetchAccountData,
    addDeposit,
  };
};
