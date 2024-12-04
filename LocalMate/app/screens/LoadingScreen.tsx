// app/screens/LoadingScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function LoadingScreen({ navigation }) {
  // Redirige después de la animación
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('HomeScreen'); // Cambia 'HomeScreen' por tu pantalla inicial
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="pulse" 
        iterationCount="infinite" 
        duration={1000} 
        source={require('assets/images/home_logo.png')} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fondo blanco
  },
  image: {
    width: 200,
    height: 200,
  },
});
