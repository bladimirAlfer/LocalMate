// app/screens/Onboarding/PreferenciasScreen.tsx
import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import DropdownSelect from '../../../components/Onboarding/DropdownSelect';
import { db, auth } from '../../database/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'No se pudo autenticar el usuario');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { preferencias: preferencia });
      } else {
        await setDoc(userRef, { preferencias: preferencia });
      }

      navigation.navigate('NivelSocioeconomicoScreen'); // Ir a la siguiente pantalla
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la preferencia en Firebase');
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
