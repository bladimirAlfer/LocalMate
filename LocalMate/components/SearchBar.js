// components/SearchBar.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ onSearch }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#757575" />
      <TextInput
        style={styles.input}
        placeholder="Busca tiendas o eventos"
        placeholderTextColor="#757575"
        onChangeText={onSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
});
