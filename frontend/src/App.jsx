import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { StockDataProvider } from './context/StockDataContext';
import Dashboard from './pages/Dashboard';

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      aria-label="Toggle theme"
    >
      <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
    </button>
  );
};

const Header = () => {
  const { isDarkMode } = useTheme();
  return (
    <header className={`${isDarkMode ? 'bg-navy-800' : 'bg-blue-600'} text-white px-6 py-4 shadow-md`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Foresight - Portfolio Dashboard</h1>
        <ThemeToggleButton />
      </div>
    </header>
  );
};

const AppContent = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-navy-900' : 'bg-gray-100'}`}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <PortfolioProvider>
            <StockDataProvider>
              <AppContent />
            </StockDataProvider>
          </PortfolioProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
