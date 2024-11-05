import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import DropdownSelect from '../../../components/Onboarding/DropdownSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DispositivoScreen({ navigation }) {
  const [dispositivo, setDispositivo] = useState<string | null>(null);
  const opcionesDispositivo = [
    { label: 'Móvil', value: 'Móvil' },
    { label: 'Tablet', value: 'Tablet' },
    { label: 'Desktop', value: 'Desktop' },
  ];

  const guardarDispositivo = async () => {
    if (!dispositivo) {
      Alert.alert('Por favor selecciona un tipo de dispositivo');
      return;
    }

    try {
      // Guarda el tipo de dispositivo temporalmente en AsyncStorage
      await AsyncStorage.setItem('dispositivo', dispositivo);

      // Navega a la siguiente pantalla del onboarding
      navigation.navigate('DiaPreferidoScreen');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el dispositivo localmente');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <DropdownSelect
        label="Selecciona tu dispositivo"
        items={opcionesDispositivo}
        value={dispositivo}
        setValue={setDispositivo}
      />
      <Button title="Siguiente" onPress={guardarDispositivo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});
