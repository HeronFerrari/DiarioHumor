import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [humor, setHumor] = useState('');
  const [comentario, setComentario] = useState('');
  const [registros, setRegistros] = useState([]);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
  const carregarRegistros = async () => {
    const data = await AsyncStorage.getItem('registros');
    if (data) setRegistros(JSON.parse(data));
    };
  carregarRegistros();
  }, []);


  const registrarHumor = async(humorSelecionado) => {
    if (!humorSelecionado) {
      Alert.alert('Escolha um humor antes de salvar.');
      return;
    }

  const registro = {
      data: new Date().toLocaleDateString(),
      humor: humorSelecionado,
      comentario
    };

    try {
      const registrosExistentes = await AsyncStorage.getItem('registros');
      const registros = registrosExistentes ? JSON.parse(registrosExistentes) : [];
      registros.push(registro);
      await AsyncStorage.setItem('registros', JSON.stringify(registros));

      Alert.alert('Registro salvo com sucesso!');
      setHumor('');
      setComentario('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao salvar o registro.');
    }
  }


  const exportarJSON = async () => {
  const dados = await AsyncStorage.getItem('registros');
  if (dados) {
    const blob = new Blob([dados], { type: 'application/json' });
    // Use expo-file-system ou share para exportar
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Como você está se sentindo hoje?</Text>

      <View style={styles.opcoes}>
        <TouchableOpacity onPress={() => setHumor('feliz')}>
          <Text style={styles.emoji}>😄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setHumor('neutro')}>
          <Text style={styles.emoji}>😐</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setHumor('triste')}>
          <Text style={styles.emoji}>😢</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Quer comentar algo?"
        value={comentario}
        onChangeText={setComentario}
      />

       <TouchableOpacity style={styles.botao} onPress={() => registrarHumor(humor)}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>
      <Text style={{ fontWeight: 'bold', marginTop: 30 }}>Registros anteriores:</Text>
      {registros.map((item, index) => (
      <Text key={index}>{item.data} - {item.humor} - {item.comentario}</Text>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    marginBottom: 20,
  },
  opcoes: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 40,
    marginHorizontal: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
