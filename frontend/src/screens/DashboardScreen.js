import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, Text, ActivityIndicator } from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { useAccountData } from '../hooks/useAccountData';
import AccountSummary from '../components/dashboard/AccountSummary';
import DividendSummary from '../components/dashboard/DividendSummary';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import PortfolioPieChart from '../components/dashboard/PortfolioPieChart';
import PortfolioTable from '../components/dashboard/PortfolioTable';

const DashboardScreen = () => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Using userId = 1 for demo purposes
  // In production, this would come from useUser context
  const userId = 1;

  const { portfolioAnalysis, fetchPortfolioAnalysis, error: portfolioError } = usePortfolio();
  const { accountData, refresh: refreshAccount, error: accountError } = useAccountData(userId);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchPortfolioAnalysis(userId),
          refreshAccount()
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error || portfolioError || accountError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading dashboard</Text>
        <Text style={styles.errorDetail}>{error || portfolioError || accountError}</Text>
      </View>
    );
  }

  const TopRowComponents = () => (
    <View style={isWeb ? styles.topRow : styles.mobileStack}>
      <View style={isWeb ? styles.topRowItem : styles.mobileItem}>
        <AccountSummary accountData={accountData} />
      </View>
      <View style={isWeb ? styles.topRowItem : styles.mobileItem}>
        <DividendSummary portfolioAnalysis={portfolioAnalysis} />
      </View>
      <View style={isWeb ? styles.topRowItem : styles.mobileItem}>
        <UpcomingEvents portfolio={portfolioAnalysis?.holdings || []} />
      </View>
    </View>
  );

  const BottomRowComponents = () => (
    <View style={isWeb ? styles.bottomRow : styles.mobileStack}>
      <View style={isWeb ? styles.bottomRowItem : styles.mobileItem}>
        <PortfolioPieChart portfolioAnalysis={portfolioAnalysis} />
      </View>
      <View style={isWeb ? styles.bottomRowItem : styles.mobileItem}>
        <PortfolioTable portfolio={portfolioAnalysis?.holdings || []} />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TopRowComponents />
        <BottomRowComponents />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  topRowItem: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 16,
  },
  bottomRowItem: {
    flex: 1,
  },
  mobileStack: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16,
  },
  mobileItem: {
    width: '100%',
  },
});

export default DashboardScreen;
