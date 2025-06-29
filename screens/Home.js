import React, { useState, useEffect } from 'react';
import CalendarioHumor from '../components/CalendarioHumor';
import GraficoHumor from '../components/GraficoHumor';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  useColorScheme,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';

export default function Home() {
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

  const registrarHumor = async (humorSelecionado) => {
    if (!humorSelecionado) {
      Alert.alert('Escolha um humor antes de salvar.');
      return;
    }

    const dataAtual = format(new Date(), 'dd/MM/yyyy');

    const novoRegistro = {
      data: dataAtual,
      humor: humorSelecionado,
      comentario: comentario.trim(),
    };

    try {
      const registrosExistentes = await AsyncStorage.getItem('registros');
      const registros = registrosExistentes ? JSON.parse(registrosExistentes) : [];

      // Evita duplicar registro no mesmo dia
      const atualizado = registros.filter(r => r.data !== dataAtual);
      atualizado.unshift(novoRegistro);

      await AsyncStorage.setItem('registros', JSON.stringify(atualizado));
      setRegistros(atualizado);
      setComentario('');
      setHumor('');

      Alert.alert('Registro salvo com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao salvar o registro.');
    }
  };

  const exportarJSON = async () => {
    try {
      const dados = await AsyncStorage.getItem('registros');
      if (!dados) {
        Alert.alert('Nenhum registro para exportar.');
        return;
      }

      const caminho = FileSystem.documentDirectory + 'diario_humor.json';
      await FileSystem.writeAsStringAsync(caminho, dados, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(caminho);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao exportar dados.');
    }
  };

  return (
    <ScrollView style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={[styles.titulo, { color: isDark ? '#fff' : '#000' }]}>Como você está se sentindo hoje?</Text>

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
          style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#666' : '#ccc' }]}
          placeholder="Quer comentar algo?"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={comentario}
          onChangeText={setComentario}
        />

        <TouchableOpacity style={styles.botao} onPress={() => registrarHumor(humor)}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, { backgroundColor: '#2196F3', marginTop: 10 }]} onPress={exportarJSON}>
          <Text style={styles.textoBotao}>Exportar JSON</Text>
        </TouchableOpacity>

        <Text style={[styles.subtitulo, { color: isDark ? '#fff' : '#000' }]}>Registros anteriores:</Text>

        {registros.length > 0 && (
        <CalendarioHumor registros={registros} />
      )}


        {registros.length > 0 && (
        <GraficoHumor registros={registros} />
      )}

        <FlatList
          data={registros}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.registro}>
              <Text style={{ color: isDark ? '#fff' : '#000' }}>{item.data} - {item.humor} - {item.comentario}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  opcoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 40,
    marginHorizontal: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  registro: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
