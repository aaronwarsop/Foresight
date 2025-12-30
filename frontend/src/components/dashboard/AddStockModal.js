import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { stockAPI } from '../../services/api';

const AddStockModal = ({ visible, onClose, onAddStock }) => {
  const [step, setStep] = useState(1); // 1: Search, 2: Enter details
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

      // Reset and close
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 1 ? 'Search Stock' : 'Enter Details'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Step 1: Search */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Search by company name or ticker symbol</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="e.g., PLTR, Vanguard, AAPL..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchStocks(text);
                }}
                autoFocus
              />

              {loading && <ActivityIndicator size="small" color="#1a73e8" style={styles.loader} />}

              <ScrollView style={styles.resultsList}>
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <Text style={styles.hintText}>Type at least 2 characters to search</Text>
                )}
                {searchResults.map((stock, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.resultItem}
                    onPress={() => handleStockSelect(stock)}
                  >
                    <View style={styles.resultContent}>
                      <View style={[
                        styles.stockLogoPlaceholder,
                        stock.type === 'ETF' && styles.etfPlaceholder,
                        stock.type === 'ETP' && styles.etfPlaceholder
                      ]}>
                        <Text style={styles.logoPlaceholderText}>
                          {(stock.type === 'ETF' || stock.type === 'ETP') ? 'ETF' : stock.symbol.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.stockInfo}>
                        <View style={styles.symbolRow}>
                          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                          {stock.type && (
                            <View style={[
                              styles.typeBadge,
                              (stock.type === 'ETF' || stock.type === 'ETP') && styles.etfBadge,
                              { marginLeft: 8 }
                            ]}>
                              <Text style={styles.typeBadgeText}>
                                {stock.type === 'Common Stock' ? 'Stock' : (stock.type === 'ETP' ? 'ETF' : stock.type)}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.stockName} numberOfLines={1}>{stock.name}</Text>
                      </View>
                    </View>
                    <Text style={styles.arrowIcon}>→</Text>
                  </TouchableOpacity>
                ))}
                {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <Text style={styles.noResults}>No stocks found. Try a different search term.</Text>
                )}
              </ScrollView>
            </View>
          )}{/* Step 2: Enter Details */}{step === 2 && selectedStock && (
            <View style={styles.stepContainer}>
              <View style={styles.selectedStock}>
                <Text style={styles.selectedSymbol}>{selectedStock.symbol}</Text>
                <Text style={styles.selectedName}>{selectedStock.name}</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of Shares *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 10"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Average Buy Price (£) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 150.50"
                  keyboardType="decimal-pad"
                  value={buyPrice}
                  onChangeText={setBuyPrice}
                />
              </View>

              {quantity && buyPrice && (
                <View style={styles.summary}>
                  <Text style={styles.summaryLabel}>Total Investment</Text>
                  <Text style={styles.summaryValue}>
                    {`£${(parseFloat(quantity || 0) * parseFloat(buyPrice || 0)).toFixed(2)}`}
                  </Text>
                </View>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, { marginRight: 12 }]}
                  onPress={handleBack}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleAddStock}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Add to Portfolio</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffe5e5',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 6,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  stepContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stockLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  stockLogoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  etfPlaceholder: {
    backgroundColor: '#f3e5f5',
  },
  logoPlaceholderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  stockInfo: {
    flex: 1,
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  typeBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  etfBadge: {
    backgroundColor: '#f3e5f5',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a73e8',
  },
  stockName: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#999',
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
    fontSize: 14,
  },
  hintText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
    fontSize: 13,
    fontStyle: 'italic',
  },
  selectedStock: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  selectedName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  summary: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1a73e8',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default AddStockModal;
