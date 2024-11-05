// app/screens/User/HomeUserScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Modal, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getStoresData } from '../../data/storesData';
import { signOut } from 'firebase/auth';
import { auth } from '../../database/firebase';
import Header from '../../../components/Header';
import SearchBar from '../../../components/SearchBar';
import Sidebar from '../../../components/SideBar';
import ZoomControls from '../../../components/ZoomControls';
import StoreDetail from '../../../components/StoreDetail';

export default function HomeUserScreen({ navigation }) {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [region, setRegion] = useState({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    const fetchLocationAndStores = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu ubicación.');
        setLoadingLocation(false);
        return;
      }
      try {
        const userLocation = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (error) {
        Alert.alert('Error al obtener ubicación', 'No se pudo obtener la ubicación del usuario.');
      } finally {
        setLoadingLocation(false);
      }
      setStores(getStoresData());
    };
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
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
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

      {/* Modal para mostrar el detalle de la tienda */}
      <Modal visible={!!selectedStore} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          {selectedStore && (
            <StoreDetail store={selectedStore} onClose={() => setSelectedStore(null)} />
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
});
