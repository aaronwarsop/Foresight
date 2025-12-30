import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { usePortfolio } from '../../context/PortfolioContext';
import AddStockModal from './AddStockModal';

const PortfolioTable = ({ portfolio, userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const { addStock, removeStock } = usePortfolio();
  const formatCurrency = (value) => {
    return `£${parseFloat(value || 0).toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    const num = parseFloat(value || 0);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  const getProfitLossColor = (value) => {
    return parseFloat(value || 0) >= 0 ? '#4caf50' : '#f44336';
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
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Portfolio Holdings</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Add Stock</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No holdings yet</Text>
          <Text style={styles.emptySubtext}>Click "Add Stock" to get started</Text>
        </View>
        <AddStockModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddStock={handleAddStock}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Portfolio Holdings</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Stock</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableWrapper}>
        {/* Table Header */}
        <View style={styles.tableRow}>
            <View style={styles.symbolColumn}>
              <Text style={styles.tableHeader}>Symbol</Text>
            </View>
            <View style={styles.valueColumn}>
              <Text style={styles.tableHeader}>Current Value</Text>
            </View>
            <View style={styles.valueColumn}>
              <Text style={styles.tableHeader}>Invested</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text style={styles.tableHeader}>Avg Buy</Text>
            </View>
            <View style={styles.priceColumn}>
              <Text style={styles.tableHeader}>Current Price</Text>
            </View>
            <View style={styles.plColumn}>
              <Text style={styles.tableHeader}>P&L</Text>
            </View>
            <View style={styles.actionColumn}>
              <Text style={styles.tableHeader}>Actions</Text>
            </View>
          </View>

        {/* Table Body */}
        <ScrollView style={styles.tableBody}>
          {portfolio.map((holding, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.symbolColumn}>
                  <Text style={styles.symbolText}>{holding.stock.symbol}</Text>
                  <Text style={styles.companyText}>{holding.stock.companyName}</Text>
                  <Text style={styles.quantityText}>Qty: {holding.quantity}</Text>
                </View>

                <View style={styles.valueColumn}>
                  <Text style={styles.tableCell}>
                    {formatCurrency(holding.currentValue)}
                  </Text>
                </View>
                <View style={styles.valueColumn}>
                  <Text style={styles.tableCell}>
                    {formatCurrency(holding.totalInvested)}
                  </Text>
                </View>
                <View style={styles.priceColumn}>
                  <Text style={styles.tableCell}>
                    {formatCurrency(holding.averageBuyPrice)}
                  </Text>
                </View>
                <View style={styles.priceColumn}>
                  <Text style={styles.tableCell}>
                    {formatCurrency(holding.stock.currentPrice)}
                  </Text>
                </View>
                <View style={styles.plColumn}>
                  <Text style={[styles.tableCell, { color: getProfitLossColor(holding.profitLoss) }]}>
                    {formatCurrency(holding.profitLoss)}
                  </Text>
                  <Text style={[styles.percentageText, { color: getProfitLossColor(holding.profitLoss) }]}>
                    {formatPercentage(holding.profitLossPercentage)}
                  </Text>
                </View>

                <View style={styles.actionColumn}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteClick(holding)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
          ))}
        </ScrollView>
      </View>

      <AddStockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddStock={handleAddStock}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Delete Stock</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to remove {selectedHolding?.stock.symbol} from your portfolio?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.deleteConfirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 400,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tableWrapper: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    minHeight: 50,
    width: '100%',
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
  alignRight: {
    textAlign: 'right',
  },
  symbolColumn: {
    flex: 2,
    paddingRight: 12,
  },
  valueColumn: {
    flex: 1.5,
  },
  priceColumn: {
    flex: 1.2,
  },
  plColumn: {
    flex: 1.5,
  },
  actionColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 400,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteConfirmButton: {
    backgroundColor: '#d32f2f',
  },
  deleteConfirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  symbolText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  companyText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  quantityText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tableBody: {
    maxHeight: 300,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#bbb',
  },
});

export default PortfolioTable;
