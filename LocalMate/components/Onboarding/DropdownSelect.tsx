import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DropdownSelectProps = {
  label: string;
  items: { label: string; value: string }[];
  value: string | null;
  setValue: (value: string | null) => void;
};

const DropdownSelect: React.FC<DropdownSelectProps> = ({ label, items, value, setValue }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={value ? styles.inputText : styles.placeholderText}>
          {value || 'Selecciona una opción'}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#333"
          style={styles.icon}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  
                ]}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    value === item.value && styles.selectedItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E7EAEB',
    borderRadius: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60, // Justo debajo del campo de entrada
    width: '100%',
    maxHeight: 150, // Limita la altura del dropdown
    borderWidth: 1,
    borderColor: '#E7EAEB',
    borderRadius: 12,
    backgroundColor: 'white',
    zIndex: 1000,
    overflow: 'hidden',
  },
  listContent: {
    paddingBottom: 15,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E7EAEB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownItemText: {
    color: '#333',
    fontSize: 16,
  },
  selectedItemText: {
    color: '#007B5D', // Verde principal para el texto seleccionado
    fontWeight: '600',
  },
});

export default DropdownSelect;
