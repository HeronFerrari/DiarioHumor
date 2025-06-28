import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrar = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="E-mail" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry onChangeText={setSenha} style={styles.input} />
      <Button title="Cadastrar" onPress={cadastrar} />
      <Text onPress={() => navigation.goBack()} style={styles.link}>
        Já tem conta? Voltar ao login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { marginTop: 10, color: 'blue', textAlign: 'center' },
});
