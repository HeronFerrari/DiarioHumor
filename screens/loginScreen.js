import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="E-mail" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry onChangeText={setSenha} style={styles.input} />
      <Button title="Entrar" onPress={login} />
      <Text onPress={() => navigation.navigate('Cadastro')} style={styles.link}>
        Não tem conta? Cadastre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { marginTop: 10, color: 'blue', textAlign: 'center' },
});
