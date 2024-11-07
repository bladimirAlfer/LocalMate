// app/components/Onboarding/DropdownSelect.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type DropdownSelectProps = {
  label: string;
  items: { label: string; value: string }[];
  value: string | null;
  setValue: (value: string | null) => void;
};

const DropdownSelect: React.FC<DropdownSelectProps> = ({ label, items, value, setValue }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={value}
        items={items}
        setValue={setValue}
        containerStyle={styles.dropdown}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  dropdown: { width: '100%', zIndex: 1000 }, // Aseguramos que el dropdown esté al frente
});

export default DropdownSelect;
