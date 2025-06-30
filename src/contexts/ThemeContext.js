import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, ActivityIndicator, View } from 'react-native'; // Importe ActivityIndicator e View

const ThemeContext = createContext(null); // Inicia o contexto como null

export function ThemeProvider({ children }) {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState(null); // <-- MUDANÇA 1: Inicia o tema como null

  // Carrega o tema salvo na primeira vez
  useEffect(() => {
    async function loadThemePreference() {
      const savedTheme = await AsyncStorage.getItem('@theme');
      // Se houver um tema salvo, usa ele. Senão, usa o tema do dispositivo.
      setTheme(savedTheme || deviceTheme);
    }
    loadThemePreference();
  }, [deviceTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };
  
  const themeValue = useMemo(() => {
    // Se o tema ainda não foi carregado, retorna null
    if (!theme) return null;

    const isDark = theme === 'dark';
    const cores = {
      light: {
        background: '#f0f2f5', text: '#1c1c1c', card: '#ffffff', accent: '#007bff', subtleText: '#6c757d',
      },
      dark: {
        background: '#121212', text: '#e1e1e1', card: '#1e1e1e', accent: '#81b0ff', subtleText: '#adb5bd',
      },
    };
    const currentColors = isDark ? cores.dark : cores.light;
    return { theme, isDark, toggleTheme, cores: currentColors };
  }, [theme]);

  // --- MUDANÇA 2: MOSTRA UMA TELA DE LOADING ENQUANTO O TEMA CARREGA ---
  if (!themeValue) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
      // Este erro acontecerá se você tentar usar o useTheme fora do ThemeProvider
      throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}