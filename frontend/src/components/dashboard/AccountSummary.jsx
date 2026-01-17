import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AccountSummary = ({ accountData }) => {
  const { isDarkMode } = useTheme();

  if (!accountData) {
    return (
      <div className={`rounded-lg p-5 shadow-md min-h-[200px] flex items-center justify-center ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return `£${parseFloat(value || 0).toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    const num = parseFloat(value || 0);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  const getProfitLossColor = (value) => {
    return parseFloat(value || 0) >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className={`rounded-lg p-5 shadow-md min-h-[200px] ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Account Summary
      </h2>

      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Value</span>
        <span className="text-2xl font-bold text-blue-500">{formatCurrency(accountData.currentValue)}</span>
      </div>

      <div className={`h-px my-3 ${isDarkMode ? 'bg-navy-600' : 'bg-gray-200'}`}></div>

      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily P&L</span>
        <span className={`text-base font-semibold ${getProfitLossColor(accountData.dailyProfitLoss)}`}>
          {formatCurrency(accountData.dailyProfitLoss)}
        </span>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total P&L</span>
        <div className="text-right">
          <span className={`text-base font-semibold ${getProfitLossColor(accountData.totalProfitLoss)}`}>
            {formatCurrency(accountData.totalProfitLoss)}
          </span>
          <p className={`text-xs font-medium mt-0.5 ${getProfitLossColor(accountData.totalProfitLoss)}`}>
            {formatPercentage(accountData.totalProfitLossPercentage)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Deposits</span>
        <span className={`text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {formatCurrency(accountData.totalDeposits)}
        </span>
      </div>
    </div>
  );
};

export default AccountSummary;
