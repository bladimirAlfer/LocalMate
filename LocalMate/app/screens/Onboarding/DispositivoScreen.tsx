// app/screens/Onboarding/DispositivoScreen.tsx
import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import DropdownSelect from '../../../components/Onboarding/DropdownSelect';
import { db, auth } from '../../database/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'No se pudo autenticar el usuario');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { dispositivo: dispositivo });
      } else {
        await setDoc(userRef, { dispositivo: dispositivo });
      }

      navigation.navigate('DiaPreferidoScreen'); // Ir a la siguiente pantalla
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el dispositivo en Firebase');
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
