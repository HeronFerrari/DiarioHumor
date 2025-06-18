import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [humor, setHumor] = useState('');
  const [comentario, setComentario] = useState('');

  const registrarHumor = async () => {
    if (!humor) {
      Alert.alert('Escolha um humor antes de salvar.');
      return;
    }

  const registro = {
      data: new Date().toLocaleDateString(),
      humor,
      comentario,
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Como você está se sentindo hoje?</Text>

      <View style={styles.opcoes}>
        <TouchableOpacity onPress={() => registrarHumor('feliz')}>
          <Text style={styles.emoji}>😄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => registrarHumor('neutro')}>
          <Text style={styles.emoji}>😐</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => registrarHumor('triste')}>
          <Text style={styles.emoji}>😢</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Quer comentar algo?"
        value={comentario}
        onChangeText={setComentario}
      />

       <TouchableOpacity style={styles.botao} onPress={registrarHumor}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>
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
