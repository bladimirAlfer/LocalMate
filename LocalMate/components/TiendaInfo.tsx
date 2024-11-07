import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../app/database/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function TiendaInfo({ tienda, onClose }) {
  const [calificacion, setCalificacion] = useState(3); // Valor inicial de calificación
  const [momentoDia, setMomentoDia] = useState('Mañana');
  const [metodoDescubrimiento, setMetodoDescubrimiento] = useState('Buscador');

  const guardarResena = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'No se pudo autenticar el usuario.');
      return;
    }

    const fechaVisita = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    const interaccionData = {
      user_id: userId,
      tienda_id: tienda.id,
      calificacion,
      fecha_visita: fechaVisita,
      momento_dia_visita: momentoDia,
      metodo_descubrimiento: metodoDescubrimiento,
    };

    try {
      const interaccionRef = doc(db, 'interacciones', `${userId}_${tienda.id}_${fechaVisita}`);
      await setDoc(interaccionRef, interaccionData);
      Alert.alert('Reseña guardada', 'Tu reseña se ha guardado exitosamente.');
      onClose(); // Cierra el modal
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la reseña.');
      console.error(error);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.tiendaNombre}>{tienda.nombre}</Text>
      {/* Aquí se muestra la información de la tienda: imagen, características, etc. */}
      
      <Text style={styles.label}>Calificación</Text>
      <TextInput
        style={styles.input}
        placeholder="Calificación (1 a 5)"
        keyboardType="numeric"
        value={String(calificacion)}
        onChangeText={(value) => setCalificacion(Number(value))}
      />

      <Text style={styles.label}>Momento del Día</Text>
      <TextInput
        style={styles.input}
        placeholder="Mañana, Tarde, Noche"
        value={momentoDia}
        onChangeText={setMomentoDia}
      />

      <Text style={styles.label}>Método de Descubrimiento</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscador, Recomendación, Publicidad"
        value={metodoDescubrimiento}
        onChangeText={setMetodoDescubrimiento}
      />

      <Button title="Guardar Reseña" onPress={guardarResena} />
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tiendaNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'blue',
  },
});
