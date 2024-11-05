// app/components/Onboarding/NivelSocioeconomicoSelector.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import SliderInput from './SliderInput';

const distritosLima = [
  'San Isidro', 'Miraflores', 'La Molina', 'Barranco', 'San Borja', 'Surco', 'Magdalena',
  'Jesús María', 'Pueblo Libre', 'San Miguel', 'Los Olivos', 'Rímac', 'Comas', 'Villa María del Triunfo',
  'Villa El Salvador', 'San Juan de Miraflores', 'San Juan de Lurigancho', 'Chorrillos', 'Lince', 'Cercado de Lima',
  'Breña', 'Independencia', 'Ate', 'Carabayllo', 'Puente Piedra', 'Santa Anita'
];

export default function NivelSocioeconomicoSelector({ onSelectDistrito, onSelectGasto }) {
  const [distrito, setDistrito] = useState('');
  const [gasto, setGasto] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona tu distrito</Text>
      <Picker
        selectedValue={distrito}
        onValueChange={(itemValue) => {
          setDistrito(itemValue);
          onSelectDistrito(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona un distrito" value="" />
        {distritosLima.map((dist) => (
          <Picker.Item key={dist} label={dist} value={dist} />
        ))}
      </Picker>

      <Text style={[styles.label, styles.gastoLabel]}>Gasto promedio en una salida</Text>
      <SliderInput
        value={gasto}
        setValue={(value) => {
          setGasto(value);
          onSelectGasto(value);
        }}
        min={0}
        max={300}
        step={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 50,  // Aumentamos el margen inferior para evitar superposición
  },
  gastoLabel: {
    marginTop: 40,  // Espacio adicional para separar el texto del slider
    marginBottom: 10,
  },
});
