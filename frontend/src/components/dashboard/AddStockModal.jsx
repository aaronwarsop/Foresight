import React, { useState } from 'react';
import { stockAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const AddStockModal = ({ visible, onClose, onAddStock }) => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchStocks = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await stockAPI.searchStocks(query);
      setSearchResults(response.data || []);
    } catch (err) {
      setError('Failed to search stocks');
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setStep(2);
  };

  const handleAddStock = async () => {
    if (!quantity || !buyPrice || parseFloat(quantity) <= 0 || parseFloat(buyPrice) <= 0) {
      setError('Please enter valid quantity and price');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAddStock({
        symbol: selectedStock.symbol,
        quantity: parseInt(quantity),
        buyPrice: parseFloat(buyPrice),
      });

      resetModal();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add stock';
      setError(errorMessage);
      console.error('Add stock error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedStock(null);
    setQuantity('');
    setBuyPrice('');
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleBack = () => {
    setStep(1);
    setSelectedStock(null);
    setQuantity('');
    setBuyPrice('');
    setError(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className={`rounded-xl w-full max-w-[500px] max-h-[80vh] shadow-xl overflow-hidden ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-navy-600' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {step === 1 ? 'Search Stock' : 'Enter Details'}
          </h2>
          <button
            onClick={handleClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isDarkMode ? 'bg-navy-700 hover:bg-navy-600 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {error && (
          <div className={`mx-5 mt-3 p-3 rounded-md ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="p-5">
          {/* Step 1: Search */}
          {step === 1 && (
            <>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Search by company name or ticker symbol
              </label>
              <input
                type="text"
                className={`w-full p-3 rounded-lg border text-base mb-4 ${
                  isDarkMode
                    ? 'bg-navy-700 border-navy-600 text-gray-100 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
                placeholder="e.g., PLTR, Vanguard, AAPL..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchStocks(e.target.value);
                }}
                autoFocus
              />

              {loading && (
                <div className="flex justify-center py-5">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              )}

              <div className="max-h-[300px] overflow-y-auto">
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className={`text-center py-5 text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Type at least 2 characters to search
                  </p>
                )}

                {searchResults.map((stock, index) => (
                  <button
                    key={index}
                    onClick={() => handleStockSelect(stock)}
                    className={`w-full flex items-center justify-between p-4 border-b transition-colors ${
                      isDarkMode
                        ? 'border-navy-600 hover:bg-navy-700'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          stock.type === 'ETF' || stock.type === 'ETP'
                            ? isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                            : isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}
                      >
                        <span className="text-xs font-bold text-blue-500">
                          {stock.type === 'ETF' || stock.type === 'ETP' ? 'ETF' : stock.symbol.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-blue-500">{stock.symbol}</span>
                          {stock.type && (
                            <span
                              className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                                stock.type === 'ETF' || stock.type === 'ETP'
                                  ? isDarkMode ? 'bg-purple-900/30 text-blue-400' : 'bg-purple-100 text-blue-600'
                                  : isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {stock.type === 'Common Stock' ? 'Stock' : stock.type === 'ETP' ? 'ETF' : stock.type}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stock.name}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
                  </button>
                ))}

                {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className={`text-center py-5 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    No stocks found. Try a different search term.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Step 2: Enter Details */}
          {step === 2 && selectedStock && (
            <>
              <div className={`p-4 rounded-lg mb-5 ${isDarkMode ? 'bg-navy-700' : 'bg-gray-100'}`}>
                <p className="text-lg font-bold text-blue-500">{selectedStock.symbol}</p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedStock.name}</p>
              </div>

              <div className="mb-5">
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Number of Shares *
                </label>
                <input
                  type="number"
                  className={`w-full p-3 rounded-lg border text-base ${
                    isDarkMode
                      ? 'bg-navy-700 border-navy-600 text-gray-100 placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="e.g., 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Average Buy Price (£) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={`w-full p-3 rounded-lg border text-base ${
                    isDarkMode
                      ? 'bg-navy-700 border-navy-600 text-gray-100 placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="e.g., 150.50"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                />
              </div>

              {quantity && buyPrice && (
                <div className={`p-4 rounded-lg mb-5 flex justify-between items-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Investment
                  </span>
                  <span className="text-xl font-bold text-blue-500">
                    £{(parseFloat(quantity || 0) * parseFloat(buyPrice || 0)).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className={`flex-1 py-3.5 rounded-lg text-base font-semibold transition-colors ${
                    isDarkMode
                      ? 'bg-navy-600 text-gray-300 hover:bg-navy-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleAddStock}
                  disabled={loading}
                  className={`flex-1 py-3.5 rounded-lg text-base font-semibold text-white transition-colors ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      Adding...
                    </span>
                  ) : (
                    'Add to Portfolio'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
