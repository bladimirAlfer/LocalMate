// components/Sidebar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Sidebar({ onLogout, onProfile }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={onProfile}>
        <Text style={styles.text}>Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={onLogout}>
        <Text style={styles.text}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    zIndex: 10,
  },
  item: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
