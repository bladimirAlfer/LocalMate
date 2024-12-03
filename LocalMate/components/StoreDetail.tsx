import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StoreDetail({ store, onClose }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Botón para cerrar el modal */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </TouchableOpacity>

      {/* Contenedor de la imagen */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: store.imageUrl || 'https://via.placeholder.com/150' }}
        />
      </View>

      {/* Contenedor de la información */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{store.nombre}</Text>
        <Text style={styles.price}>
          {store.rangoPrecios 
            ? `S/. ${store.rangoPrecios}` 
            : store.precio 
            ? `S/. ${store.precio}` 
            : 'Precio no especificado'}
        </Text>
        <Text style={styles.category}>
          {Array.isArray(store.categorias)
            ? store.categorias.join(', ') // Si es un array, únelas con comas
            : typeof store.categorias === 'string'
            ? store.categorias // Si es un string, muéstralo directamente
            : 'Categoría no especificada'}
        </Text>
        <Text style={styles.description}>
          {store.descripcion || 'Descripción no disponible'}
        </Text>

        {/* Botón para navegar a EntityDetailScreen */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onClose(); // Cierra el modal
            const { markerRef, ...serializableEntity } = store;

            navigation.navigate('EntityDetailScreen', {
              entity: serializableEntity,
              isRecommended: store.isRecommended || false, // Verifica que siempre pase un valor booleano
            });
          }}
        >
          <Text style={styles.buttonText}>Ver Más</Text>
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
  closeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
