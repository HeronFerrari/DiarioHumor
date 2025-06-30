// src/contexts/RegistrosContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { format } from 'date-fns';

const RegistrosContext = createContext({});

export function RegistrosProvider({ children }) {
  const [registros, setRegistros] = useState([]);

  // Carrega os registros do AsyncStorage quando o app inicia
  useEffect(() => {
    async function loadStorageData() {
      const storageRegistros = await AsyncStorage.getItem('registros');
      if (storageRegistros) {
        setRegistros(JSON.parse(storageRegistros));
      }
    }
    loadStorageData();
  }, []);

  // Função para registrar um novo humor
  const registrarHumor = async (humorSelecionado, comentario, data) => {
    if (!humorSelecionado) {
      Alert.alert('Escolha um humor antes de salvar.');
      return;
    }

    const dataFormatada = format(data, 'dd/MM/yyyy');
    const novoRegistro = {
      id: Date.now().toString(),
      data: dataFormatada,
      humor: humorSelecionado,
      comentario: comentario.trim(),
    };

    try {
      const registrosAtualizados = [novoRegistro, ...registros];
      await AsyncStorage.setItem('registros', JSON.stringify(registrosAtualizados));
      setRegistros(registrosAtualizados);
      Alert.alert('Sucesso!', 'Seu humor foi registrado.');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o registro.');
    }
  };

    const deletarRegistro = (idParaDeletar) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja apagar este registro de humor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              const registrosFiltrados = registros.filter(r => r.id !== idParaDeletar);
              await AsyncStorage.setItem('registros', JSON.stringify(registrosFiltrados));
              setRegistros(registrosFiltrados);
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível apagar o registro.');
            }
          }
        }
      ]
    );
  };

  const limparRegistros = () => {
   Alert.alert(
      "Apagar Todo o Histórico", // Título do Alerta
      "Esta ação é irreversível. Você tem certeza que deseja apagar todos os seus registros de humor?", // Mensagem
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Apagar Tudo",
          style: "destructive",
          // Só executa a limpeza se o usuário confirmar
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('registros');
              setRegistros([]); // Limpa o estado na tela
              Alert.alert('Sucesso', 'Seu histórico foi apagado.');
            } catch (error) {
              console.error("Erro ao limpar registros:", error);
              Alert.alert('Erro', 'Não foi possível apagar os registros.');
            }
          }
        }
      ]
    );
  };


  return (
    <RegistrosContext.Provider value={{ registros, registrarHumor, deletarRegistro, limparRegistros }}>
      {children}
    </RegistrosContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useRegistros() {
  const context = useContext(RegistrosContext);
  return context;
}