import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const AccountSummary = ({ accountData }) => {
  if (!accountData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
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
    return parseFloat(value || 0) >= 0 ? '#4caf50' : '#f44336';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Current Value</Text>
        <Text style={styles.valueMain}>{formatCurrency(accountData.currentValue)}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>Daily P&L</Text>
        <Text style={[styles.value, { color: getProfitLossColor(accountData.dailyProfitLoss) }]}>
          {formatCurrency(accountData.dailyProfitLoss)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total P&L</Text>
        <View style={styles.profitLossContainer}>
          <Text style={[styles.value, { color: getProfitLossColor(accountData.totalProfitLoss) }]}>
            {formatCurrency(accountData.totalProfitLoss)}
          </Text>
          <Text style={[styles.percentage, { color: getProfitLossColor(accountData.totalProfitLoss) }]}>
            {formatPercentage(accountData.totalProfitLossPercentage)}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Deposits</Text>
        <Text style={styles.value}>{formatCurrency(accountData.totalDeposits)}</Text>
      </View>
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
    minHeight: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  valueMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profitLossContainer: {
    alignItems: 'flex-end',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
});

export default AccountSummary;
