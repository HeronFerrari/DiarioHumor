import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { auth } from '../firebaseConfig';
import { useRegistros } from '../contexts/RegistrosContext'; 
import { useTheme } from '../contexts/ThemeContext';
import { Image } from 'react-native';
import logo from '../../assets/diarioHumor.png';

export default function Home() {
  const { cores } = useTheme();
  const [humor, setHumor] = useState('');
  const [comentario, setComentario] = useState('');
  const [data, setData] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { registrarHumor } = useRegistros();

  // Se 'cores' ainda não carregou, mostra uma tela de loading.
  if (!cores) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // A criação de estilos com useMemo está correta.
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.background },
    content: { flex: 1, justifyContent: 'center', padding: 20 },
    titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: cores.text },
    botaoData: { backgroundColor: cores.accent, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    textoBotaoData: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
    opcoes: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    emoji: { fontSize: 50 },
    logo: {width: '80%',  height: 100,  alignSelf: 'center',  marginBottom: 20,  },
    input: { borderWidth: 1, borderColor: cores.subtleText, borderRadius: 8, padding: 15, marginBottom: 20, minHeight: 80, color: cores.text, backgroundColor: cores.card },
    botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center' },
    textoBotao: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  }), [cores]);

  const handleSalvar = () => {
    registrarHumor(humor, comentario, data);
    setHumor('');
    setComentario('');
  };
  
  const onChangeData = (event, selectedDate) => {
    const dataAtual = selectedDate || data;
    setShowPicker(Platform.OS === 'ios' ? true : false);
    setData(dataAtual);
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.titulo}>Bem vindo ao Diario de Humor ! </Text>
        <Text style={styles.titulo}>Olá, {auth.currentUser?.displayName || auth.currentUser?.email}! Como você está?</Text>
        
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
          placeholderTextColor={cores.subtleText}
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