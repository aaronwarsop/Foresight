import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';
import { PortfolioProvider } from './src/context/PortfolioContext';
import { StockDataProvider } from './src/context/StockDataContext';
import DashboardScreen from './src/screens/DashboardScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <PortfolioProvider>
        <StockDataProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1a73e8',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Foresight - Portfolio Dashboard' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </StockDataProvider>
      </PortfolioProvider>
    </UserProvider>
  );
}
