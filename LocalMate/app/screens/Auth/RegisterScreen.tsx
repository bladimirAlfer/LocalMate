// app/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, createUserWithEmailAndPassword, db } from '../../database/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Establece hasCompletedOnboarding en false en Firebase y AsyncStorage
      await setDoc(doc(db, 'users', userId), { hasCompletedOnboarding: false });
      await AsyncStorage.setItem('hasCompletedOnboarding', 'false');

      // Navega al inicio del onboarding
      navigation.replace('PreferenciasScreen');
    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Vuelve a HomeScreen
      >
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>

      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />

      <Pressable
        style={({ pressed }) => [
          styles.registerButton,
          pressed && styles.buttonPressed, // Agrega efecto al presionar
        ]}
        onPress={handleRegister}
      >
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#D1FAE5',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#333',
  },
  registerButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#32B768',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    color: '#10B981',
    fontSize: 14,
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.8, 
  },
});
