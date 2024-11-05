import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import NivelSocioeconomicoSelector from '../../../components/Onboarding/NivelSocioeconomicoSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NivelSocioeconomicoScreen({ navigation }) {
  const [distrito, setDistrito] = useState<string | null>(null);
  const [gasto, setGasto] = useState<number | null>(null);

  const guardarNivelSocioeconomico = async () => {
    if (!distrito || gasto === null) {
      Alert.alert('Por favor, completa todos los campos.');
      return;
    }

    let nivel = 'Medio';
    if (['San Isidro', 'Miraflores', 'La Molina', 'San Borja'].includes(distrito) && gasto > 150) {
      nivel = 'Alto';
    } else if (gasto < 50 || ['Comas', 'San Juan de Lurigancho', 'Villa María del Triunfo'].includes(distrito)) {
      nivel = 'Bajo';
    }

    try {
      // Guarda el nivel socioeconómico temporalmente en AsyncStorage
      await AsyncStorage.setItem('nivel_socioeconomico', nivel);

      // Navega a la siguiente pantalla del onboarding
      navigation.navigate('FrecuenciaVisitasScreen');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el nivel socioeconómico localmente.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <NivelSocioeconomicoSelector onSelectDistrito={setDistrito} onSelectGasto={setGasto} />
      <Button title="Siguiente" onPress={guardarNivelSocioeconomico} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
});
