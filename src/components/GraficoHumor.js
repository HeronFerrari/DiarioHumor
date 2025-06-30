import React from 'react';
import { View, Text, useColorScheme, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import { useTheme } from '../contexts/ThemeContext';

export default function GraficoHumor({ registros }) {
  const { cores, isDark } = useTheme();

  if (!cores) {
    return null;
  }

  const contarHumores = () => {
    const contagem = { feliz: 0, neutro: 0, triste: 0 };
    registros.forEach(r => {
      if (r.humor && contagem.hasOwnProperty(r.humor.toLowerCase())) {
        contagem[r.humor.toLowerCase()]++;
      }
    });

    const coresGrafico = { 
    feliz: '#4CAF50', 
    neutro: '#FFC107',
    triste: '#F44336' 
    };

  return Object.keys(contagem)
        .filter(k => contagem[k] > 0)
        .map(k => ({
        name: k.charAt(0).toUpperCase() + k.slice(1),
        population: contagem[k],
        color: coresGrafico[k],
        legendFontColor: cores.text, // <-- 3. USA A COR DO TEMA AQUI
        legendFontSize: 15
        }));
  };

  const dadosDoGrafico = contarHumores();

  if (dadosDoGrafico.length === 0) {
    return null;
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: cores.text, 
      }}>
        Frequência dos Humores
      </Text>

      <PieChart
        data={dadosDoGrafico}
        width={Dimensions.get("window").width - 40} // Pega a largura da tela
        height={220}
        chartConfig={{
          color: (opacity = 1) => isDark 
            ? `rgba(255, 255, 255, ${opacity})` // Texto branco para tema escuro
            : `rgba(0, 0, 0, ${opacity})`,      // Texto preto para tema claro
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute // Mostra os valores absolutos em vez de porcentagens
      />
    </View>
  );
}
