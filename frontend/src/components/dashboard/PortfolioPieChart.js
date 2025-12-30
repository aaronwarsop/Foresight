import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

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

  const chartData = portfolioAnalysis.holdings.map((holding, index) => {
    const percentage = (parseFloat(holding.currentValue || 0) / parseFloat(portfolioAnalysis.totalCurrentValue || 1)) * 100;
    return {
      name: holding.stock.symbol,
      value: parseFloat(holding.currentValue || 0),
      color: colors[index % colors.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    };
  });

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 80, 320);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio Composition</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={chartWidth}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.legendContainer}>
        {portfolioAnalysis.holdings.map((holding, index) => {
          const percentage = ((parseFloat(holding.currentValue || 0) / parseFloat(portfolioAnalysis.totalCurrentValue || 1)) * 100).toFixed(1);
          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors[index % colors.length] }]} />
              <Text style={styles.legendText}>
                {holding.stock.symbol} - {percentage}%
              </Text>
            </View>
          );
        })}
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
    marginTop: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
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
