import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Importa el icono de menú
import { auth } from '../../database/firebase';
import { tiendaEventEmitterAdd, tiendaEventEmitterDelete } from '../../../components/eventEmitters';

export default function MyLocationsScreen() {
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

  const fetchLocations = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      const response = await fetch(`http://172.20.10.2:5001/tiendas?user_id=${user.uid}`);
      if (!response.ok) throw new Error(`Error en la respuesta del servidor: ${response.status}`);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta no es JSON");
      }

      const data = await response.json();

      // Verifica si la respuesta tiene tiendas
      if (data.message && data.message === "No hay tiendas registradas para este usuario") {
        return;
      }

      // Limpiar valores NaN o null y solo usar nombre, latitud y longitud
      const cleanedData = data.map(location => ({
        local_id: location.local_id || 'ID no disponible',
        nombre: location.nombre || 'Desconocido',
        latitud: location.latitud || null,
        longitud: location.longitud || null,
      }));

      setLocations(cleanedData);
    } catch (error) {
      console.error("Error al obtener ubicaciones:", error);
      Alert.alert("Error", error.message); // Mostrar el mensaje de error recibido
    }
  };

  const deleteLocation = async (locationId) => {
    console.log("Location ID a eliminar:", locationId); // Verifica que locationId esté definido
    try {
      if (!locationId) {
        Alert.alert("Error", "ID de ubicación no válido");
        return;
      }

      const response = await fetch(`http://172.20.10.2:5001/tiendas/${locationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Local eliminado', 'El local ha sido eliminado correctamente.');

        // Actualiza el estado eliminando la tienda del array local
        setLocations(prevLocations => prevLocations.filter(location => location.local_id !== locationId));

        // Emitir el evento para actualizar otras pantallas
        tiendaEventEmitterDelete.emit('updateTiendas');
      } else if (response.status === 404) {
        Alert.alert('Error', 'La tienda ya no existe.');
        setLocations(prevLocations => prevLocations.filter(location => location.local_id !== locationId));
      } else {
        Alert.alert('Error', 'No se pudo eliminar el local.');
      }
    } catch (error) {
      console.error('Error al eliminar la ubicación:', error);
      Alert.alert('Error', 'No se pudo eliminar el local.');
    }
  };

  useEffect(() => {
    fetchLocations();

    tiendaEventEmitterAdd.on('updateTiendas', fetchLocations);
    tiendaEventEmitterDelete.on('updateTiendas', fetchLocations);

    return () => {
      tiendaEventEmitterAdd.off('updateTiendas', fetchLocations);
      tiendaEventEmitterDelete.off('updateTiendas', fetchLocations);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Encabezado con el botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Locales</Text>
      </View>

      {/* Mostrar un mensaje si no hay tiendas */}
      {locations.length === 0 ? (
        <Text style={styles.noStoresText}>No tienes locales registradas</Text>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.local_id ? item.local_id.toString() : Math.random().toString()} // Cambiado a `local_id`
          renderItem={({ item }) => (
            <View style={styles.locationItem}>
              <Text style={styles.locationName}>{item.nombre}</Text>
              <Text style={styles.locationDescription}>{item.descripcion}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Editar" onPress={() => navigation.navigate('EditLocationScreen', { locationId: item.local_id })} />
                <Button
                  title="Eliminar"
                  color="red"
                  onPress={() => {
                    console.log("Eliminando tienda con ID:", item.local_id); // Verifica que el ID esté presente
                    if (item.local_id) {
                      deleteLocation(item.local_id);
                    } else {
                      Alert.alert("Error", "ID de tienda no válido");
                    }
                  }}
                />
                <Button title="Ver Calificaciones" onPress={() => navigation.navigate('RatingsScreen', { locationId: item.local_id })} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    marginRight: 10,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  locationName: { fontSize: 18, fontWeight: 'bold' },
  locationDescription: { fontSize: 14, color: '#666', marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  noStoresText: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
});
