// app/screens/Onboarding/NivelSocioeconomicoScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import NivelSocioeconomicoSelector from '../../../components/Onboarding/NivelSocioeconomicoSelector';
import { db, auth } from '../../database/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

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

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'No se pudo autenticar el usuario.');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { nivel_socioeconomico: nivel });
      } else {
        await setDoc(userRef, { nivel_socioeconomico: nivel });
      }

      navigation.navigate('FrecuenciaVisitasScreen');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el nivel socioeconómico en Firebase.');
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
