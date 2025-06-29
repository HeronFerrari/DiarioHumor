import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Config padrão do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCPpaXTENCcgZFTGEVlKFBqkmmsoDpU3PY',
  authDomain: "diariodehumor-7adc7.firebaseapp.com",
  projectId: 'diariodehumor-7adc7',
  storageBucket: "diariodehumor-7adc7.appspot.com",
  messagingSenderId: '92576068194',
  appId: '1:92576068194:web:396a284f6bd38c10be173b',
  measurementId: "G-ZLDD146BVX"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Usa AsyncStorage para persistência compatível com React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth,db };
