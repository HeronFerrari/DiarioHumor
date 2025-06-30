import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("ERRO CAPTURADO PELO BOUNDARY:", error, errorInfo);
    this.setState({ error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ops! Algo deu errado.</Text>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Mensagem de Erro:</Text>
            {/* AQUI ESTÁ O TEXTO DO ERRO QUE VOCÊ PODE COPIAR */}
            <Text selectable={true} style={styles.errorMessage}>
              {this.state.error && this.state.error.toString()}
            </Text>
            <Text style={styles.errorTitle}>Detalhes (Component Stack):</Text>
            <Text selectable={true} style={styles.errorStack}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </Text>
          </View>
          <Button title="Tentar Novamente" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }

    return this.props.children;
  }
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#282c34' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ff5555', marginBottom: 20 },
  errorContainer: { backgroundColor: '#333', padding: 15, borderRadius: 5, marginBottom: 20, width: '100%'},
  errorTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffc107', marginBottom: 5 },
  errorMessage: { color: 'white', fontFamily: 'monospace', fontSize: 14, marginBottom: 15 },
  errorStack: { color: '#ccc', fontSize: 10, fontFamily: 'monospace' }
});

export default ErrorBoundary;