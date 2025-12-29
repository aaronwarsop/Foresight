import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory-native';

const PortfolioPieChart = ({ portfolioAnalysis }) => {
  if (!portfolioAnalysis || !portfolioAnalysis.holdings || portfolioAnalysis.holdings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Portfolio Composition</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No holdings yet</Text>
          <Text style={styles.emptySubtext}>Add stocks to see your portfolio breakdown</Text>
        </View>
      </View>
    );
  }

  const chartData = portfolioAnalysis.holdings.map((holding, index) => {
    const percentage = (parseFloat(holding.currentValue || 0) / parseFloat(portfolioAnalysis.totalCurrentValue || 1)) * 100;
    return {
      x: holding.stock.symbol,
      y: percentage,
      label: `${holding.stock.symbol}\n${percentage.toFixed(1)}%`,
    };
  });

  const colors = [
    '#1a73e8',
    '#4caf50',
    '#ff9800',
    '#f44336',
    '#9c27b0',
    '#00bcd4',
    '#ffeb3b',
    '#795548',
    '#607d8b',
    '#e91e63',
  ];

  const legendData = portfolioAnalysis.holdings.map((holding, index) => ({
    name: `${holding.stock.symbol} - ${((parseFloat(holding.currentValue || 0) / parseFloat(portfolioAnalysis.totalCurrentValue || 1)) * 100).toFixed(1)}%`,
    symbol: { fill: colors[index % colors.length] },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio Composition</Text>

      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          colorScale={colors}
          innerRadius={60}
          labelRadius={80}
          style={{
            labels: { fontSize: 10, fill: '#333', fontWeight: 'bold' },
          }}
          width={300}
          height={300}
        />
      </View>

      <View style={styles.legendContainer}>
        <VictoryLegend
          data={legendData}
          orientation="vertical"
          gutter={20}
          style={{
            labels: { fontSize: 11, fill: '#666' },
          }}
          width={280}
        />
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
    minHeight: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  legendContainer: {
    marginTop: 10,
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

export default PortfolioPieChart;
