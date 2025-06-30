import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Importe o Tab Navigator
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Importe os ícones
import { RegistrosProvider } from './contexts/RegistrosContext';
// telas
import HistoricoScreen from './screens/HistoricoScreen';
import LoginScreen from './screens/loginScreen';
import CadastroScreen from './screens/cadastroScreen';
import Home from './screens/Home';
import PerfilScreen from './screens/PerfilScreen'; // Importe a nova tela
import { ActivityIndicator, View } from 'react-native'; // Importe ActivityIndicator para loading

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // Crie o navegador de abas

// Componente que define as abas para quando o usuário ESTÁ logado
function AppTabs( { usuario } ) {
  return (
   <RegistrosProvider>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Esconde o cabeçalho de cada aba
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          else if (route.name === 'Histórico') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Início" component={Home} />
      <Tab.Screen name="Histórico" component={HistoricoScreen} />
      <Tab.Screen name="Perfil">
        {() => <PerfilScreen usuario={usuario} />} 
      </Tab.Screen>
      </Tab.Navigator>
    </RegistrosProvider>
  );
}

// O Navegador principal continua sendo uma "Pilha" (Stack)
export default function AppNavigator() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUsuario(user);
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

   if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        // Passamos o estado 'usuario' para o AppTabs
        <Stack.Screen name="App">
          {() => <AppTabs usuario={usuario} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}