import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Modal, Text, TouchableOpacity } from 'react-native';
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

export default function HomeUserScreen({ navigation }) {
  const [initialStores, setInitialStores] = useState([]); // Guardar las tiendas iniciales
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

  const RADIO_TIENDAS_INICIAL = 1; // Radio inicial de 1 km
  const RADIO_TIENDAS_CERCANAS = 10; // Radio de 10 km para recomendaciones

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  };

  const fetchLocationAndStores = async () => {
    setLoadingLocation(true);
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

      const allStores = getStoresData();
      const nearbyStores = allStores.filter(store =>
        calcularDistancia(latitude, longitude, store.latitud, store.longitud) <= RADIO_TIENDAS_INICIAL
      );

      setStores(nearbyStores);
      setInitialStores(nearbyStores); // Guardar las tiendas iniciales para restauración
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
    console.log("Tienda seleccionada:", store);
    setSelectedStore(store);
  };

  const fetchRecommendations = async () => {
    if (!selectedStore || !selectedStore.id) {
      console.error("selectedStore o tienda_id no están definidos:", selectedStore);
      Alert.alert("Error", "No se pudo obtener el ID de la tienda seleccionada.");
      return;
    }
  
    const { latitude, longitude } = region;
    const tienda_id = selectedStore.id;
  
    try {
      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tienda_id,
          user_location: [latitude, longitude],
          radius_km: RADIO_TIENDAS_CERCANAS, // Cambia a 10 km para las recomendaciones
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta del servidor:", errorText);
        Alert.alert("Error", "No se pudo obtener las recomendaciones. Verifica el servidor.");
        return;
      }
  
      const recommendations = await response.json();
      setStores(recommendations); // Actualiza con tiendas recomendadas dentro de 10 km
      setShowDetailModal(false); // Cierra el modal después de obtener recomendaciones
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      Alert.alert("Error", "No se pudo obtener las recomendaciones. Verifica tu conexión.");
    }
  };

  const restoreInitialStores = async () => {
    await fetchLocationAndStores(); // Vuelve a obtener la ubicación y las tiendas iniciales
    setSelectedStore(null); // Cierra cualquier selección actual
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

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
      <SearchBar onSearch={(text) => { /* Implementar funcionalidad de búsqueda */ }} />
      {showSidebar && (
        <Sidebar
          onLogout={async () => {
            try {
              await AsyncStorage.removeItem('hasCompletedOnboarding');
              await signOut(auth);
              navigation.navigate('Home');
            } catch (error) {
              Alert.alert('Error', 'Hubo un problema al cerrar sesión');
            }
          }}
          onProfile={() => Alert.alert('Perfil')}
        />
      )}

      <ZoomControls
        onZoomIn={() => setRegion({ ...region, latitudeDelta: region.latitudeDelta / 2, longitudeDelta: region.longitudeDelta / 2 })}
        onZoomOut={() => setRegion({ ...region, latitudeDelta: region.latitudeDelta * 2, longitudeDelta: region.longitudeDelta * 2 })}
      />

      {/* Vista previa de la tienda */}
      {selectedStore && !showDetailModal && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>{selectedStore.nombre}</Text>
          <Text style={styles.previewCategory}>{selectedStore.categoria}</Text>
          <TouchableOpacity style={styles.previewButton} onPress={() => setShowDetailModal(true)}>
            <Text style={styles.previewButtonText}>Más Detalles</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para mostrar el detalle de la tienda */}
      <Modal visible={showDetailModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          {selectedStore && (
            <StoreDetail
              store={selectedStore}
              onClose={() => setShowDetailModal(false)}
              onShowRecommendations={fetchRecommendations}
              onRestoreStores={restoreInitialStores} // Llama a restoreInitialStores cuando se hace clic en "Ver todas las tiendas"
            />
          )}
        </View>
      </Modal>
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
    bottom: 100,
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
