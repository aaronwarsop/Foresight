import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const DividendSummary = ({ portfolioAnalysis }) => {
  if (!portfolioAnalysis) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  const calculateDividendInfo = () => {
    const avgYield = parseFloat(portfolioAnalysis.averageDividendYield || 0);
    const totalValue = parseFloat(portfolioAnalysis.totalCurrentValue || 0);

    const annualDividend = (totalValue * avgYield) / 100;
    const monthlyDividend = annualDividend / 12;
    const dailyDividend = annualDividend / 365;

    return {
      avgYield,
      annualDividend,
      monthlyDividend,
      dailyDividend,
    };
  };

  const { avgYield, annualDividend, monthlyDividend, dailyDividend } = calculateDividendInfo();

  const formatCurrency = (value) => {
    return `£${value.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dividend Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Portfolio Avg Yield</Text>
        <Text style={styles.valueMain}>{avgYield.toFixed(2)}%</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>Daily Average</Text>
        <Text style={styles.value}>{formatCurrency(dailyDividend)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Monthly Average</Text>
        <Text style={styles.value}>{formatCurrency(monthlyDividend)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Annual Estimate</Text>
        <Text style={[styles.value, styles.highlight]}>{formatCurrency(annualDividend)}</Text>
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
    color: '#4caf50',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  highlight: {
    color: '#1a73e8',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
});

export default DividendSummary;
