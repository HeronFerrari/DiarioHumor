import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

 function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

   const handleLogin = async () => {
    if (email === '' || senha === '') {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    try {
      // Usa a função do Firebase para fazer o login
      await signInWithEmailAndPassword(auth, email, senha);
      // O onAuthStateChanged no seu AppNavigator vai detectar o login e mudar a tela para a Home automaticamente.
      // Não precisamos mais do redirecionamento manual.
    } catch (err) {
      setError('Email ou senha inválidos.');
      console.error("Erro de login do Firebase:", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Entrar" onPress={handleLogin} />
      <View style={styles.separator} />
      <Button 
        title="Não tem uma conta? Cadastre-se" 
        onPress={() => navigation.navigate('Cadastro')} // Navega para a tela de Cadastro
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  separator: { marginVertical: 10 }
});

export default LoginScreen;