import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import DropdownSelect from '../../../components/Onboarding/DropdownSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PreferenciasScreen({ navigation }) {
  const [preferencia, setPreferencia] = useState<string | null>(null);
  const opcionesPreferencias = [
    { label: 'Ropa', value: 'Ropa' },
    { label: 'Salud', value: 'Salud' },
    { label: 'Otros', value: 'Otros' },
    { label: 'Restaurantes', value: 'Restaurantes' },
    { label: 'Tecnología', value: 'Tecnología' },
    { label: 'Entretenimiento', value: 'Entretenimiento' },
  ];

  const guardarPreferencia = async () => {
    if (!preferencia) {
      Alert.alert('Por favor selecciona una preferencia');
      return;
    }
  
    try {
      // Guarda la preferencia temporalmente en AsyncStorage
      await AsyncStorage.setItem('preferencia', preferencia);
      
      // Navega a la siguiente pantalla del onboarding
      navigation.navigate('NivelSocioeconomicoScreen');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la preferencia localmente');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <DropdownSelect
        label="Selecciona tu preferencia"
        items={opcionesPreferencias}
        value={preferencia}
        setValue={setPreferencia}
      />
      <Button title="Siguiente" onPress={guardarPreferencia} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});
