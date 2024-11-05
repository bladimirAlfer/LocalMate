import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { db, auth } from '../../database/firebase';
import { doc, setDoc } from 'firebase/firestore';
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
      // Recupera todos los datos de AsyncStorage
      const preferencia = await AsyncStorage.getItem('preferencia');
      const nivelSocioeconomico = await AsyncStorage.getItem('nivel_socioeconomico');
      const frecuenciaVisitas = await AsyncStorage.getItem('frecuencia_visitas');
      const dispositivo = await AsyncStorage.getItem('dispositivo');
  
      // Guarda todos los datos en Firebase en una sola operación
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        preferencias: preferencia,
        nivel_socioeconomico: nivelSocioeconomico,
        frecuencia_visitas: frecuenciaVisitas,
        dispositivo: dispositivo,
        dia_preferido_visita: diaPreferido,
        hasCompletedOnboarding: true // Marca el onboarding como completado en Firebase
      }, { merge: true });
  
      // Limpia AsyncStorage y marca el onboarding como completado en esta sesión
      await AsyncStorage.multiRemove(['preferencia', 'nivel_socioeconomico', 'frecuencia_visitas', 'dispositivo']);
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
  
      // Navega a HomeUser
      navigation.navigate('HomeUser');
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el onboarding');
      console.error(error);
    }
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
