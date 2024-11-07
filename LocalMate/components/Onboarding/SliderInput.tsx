// app/components/Onboarding/SliderInput.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

type SliderInputProps = {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

const SliderInput: React.FC<SliderInputProps> = ({ value, setValue, min, max, step }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>S/ {value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor="#4A90E2"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#4A90E2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default SliderInput;
