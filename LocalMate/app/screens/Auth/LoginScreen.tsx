// app/screens/Auth/LoginScreen.tsx
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
import { auth, signInWithEmailAndPassword, db } from '../../database/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { CommonActions } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        let hasCompletedOnboarding = await AsyncStorage.getItem(
          'hasCompletedOnboarding'
        );

        if (!hasCompletedOnboarding) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          hasCompletedOnboarding =
            userDoc.exists() && userDoc.data()?.hasCompletedOnboarding
              ? 'true'
              : 'false';

          await AsyncStorage.setItem(
            'hasCompletedOnboarding',
            hasCompletedOnboarding
          );
        }

        if (hasCompletedOnboarding === 'true') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'AppDrawer' }],
            })
          );
        } else {
          navigation.replace('PreferenciasScreen');
        }
      }
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    } finally {
      setLoading(false);
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

      <Text style={styles.title}>Iniciar Sesión</Text>

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
          styles.loginButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
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
  loginButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#32B768',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
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
    opacity: 0.8, // Efecto al presionar
  },
});
