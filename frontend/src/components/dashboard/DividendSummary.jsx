import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const DividendSummary = ({ portfolioAnalysis }) => {
  const { isDarkMode } = useTheme();

  if (!portfolioAnalysis) {
    return (
      <div className={`rounded-lg p-5 shadow-md min-h-[200px] flex items-center justify-center ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const calculateDividendInfo = () => {
    const avgYield = parseFloat(portfolioAnalysis.averageDividendYield || 0);
    const totalValue = parseFloat(portfolioAnalysis.totalCurrentValue || 0);

    const annualDividend = (avgYield / 100) * totalValue;
    const monthlyDividend = annualDividend / 12;
    const dailyDividend = annualDividend / 365;

    return { avgYield, annualDividend, monthlyDividend, dailyDividend };
  };

  const { avgYield, annualDividend, monthlyDividend, dailyDividend } = calculateDividendInfo();

  const formatCurrency = (value) => {
    return `£${value.toFixed(2)}`;
  };

  return (
    <div className={`rounded-lg p-5 shadow-md min-h-[200px] ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Dividend Summary
      </h2>

      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Portfolio Avg Yield</span>
        <span className="text-2xl font-bold text-green-500">{avgYield.toFixed(2)}%</span>
      </div>

      <div className={`h-px my-3 ${isDarkMode ? 'bg-navy-600' : 'bg-gray-200'}`}></div>

      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily Average</span>
        <span className={`text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {formatCurrency(dailyDividend)}
        </span>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Average</span>
        <span className={`text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {formatCurrency(monthlyDividend)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Annual Estimate</span>
        <span className="text-base font-semibold text-blue-500">{formatCurrency(annualDividend)}</span>
      </div>
    </div>
  );
};

export default DividendSummary;
