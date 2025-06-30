import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Alert, Switch } from 'react-native';
import { auth } from '../firebaseConfig'; // Importe a instância do auth
import { useRegistros } from '../contexts/RegistrosContext';
import { useTheme } from '../contexts/ThemeContext';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import prompt from 'react-native-prompt-android'; // Importa o prompt

function PerfilScreen() {
  const usuario = auth.currentUser; // Pega os dados do usuário logado no Firebase
  const { isDark, toggleTheme, cores } = useTheme();
  const { limparRegistros } = useRegistros();

   const handleUpdateProfile = () => {
    prompt(
      'Alterar Apelido',
      'Digite seu novo nome de usuário:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: async (novoNome) => {
            if (novoNome) {
              try {
                await updateProfile(auth.currentUser, { displayName: novoNome });
                Alert.alert('Sucesso', 'Seu nome foi atualizado!');
                // Forçar a re-renderização pode ser necessário aqui, mas o onAuthStateChanged pode cuidar disso.
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível atualizar o nome.');
                console.error(error);
              }
            }
          },
        },
      ],
      {
        type: 'plain-text',
        placeholder: 'Novo apelido',
      }
    );
  };

  const handleResetPassword = () => {
    if (usuario?.email) {
      sendPasswordResetEmail(auth, usuario.email)
        .then(() => {
          Alert.alert('Verifique seu E-mail', `Um link para redefinir sua senha foi enviado para ${usuario.email}.`);
        })
        .catch((error) => {
          Alert.alert('Erro', 'Não foi possível enviar o e-mail de redefinição.');
          console.error(error);
        });
    }
  };


  const handleLogout = async () => {
    try {
      await auth.signOut();
      // O onAuthStateChanged no AppNavigator vai detectar o logout e mudar as telas automaticamente.
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer o logout.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f0f2f5' }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu Perfil</Text>
        
        {usuario ? (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{usuario.email}</Text>
            
            <Text style={styles.label}>ID do Usuário:</Text>
            <Text style={styles.info}>{usuario.uid}</Text>
          </View>
        ) : (
          <Text>Não foi possível carregar os dados do usuário.</Text>
        )}

        <View style={{ marginVertical: 20 }}>
            <Button title="Limpar Dados de Humor Antigos (Temporário)" color="#ffae42" onPress={limparRegistros} />
        </View>

        <View style={styles.themeContainer}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Modo Escuro</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleTheme}
                value={isDark}
            />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Alterar Apelido" onPress={handleUpdateProfile} />
          <View style={styles.separator} />
          <Button title="Redefinir Senha por E-mail" onPress={handleResetPassword} />
          <View style={styles.separator} />
          <Button title="Deslogar" color="#dc3545" onPress={handleLogout} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background, // Use a cor do tema
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
      color: cores.texto, // Cor do texto do título
    },
    infoContainer: {
      backgroundColor: cores.card, // Cor do cartão de informações
      padding: 20,
      borderRadius: 10,
      marginBottom: 30,
    },
    label: {
      fontSize: 16,
      color: cores.texto + '80', // Rótulos mais sutis
    },
    info: {
      fontSize: 18,
      marginBottom: 15,
      color: cores.texto, // Informações com a cor do texto
    },
    buttonContainer: {
      marginTop: 20,
    },
    separator: {
      marginVertical: 5,
    },
    themeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: cores.card, // Fundo do container do tema
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
    },
    themeText: {
      color: cores.texto, // Texto do tema
    },
  });
  
export default PerfilScreen;