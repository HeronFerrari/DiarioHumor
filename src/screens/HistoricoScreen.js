// screens/HistoricoScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRegistros } from '../contexts/RegistrosContext'; // <-- Importa o hook do nosso contexto
import GraficoHumor from '../components/GraficoHumor';
import { useTheme } from '../contexts/ThemeContext';


export default function HistoricoScreen() {
  // Pega a lista de registros do nosso contexto global
  const { registros, deletarRegistro } = useRegistros();
  const { isDark, cores } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.registro}>
            <View style={styles.registroInfo}>
                <Text>{item.data} - {item.humor}</Text>
                 {item.comentario ? <Text style={styles.comentario}>{item.comentario}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => deletarRegistro(item.id)}>
              <Ionicons name="trash-bin-outline" size={24} color="red" />
            </TouchableOpacity>
        </View>
        )}
        // O Gráfico agora é o cabeçalho desta lista
        ListHeaderComponent={<GraficoHumor registros={registros} />}
        ListEmptyComponent={<Text style={styles.aviso}>Nenhum registro encontrado.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: cores.background }, // Cor de fundo
    registro: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: cores.texto + '20', // Borda sutil com base na cor do texto
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: cores.card, // Fundo do item
    },
    registroInfo: {
      flex: 1,
    },
    comentario: {
      color: cores.texto + '80', // Texto mais sutil
      fontStyle: 'italic',
      marginTop: 4,
    },
    aviso: { textAlign: 'center', marginTop: 50, fontSize: 16, color: cores.texto }, // Cor do texto do aviso
  });
