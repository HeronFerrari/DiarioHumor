import React from 'react';
import { View, Text, useColorScheme, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";

export default function GraficoHumor({ registros }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const contarHumores = () => {
    const contagem = { feliz: 0, neutro: 0, triste: 0 };
    registros.forEach(r => {
      if (r.humor && contagem.hasOwnProperty(r.humor.toLowerCase())) {
        contagem[r.humor.toLowerCase()]++;
      }
    });

    const cores = {
      feliz: '#4CAF50', // Verde
      neutro: '#FFC107', // Amarelo
      triste: '#F44336'  // Vermelho
    };

    // Formata os dados para o formato que o PieChart espera
    return Object.keys(contagem)
      .filter(k => contagem[k] > 0)
      .map(k => ({
        name: k.charAt(0).toUpperCase() + k.slice(1), // Deixa a primeira letra maiúscula
        population: contagem[k],
        color: cores[k],
        legendFontColor: isDark ? "#FFFFFF" : "#000",
        legendFontSize: 15
      }));
  };

  const dadosDoGrafico = contarHumores();

  // Não mostra o gráfico se não houver dados para exibir
  if (dadosDoGrafico.length === 0) {
    return null;
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: isDark ? '#fff' : '#000',
      }}>
        Frequência dos Humores
      </Text>

      {/* 2. Usa o componente PieChart da nova biblioteca */}
      <PieChart
        data={dadosDoGrafico}
        width={Dimensions.get("window").width - 40} // Pega a largura da tela
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute // Mostra os valores absolutos em vez de porcentagens
      />
    </View>
  );
}