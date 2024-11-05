// app/screens/Onboarding/FrecuenciaVisitasScreen.tsx
import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import DropdownSelect from '../../../components/Onboarding/DropdownSelect';
import { db, auth } from '../../database/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'No se pudo autenticar el usuario');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { frecuencia_visitas: frecuencia });
      } else {
        await setDoc(userRef, { frecuencia_visitas: frecuencia });
      }

      navigation.navigate('DispositivoScreen'); // Ir a la siguiente pantalla
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la frecuencia de visitas en Firebase');
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
