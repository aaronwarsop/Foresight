import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAccountData } from '../hooks/useAccountData';
import { useTheme } from '../context/ThemeContext';
import AccountSummary from '../components/dashboard/AccountSummary';
import DividendSummary from '../components/dashboard/DividendSummary';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import PortfolioPieChart from '../components/dashboard/PortfolioPieChart';
import PortfolioTable from '../components/dashboard/PortfolioTable';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  // Using userId = 1 for demo purposes
  const userId = 1;

  const { portfolioAnalysis, fetchPortfolioAnalysis, error: portfolioError } = usePortfolio();
  const { accountData, refresh: refreshAccount, error: accountError } = useAccountData(userId);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchPortfolioAnalysis(userId),
          refreshAccount()
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-navy-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading dashboard...</p>
      </div>
    );
  }

  if (error || portfolioError || accountError) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-navy-900' : 'bg-gray-100'}`}>
        <p className="text-red-500 text-lg font-bold mb-2">Error loading dashboard</p>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error || portfolioError || accountError}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 ${isDarkMode ? 'bg-navy-900' : 'bg-gray-100'} min-h-screen`}>
      {/* Top Row - 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        <AccountSummary accountData={accountData} />
        <DividendSummary portfolioAnalysis={portfolioAnalysis} />
        <UpcomingEvents portfolio={portfolioAnalysis?.holdings || []} />
      </div>

      {/* Bottom Row - 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <PortfolioPieChart portfolioAnalysis={portfolioAnalysis} />
        <PortfolioTable portfolio={portfolioAnalysis?.holdings || []} userId={userId} />
      </div>
    </div>
  );
};

export default Dashboard;
