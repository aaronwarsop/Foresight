import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import AddStockModal from './AddStockModal';

const PortfolioTable = ({ portfolio, userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const { addStock, removeStock } = usePortfolio();
  const { isDarkMode } = useTheme();

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

  const handleAddStock = async (stockData) => {
    try {
      await addStock(userId, stockData.symbol, stockData.quantity, stockData.buyPrice);
    } catch (error) {
      console.error('Error adding stock:', error);
      throw error;
    }
  };

  const handleDeleteClick = (holding) => {
    setSelectedHolding(holding);
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedHolding) return;

    try {
      await removeStock(userId, selectedHolding.id);
      setDeleteConfirmVisible(false);
      setSelectedHolding(null);
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert('Failed to delete stock. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setSelectedHolding(null);
  };

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className={`rounded-lg p-5 shadow-md min-h-[400px] ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Portfolio Holdings
          </h2>
          <button
            onClick={() => setModalVisible(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
          >
            + Add Stock
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <p className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No holdings yet
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Click "Add Stock" to get started
          </p>
        </div>
        <AddStockModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddStock={handleAddStock}
        />
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-5 shadow-md min-h-[400px] ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Portfolio Holdings
        </h2>
        <button
          onClick={() => setModalVisible(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          + Add Stock
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-navy-600' : 'border-gray-200'}`}>
              <th className={`text-left py-3 text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Symbol</th>
              <th className={`text-right py-3 text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Value</th>
              <th className={`text-right py-3 text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Invested</th>
              <th className={`text-right py-3 text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Buy</th>
              <th className={`text-right py-3 text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Price</th>
              <th className={`text-right py-3 text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>P&L</th>
              <th className={`text-center py-3 text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
            </tr>
          </thead>
          <tbody className="max-h-[300px] overflow-y-auto">
            {portfolio.map((holding, index) => (
              <tr key={index} className={`border-b ${isDarkMode ? 'border-navy-600' : 'border-gray-100'}`}>
                <td className="py-3">
                  <p className="text-base font-bold text-blue-500">{holding.stock.symbol}</p>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{holding.stock.companyName}</p>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Qty: {holding.quantity}</p>
                </td>
                <td className={`text-right py-3 text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {formatCurrency(holding.currentValue)}
                </td>
                <td className={`text-right py-3 text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {formatCurrency(holding.totalInvested)}
                </td>
                <td className={`text-right py-3 text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {formatCurrency(holding.averageBuyPrice)}
                </td>
                <td className={`text-right py-3 text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {formatCurrency(holding.stock.currentPrice)}
                </td>
                <td className="text-right py-3">
                  <p className={`text-sm ${getProfitLossColor(holding.profitLoss)}`}>
                    {formatCurrency(holding.profitLoss)}
                  </p>
                  <p className={`text-xs font-semibold mt-0.5 ${getProfitLossColor(holding.profitLoss)}`}>
                    {formatPercentage(holding.profitLossPercentage)}
                  </p>
                </td>
                <td className="text-center py-3">
                  <button
                    onClick={() => handleDeleteClick(holding)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isDarkMode ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <span className="text-red-500 text-lg font-bold">✕</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddStockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddStock={handleAddStock}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-[400px] max-w-[90%] shadow-xl ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Delete Stock
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to remove {selectedHolding?.stock.symbol} from your portfolio?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  isDarkMode ? 'bg-navy-600 text-gray-300 hover:bg-navy-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTable;
