// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import AppNavigator from './src/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
}