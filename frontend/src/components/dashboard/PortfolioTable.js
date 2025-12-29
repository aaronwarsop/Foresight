import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PortfolioTable = ({ portfolio }) => {
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

  if (!portfolio || portfolio.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Portfolio Holdings</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No holdings yet</Text>
          <Text style={styles.emptySubtext}>Start building your portfolio</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio Holdings</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.symbolColumn]}>Symbol</Text>
            <Text style={[styles.tableHeader, styles.valueColumn]}>Current Value</Text>
            <Text style={[styles.tableHeader, styles.valueColumn]}>Invested</Text>
            <Text style={[styles.tableHeader, styles.priceColumn]}>Avg Buy</Text>
            <Text style={[styles.tableHeader, styles.priceColumn]}>Current</Text>
            <Text style={[styles.tableHeader, styles.plColumn]}>P&L</Text>
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

                <Text style={[styles.tableCell, styles.valueColumn]}>
                  {formatCurrency(holding.currentValue)}
                </Text>

                <Text style={[styles.tableCell, styles.valueColumn]}>
                  {formatCurrency(holding.totalInvested)}
                </Text>

                <Text style={[styles.tableCell, styles.priceColumn]}>
                  {formatCurrency(holding.averageBuyPrice)}
                </Text>

                <Text style={[styles.tableCell, styles.priceColumn]}>
                  {formatCurrency(holding.stock.currentPrice)}
                </Text>

                <View style={styles.plColumn}>
                  <Text style={[styles.tableCell, { color: getProfitLossColor(holding.profitLoss) }]}>
                    {formatCurrency(holding.profitLoss)}
                  </Text>
                  <Text style={[styles.percentageText, { color: getProfitLossColor(holding.profitLoss) }]}>
                    {formatPercentage(holding.profitLossPercentage)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    minHeight: 50,
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
    textAlign: 'right',
  },
  symbolColumn: {
    width: 140,
    paddingRight: 12,
  },
  valueColumn: {
    width: 100,
    textAlign: 'right',
  },
  priceColumn: {
    width: 80,
    textAlign: 'right',
  },
  plColumn: {
    width: 100,
    alignItems: 'flex-end',
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
