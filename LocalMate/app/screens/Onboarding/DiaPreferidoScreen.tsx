import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { db, auth } from '../../database/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DiaPreferidoScreen({ navigation }) {
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);

  const opcionesDias = [
    { id: 'lunes', name: 'Lunes' },
    { id: 'martes', name: 'Martes' },
    { id: 'miercoles', name: 'Miércoles' },
    { id: 'jueves', name: 'Jueves' },
    { id: 'viernes', name: 'Viernes' },
    { id: 'sabado', name: 'Sábado' },
    { id: 'domingo', name: 'Domingo' },
  ];

  const clasificarDias = () => {
    const finesDeSemana = ['viernes', 'sabado', 'domingo'];
    const seleccionFinesDeSemana = diasSeleccionados.every(dia => finesDeSemana.includes(dia));
    return seleccionFinesDeSemana ? 'Fines de semana' : 'Días de semana';
  };

  const guardarDiaPreferido = async () => {
    if (diasSeleccionados.length === 0) {
      Alert.alert('Por favor selecciona al menos un día');
      return;
    }

    const diaPreferido = clasificarDias();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'No se pudo autenticar el usuario');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { dia_preferido_visita: diaPreferido });
      } else {
        await setDoc(userRef, { dia_preferido_visita: diaPreferido });
      }

      // Aquí llamamos a `completeOnboarding` al final del flujo de onboarding
      completeOnboarding();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el día preferido en Firebase');
      console.error(error);
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    navigation.navigate('HomeUser');
 };
 


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona tus días preferidos para salir</Text>
      <MultiSelect
        items={opcionesDias}
        uniqueKey="id"
        onSelectedItemsChange={setDiasSeleccionados}
        selectedItems={diasSeleccionados}
        selectText="Selecciona días"
        searchInputPlaceholderText="Buscar días..."
        tagRemoveIconColor="#4A90E2"
        tagBorderColor="#4A90E2"
        tagTextColor="#4A90E2"
        selectedItemTextColor="#4A90E2"
        selectedItemIconColor="#4A90E2"
        itemTextColor="#000"
        displayKey="name"
        submitButtonColor="#4A90E2"
        submitButtonText="Seleccionar"
      />
      <Button title="Finalizar" onPress={guardarDiaPreferido} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
});
