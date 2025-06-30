import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Pega o tema padrão do celular, mas dá prioridade ao que estiver salvo
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState(deviceTheme);
  
  const isDark = theme === 'dark';

  // Carrega a preferência de tema do usuário ao iniciar
  useEffect(() => {
    async function loadThemePreference() {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
    loadThemePreference();
  }, []);

  // Função para trocar o tema e salvar a preferência
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };

  const cores = {
  light: {
    background: '#f0f2f5', // Cor de fundo padrão clara
    texto: '#000',         // Cor do texto padrão clara
    card: '#fff',           // Cor de fundo de cartões/conteúdo claro
    accent: '#007bff',       // Cor de destaque (azul)
  },
  dark: {
    background: '#1e272e', // Fundo escuro acinzentado/azulado
    texto: '#f0f2f5',     // Texto claro para fundo escuro
    card: '#2c3e50',       // Fundo de cartões/conteúdo escuro
    accent: '#81b0ff',      // Destaque azul mais claro para o escuro
  },
};

return (
  <ThemeContext.Provider value={{ theme, isDark, toggleTheme, cores }}>
    {children}
  </ThemeContext.Provider>
);

}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}