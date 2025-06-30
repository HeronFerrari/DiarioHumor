import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRegistros } from '../contexts/RegistrosContext';
import GraficoHumor from '../components/GraficoHumor';
import { useTheme } from '../contexts/ThemeContext';

export default function HistoricoScreen() {
  const { registros, deletarRegistro } = useRegistros();
  const { cores } = useTheme();

  // 1. Verificação de segurança: Se as cores não carregaram, mostra um loading.
  if (!cores) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // 2. Os estilos agora são criados com segurança, pois temos certeza que 'cores' existe.
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: cores.background },
    registro: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: cores.subtleText,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: cores.card,
      marginVertical: 4,
      borderRadius: 8,
    },
    registroInfo: {
      flex: 1,
      marginRight: 10,
    },
    registroTexto: {
      color: cores.text,
      fontWeight: 'bold',
    },
    comentario: {
      color: cores.subtleText,
      fontStyle: 'italic',
      marginTop: 4,
    },
    aviso: { 
      textAlign: 'center', 
      marginTop: 50, 
      fontSize: 16, 
      color: cores.subtleText 
    },
  }), [cores]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.registro}>
            <View style={styles.registroInfo}>
              {/* 3. O texto agora usa os estilos dinâmicos */}
              <Text style={styles.registroTexto}>{item.data} - {item.humor}</Text>
              {item.comentario ? <Text style={styles.comentario}>{item.comentario}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => deletarRegistro(item.id)}>
              <Ionicons name="trash-bin-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={<GraficoHumor registros={registros} />}
        ListEmptyComponent={<Text style={styles.aviso}>Nenhum registro encontrado.</Text>}
      />
    </SafeAreaView>
  );
}