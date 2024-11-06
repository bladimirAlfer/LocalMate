import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Modal, Button, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getStoresData } from '../../data/storesData';
import { signOut } from 'firebase/auth';
import { auth } from '../../database/firebase';
import Header from '../../../components/Header';
import SearchBar from '../../../components/SearchBar';
import Sidebar from '../../../components/HomeUser/SideBar';
import ZoomControls from '../../../components/HomeUser/ZoomControls';
import StoreDetail from '../../../components/StoreDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBar from '../../../components/HomeUser/TabBar';

export default function HomeUserScreen({ navigation }) {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [region, setRegion] = useState({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const RADIO_TIENDAS_CERCANAS = 5; // Radio en kilómetros

  // Función para calcular la distancia entre dos coordenadas geográficas
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  };

  const fetchLocationAndStores = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu ubicación.');
      setLoadingLocation(false);
      return;
    }
    try {
      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // Filtrar las tiendas cercanas
      const allStores = getStoresData();
      const nearbyStores = allStores.filter(store =>
        calcularDistancia(latitude, longitude, store.latitud, store.longitud) <= RADIO_TIENDAS_CERCANAS
      );
      setStores(nearbyStores);
    } catch (error) {
      Alert.alert('Error al obtener ubicación', 'No se pudo obtener la ubicación del usuario.');
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchLocationAndStores();
  }, []);

  const handleMarkerPress = (store) => {
    setSelectedStore(store);
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      await signOut(auth);
  
      // Reinicia el stack y navega a Home en el stack no autenticado
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión');
    }
  };
  
  
  

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        customMapStyle={mapStyle}
      >
        {stores.map((store, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: store.latitud, longitude: store.longitud }}
            title={store.nombre}
            description={`${store.categoria} - ${store.direccion}`}
            onPress={() => handleMarkerPress(store)}
          />
        ))}
      </MapView>
  
      <Header onMenuPress={toggleSidebar} />
      <SearchBar onSearch={(text) => {/* Implementar funcionalidad de búsqueda */}} />
      {showSidebar && (
        <Sidebar onLogout={handleLogout} onProfile={() => Alert.alert('Perfil')} />
      )}
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
      <Button title="Cerrar sesión" onPress={handleLogout} />
  
      {/* Vista previa de la tienda */}
      {selectedStore && !showDetailModal && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>{selectedStore.nombre}</Text>
          <Text style={styles.previewCategory}>{selectedStore.categoria}</Text>
          <TouchableOpacity style={styles.previewButton} onPress={() => setShowDetailModal(true)}>
            <Text style={styles.previewButtonText}>Ver más detalles</Text>
          </TouchableOpacity>
        </View>
      )}
  
      {/* Modal para mostrar el detalle de la tienda */}
      <Modal visible={showDetailModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          {selectedStore && (
            <StoreDetail store={selectedStore} onClose={() => {
              setShowDetailModal(false);
              setSelectedStore(null);
            }} />
          )}
        </View>
      </Modal>

      {/* Agregar el TabBar aquí */}
      </View>
  );  
}

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#eaeaea' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', stylers: [{ color: '#dadada' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', stylers: [{ color: '#c9c9c9' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  previewContainer: {
    position: 'absolute',
    bottom: 100, // Cambia este valor para ajustar la distancia desde el TabBar
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2024',
  },
  previewCategory: {
    fontSize: 14,
    color: '#71727a',
    marginVertical: 5,
  },
  previewButton: {
    marginTop: 10,
    backgroundColor: '#006ffd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
