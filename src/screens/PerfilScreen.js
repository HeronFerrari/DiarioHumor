import React, { useState, useMemo } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Alert, Switch, ActivityIndicator, Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { useRegistros } from '../contexts/RegistrosContext';
import { useTheme } from '../contexts/ThemeContext';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import PromptModal from '../components/PromptModal';
import { Ionicons } from '@expo/vector-icons';

// 1. A função agora recebe 'usuario' como uma propriedade (prop)
function PerfilScreen({ usuario }) { 
  const { isDark, toggleTheme, cores } = useTheme();
  const { limparRegistros } = useRegistros();
  const [isPromptVisible, setPromptVisible] = useState(false);

  // Verificação de segurança: se as cores ou o usuário ainda não carregaram, mostra um loading
  if (!cores || !usuario) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // Estilos otimizados com useMemo
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.background },
    content: { padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: cores.text },
    infoContainer: { backgroundColor: cores.card, padding: 20, borderRadius: 10, marginBottom: 20 },
    label: { fontSize: 16, color: cores.subtleText },
    info: { fontSize: 18, marginBottom: 15, color: cores.text },
    themeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: cores.card, padding: 15, borderRadius: 10, marginBottom: 20 },
    themeText: { color: cores.text, fontSize: 16 },
    buttonContainer: { marginTop: 10 },
    separator: { marginVertical: 8 }
  }), [cores]);

  // --- SUAS FUNÇÕES ESTÃO AQUI, INTACTAS E FUNCIONAIS ---
  const handleUpdateProfile = async (novoNome) => {
    setPromptVisible(false);
    if (novoNome && novoNome.trim()) {
      try {
        await updateProfile(auth.currentUser, { displayName: novoNome });
        Alert.alert('Sucesso', 'Seu nome foi atualizado!');
        // O React vai re-renderizar e mostrar o novo nome.
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o nome.');
        console.error(error);
      }
    }
  };

  const handleResetPassword = () => {
    if (usuario?.email) {
      sendPasswordResetEmail(auth, usuario.email)
        .then(() => Alert.alert('Verifique seu E-mail', `Um link foi enviado para ${usuario.email}.`))
        .catch((error) => Alert.alert('Erro', 'Não foi possível enviar o e-mail.'));
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.avatarContainer}>
                    {usuario.photoURL ? (
                        // Se o usuário TEM uma photoURL, exibe a imagem
                        <Image source={{ uri: usuario.photoURL }} style={styles.avatar} />
                    ) : (
                        // Se NÃO TEM, exibe um ícone padrão
                        <Ionicons name="person-circle" size={120} color={cores.subtleText} />
                    )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Apelido:</Text>
          <Text style={styles.info}>{usuario.displayName || 'Não definido'}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{usuario.email}</Text>
        </View>
        
        <View style={styles.themeContainer}>
          <Text style={styles.themeText}>Modo Escuro</Text>
          <Switch
            trackColor={{ false: "#767577", true: cores.accent }}
            thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleTheme}
            value={isDark}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Alterar Apelido" color={cores.accent} onPress={() => setPromptVisible(true)} />
          <View style={styles.separator} />
          <Button title="Redefinir Senha" color={cores.accent} onPress={handleResetPassword} />
          <View style={styles.separator} />
          <Button title="Limpar Histórico" color="#ffae42" onPress={limparRegistros} />
          <View style={styles.separator} />
          <Button title="Deslogar" color="#dc3545" onPress={handleLogout} />
        </View>
      </View>

      <PromptModal
        visible={isPromptVisible}
        onClose={() => setPromptVisible(false)}
        onSubmit={handleUpdateProfile}
        title="Alterar Apelido"
        message="Digite seu novo nome de usuário:"
        placeholder="Novo apelido"
      />
    </SafeAreaView>
  );
}

export default PerfilScreen;