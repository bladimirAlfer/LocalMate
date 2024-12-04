// app/screens/Home/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('assets/images/home_image.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>LocalMate</Text>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By logging in or registering, you have agreed to{' '}
        <Text style={styles.linkText}>the Terms and Conditions</Text> and{' '}
        <Text style={styles.linkText}>Privacy Policy.</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '40%',
    marginTop: 50,
  },
  title: {
    position: 'absolute',
    left: 97,
    top: 436,
    color: '#1F2937',
    fontSize: 36,
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 36,
  },
  registerButton: {
    width: 256,
    paddingVertical: 16,
    paddingHorizontal: 64,
    position: 'absolute',
    left: 60,
    top: 538,
    backgroundColor: '#32B768',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
    textAlign: 'center',
  },
  loginButton: {
    width: 256,
    paddingVertical: 16,
    paddingHorizontal: 64,
    position: 'absolute',
    left: 60,
    top: 607,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#10B981',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
    textAlign: 'center',
  },
  footerText: {
    width: 320,
    position: 'absolute',
    left: 36,
    top: 726,
    textAlign: 'center',
    color: '#242323',
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  linkText: {
    color: '#32B768',
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: '400',
    textTransform: 'capitalize',
  },
});
