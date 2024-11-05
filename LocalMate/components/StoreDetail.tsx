// app/components/StoreDetail.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function StoreDetail({ store, onClose }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: store.imagen }} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{store.nombre}</Text>
        <Text style={styles.price}>{`S/. ${store.rangoPrecios}`}</Text>
        <Text style={styles.category}>{store.categoria}</Text>
        <Text style={styles.description}>{store.descripcion}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Ver más detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#eaf2ff',
  },
  infoContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2024',
  },
  price: {
    fontSize: 16,
    color: '#71727a',
    marginVertical: 5,
  },
  category: {
    fontSize: 14,
    color: '#71727a',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#71727a',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#006ffd',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
