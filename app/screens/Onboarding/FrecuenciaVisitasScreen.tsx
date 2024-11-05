import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import DropdownSelect from '../../../components/Onboarding/DropdownSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FrecuenciaVisitasScreen({ navigation }) {
  const [frecuencia, setFrecuencia] = useState<string | null>(null);
  const opcionesFrecuencia = [
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
  ];

  const guardarFrecuencia = async () => {
    if (!frecuencia) {
      Alert.alert('Por favor selecciona una frecuencia de visitas');
      return;
    }

    try {
      // Guarda la frecuencia de visitas temporalmente en AsyncStorage
      await AsyncStorage.setItem('frecuencia_visitas', frecuencia);

      // Navega a la siguiente pantalla del onboarding
      navigation.navigate('DispositivoScreen');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la frecuencia de visitas localmente');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <DropdownSelect
        label="Selecciona tu frecuencia de visitas"
        items={opcionesFrecuencia}
        value={frecuencia}
        setValue={setFrecuencia}
      />
      <Button title="Siguiente" onPress={guardarFrecuencia} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});
