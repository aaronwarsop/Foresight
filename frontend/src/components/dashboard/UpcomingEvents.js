import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const UpcomingEvents = ({ portfolio }) => {
  const getUpcomingEvents = () => {
    const events = [];

    portfolio.forEach((holding) => {
      const stock = holding.stock;

      if (stock.nextDividendDate) {
        events.push({
          type: 'dividend',
          symbol: stock.symbol,
          companyName: stock.companyName,
          date: new Date(stock.nextDividendDate),
          amount: stock.annualDividend || 0,
        });
      }

      if (stock.nextEarningsDate) {
        events.push({
          type: 'earnings',
          symbol: stock.symbol,
          companyName: stock.companyName,
          date: new Date(stock.nextEarningsDate),
        });
      }
    });

    return events.sort((a, b) => a.date - b.date).slice(0, 5);
  };

  const events = getUpcomingEvents();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getEventIcon = (type) => {
    return type === 'dividend' ? '💰' : '📊';
  };

  const getEventColor = (type) => {
    return type === 'dividend' ? '#4caf50' : '#1a73e8';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>

      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No upcoming events</Text>
          <Text style={styles.emptySubtext}>
            Dividend and earnings dates will appear here
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.eventsList}>
          {events.map((event, index) => (
            <View key={index} style={styles.eventItem}>
              <View style={styles.eventIcon}>
                <Text style={styles.iconText}>{getEventIcon(event.type)}</Text>
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventSymbol}>{event.symbol}</Text>
                <Text style={styles.eventType}>
                  {event.type === 'dividend' ? 'Dividend Payment' : 'Earnings Release'}
                </Text>
              </View>
              <View style={styles.eventDate}>
                <Text style={[styles.dateText, { color: getEventColor(event.type) }]}>
                  {formatDate(event.date)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
    minHeight: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  eventsList: {
    maxHeight: 300,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  eventDetails: {
    flex: 1,
  },
  eventSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  eventDate: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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

export default UpcomingEvents;
