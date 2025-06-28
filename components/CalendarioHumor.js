// components/CalendarioHumor.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarioHumor({ registros }) {
  const [selecionado, setSelecionado] = useState(null);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const registrosPorData = {};
  registros.forEach(r => {
    const [dia, mes, ano] = r.data.split('/');
    const formatoISO = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    registrosPorData[formatoISO] = r;
  });

  const marcacoes = {};
  Object.keys(registrosPorData).forEach(data => {
    const humor = registrosPorData[data].humor;
    marcacoes[data] = {
      marked: true,
      dotColor:
        humor === 'feliz' ? '#4CAF50' :
        humor === 'neutro' ? '#FFC107' :
        '#F44336',
      selected: data === selecionado,
      selectedColor: '#90CAF9',
    };
  });

  const registroSelecionado = selecionado ? registrosPorData[selecionado] : null;

  return (
    <View>
      <Text style={[styles.titulo, { color: isDark ? '#fff' : '#000' }]}>Calendário de Humor</Text>
      <Calendar
        onDayPress={day => setSelecionado(day.dateString)}
        markedDates={marcacoes}
        theme={{
          calendarBackground: isDark ? '#000' : '#fff',
          dayTextColor: isDark ? '#fff' : '#000',
          monthTextColor: isDark ? '#fff' : '#000',
          selectedDayTextColor: '#fff',
          selectedDayBackgroundColor: '#2196F3',
        }}
      />

      {registroSelecionado && (
        <View style={styles.registro}>
          <Text style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>
            {registroSelecionado.data}
          </Text>
          <Text style={{ color: isDark ? '#fff' : '#000' }}>
            Humor: {registroSelecionado.humor}
          </Text>
          <Text style={{ color: isDark ? '#fff' : '#000' }}>
            Comentário: {registroSelecionado.comentario || 'Sem comentário'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 18,
    marginVertical: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  registro: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
});
