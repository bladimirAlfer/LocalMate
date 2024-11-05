// app/components/Onboarding/Multiselect.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

type MultiselectProps = {
  label: string;
  items: { id: string; name: string }[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
};

const Multiselect: React.FC<MultiselectProps> = ({ label, items, selectedItems, setSelectedItems }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <MultiSelect
      items={items}
      uniqueKey="id"
      selectedItems={selectedItems}
      onSelectedItemsChange={setSelectedItems}
      selectText="Selecciona tus días"
      searchInputPlaceholderText="Buscar días..."
      selectedItemTextColor="#4A90E2"
      submitButtonColor="#4A90E2"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
});

export default Multiselect;
