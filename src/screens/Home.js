// screens/Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { auth } from '../firebaseConfig'; // <-- Importa a configuração do Firebase
import { useRegistros } from '../contexts/RegistrosContext'; 
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  // Estados locais apenas para este formulário
  const [humor, setHumor] = useState('');
  const [comentario, setComentario] = useState('');
  const [data, setData] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { isDark, cores } = useTheme();

  // Pega a função 'registrarHumor' do nosso contexto global
  const { registrarHumor } = useRegistros();

  const handleSalvar = () => {
    registrarHumor(humor, comentario, data);
    setHumor('');
    setComentario('');
  };
  
  const onChangeData = (event, selectedDate) => {
    const dataAtual = selectedDate || data;
    setShowPicker(Platform.OS === 'ios');
    setData(dataAtual);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titulo}>Olá, {auth.currentUser.displayName || auth.currentUser.email}! Como você está?</Text>
        
        <TouchableOpacity style={styles.botaoData} onPress={() => setShowPicker(true)}>
          <Text style={styles.textoBotaoData}>Registrar para: {format(data, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker value={data} mode='date' display='default' onChange={onChangeData} />
        )}

        <View style={styles.opcoes}>
          <TouchableOpacity onPress={() => setHumor('feliz')}><Text style={styles.emoji}>😄</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setHumor('neutro')}><Text style={styles.emoji}>😐</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setHumor('triste')}><Text style={styles.emoji}>😢</Text></TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Escreva uma nota sobre o seu dia..."
          value={comentario}
          onChangeText={setComentario}
        />
        <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar Humor</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.background }, // Use a cor do tema
    content: { flex: 1, justifyContent: 'center', padding: 20 },
    titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: cores.texto }, // Cor do texto
    botaoData: { backgroundColor: cores.accent, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 }, // Cor de destaque
    textoBotaoData: { color: cores.texto, fontWeight: 'bold', fontSize: 16 }, // Cor do texto
    opcoes: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    emoji: { fontSize: 50 },
    input: { borderWidth: 1, borderColor: cores.texto, borderRadius: 8, padding: 15, marginBottom: 20, minHeight: 80, color: cores.texto, backgroundColor: cores.card }, // Cores do input
    botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center' },
    textoBotao: { color: cores.texto, fontWeight: 'bold', fontSize: 16 }, // Cor do texto do botão (pode ajustar)
  });