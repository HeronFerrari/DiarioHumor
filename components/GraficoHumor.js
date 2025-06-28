import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { VictoryPie } from 'victory-native';

export default function GraficoHumor({ registros }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const contarHumores = () => {
    const contagem = { feliz: 0, neutro: 0, triste: 0 };
    registros.forEach(r => {
      if (r.humor in contagem) contagem[r.humor]++;
    });

    return Object.keys(contagem)
      .filter(k => contagem[k] > 0)
      .map(k => ({ x: k, y: contagem[k] }));
  };

  return (
    <View>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: isDark ? '#fff' : '#000',
      }}>
        Frequência dos Humores
      </Text>
      <VictoryPie
        data={contarHumores()}
        colorScale={['#4CAF50', '#FFC107', '#F44336']}
        labelRadius={60}
        style={{
          labels: {
            fill: isDark ? '#fff' : '#000',
            fontSize: 14,
          },
        }}
        width={320}
        height={320}
      />
    </View>
  );
}
