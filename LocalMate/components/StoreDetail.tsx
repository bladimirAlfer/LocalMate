import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function StoreDetail({ store, onClose, onShowRecommendations, onRestoreStores }) {
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

        {/* Botón para mostrar recomendaciones */}
        <TouchableOpacity style={styles.button} onPress={onShowRecommendations}>
          <Text style={styles.buttonText}>Otras opciones</Text>
        </TouchableOpacity>

        {/* Botón para restaurar las tiendas iniciales */}
        <TouchableOpacity style={styles.restoreButton}
          onPress={() => {
            onClose();       // Cerrar el modal antes de restaurar las tiendas
            onRestoreStores(); // Llamar a la función para restaurar tiendas
          }}
        >
          <Text style={styles.buttonText}>Ver todas las tiendas</Text>
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
  restoreButton: {
    backgroundColor: '#71727a', // Un color diferente para distinguir este botón
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
