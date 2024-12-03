import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Modal, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getStoresData } from '../../data/storesData';
import { signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

import { auth, db } from '../../database/firebase';
import ZoomControls from '../../../components/HomeUser/ZoomControls';
import StoreDetail from '../../../components/StoreDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Importa el icono para el botón de drawer
import { tiendaEventEmitterAdd, tiendaEventEmitterDelete } from '../../../components/eventEmitters';
import { eventoEventEmitterAdd, eventoEventEmitterDelete, actividadEventEmitterAdd, actividadEventEmitterDelete } from '../../../components/eventEmitters';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function ExploreScreen({ navigation, route }) {
  const [entities, setEntities] = useState([]); // Maneja todas las entidades (locales, eventos, actividades)
  const [selectedEntity, setSelectedEntity] = useState(null); // Entidad seleccionada (local, evento o actividad)
  const [userId, setUserId] = useState(null);
  const [userPreference, setUserPreference] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [isShowingRecommendations, setIsShowingRecommendations] = useState(false);
  const [region, setRegion] = useState({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  const RADIO_TIENDAS_INICIAL = 1;

  const adjustRegionToFitEntities = (entities) => {
    if (!entities || entities.length === 0) return;
  
    const latitudes = entities.map((entity) => entity.latitud);
    const longitudes = entities.map((entity) => entity.longitud);
  
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);
  
    // Calcula el centro y el rango de la región
    const midLat = (minLat + maxLat) / 2;
    const midLon = (minLon + maxLon) / 2;
    const latDelta = Math.abs(maxLat - minLat) + 0.02; // Añade un margen
    const lonDelta = Math.abs(maxLon - minLon) + 0.02; // Añade un margen
  
    // Actualiza la región del mapa
    setRegion({
      latitude: midLat,
      longitude: midLon,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    });
  };

  
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchLocationAndEntities = async () => {
    setLoadingLocation(true);
    try {
      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
  
      // Llama al endpoint
      const response = await fetch('http://172.20.10.2:5001/entidades/todas', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta del servidor:', errorText);
        Alert.alert('Error', 'No se pudo cargar las entidades.');
        return;
      }
  
      const allEntities = await response.json();
  
      // Unificar clave `descripcion` y `precio`
      const unifiedEntities = allEntities.map((entity) => ({
        ...entity,
        descripcion: entity.descripcion || entity.descripcion_breve || 'Descripción no disponible',
        precio: entity.rango_precios 
          ? `${entity.rango_precios}` // Para locales, mantenemos el string
          : entity.precio 
          ? `${entity.precio}` // Para eventos y actividades, convertimos a string
          : 'Precio no especificado',
      }));
  
      // Filtrar entidades cercanas
      const nearbyEntities = unifiedEntities.filter((entity) =>
        calcularDistancia(latitude, longitude, entity.latitud, entity.longitud) <= RADIO_TIENDAS_INICIAL
      );
  
      setEntities(nearbyEntities);
    } catch (error) {
      console.error('Error al obtener ubicación o entidades:', error);
      Alert.alert('Error al obtener ubicación', 'No se pudo obtener la ubicación del usuario.');
    } finally {
      setLoadingLocation(false);
    }
  };
  
  useEffect(() => {
    if (route.params?.recommendedEntities) {
      const sanitizedEntities = route.params.recommendedEntities.map((entity) => {
        const { markerRef, ...serializableEntity } = entity;
        return serializableEntity;
      });
      setEntities(sanitizedEntities);
      setIsShowingRecommendations(true);
      adjustRegionToFitEntities(sanitizedEntities);
    } else {
      fetchLocationAndEntities();
      setIsShowingRecommendations(false);
    }
  }, [route.params?.recommendedEntities]);

  useFocusEffect(
    React.useCallback(() => {
      if (!route.params?.recommendedEntities) {
        fetchLocationAndEntities(); // Solo carga las entidades generales si no hay recomendaciones
      }
      setSelectedEntity(null); // Limpia la entidad seleccionada
      setShowDetailModal(false); // Cierra cualquier modal abierto
    }, [route.params?.recommendedEntities])
  );
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingLocation(true); // Indicador de carga
        // Verifica si el usuario está autenticado
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "Usuario no autenticado.");
          setLoadingLocation(false);
          return;
        }

        // Obtener datos del usuario desde Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          Alert.alert("Error", "No se encontraron datos del usuario.");
          setLoadingLocation(false);
          return;
        }

        const userData = userDoc.data();

      // Combinar `userId` con los datos del usuario
      const userDataWithId = {
        ...userData,
        id: user.uid, // Agrega el UID del usuario
      };

        // Establecer los datos del usuario en el estado
        setUserId(user.uid); // UID del usuario autenticado
        setUserPreference(userData.preferencias || ""); // Preferencias del usuario

      console.log("Datos del usuario cargados:", userDataWithId); // Log que incluye el UID
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchUserData(); // Llama a la función al montar el componente
  }, []);

  
  const fetchHybridRecommendations = async () => {
    if (!userId || !userPreference) {
      Alert.alert('Error', 'No se pudo obtener el ID o la preferencia del usuario.');
      return;
    }
  
    const userLocation = [region.latitude, region.longitude];
  
    try {
      const response = await fetch('http://172.20.10.2:5001/recommend_hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_location: userLocation,
          user_preference: userPreference,
          radius_km: 1,
          id_df: ["local_id", "evento_id", "actividad_id"], // Define el tipo de entidad
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta del servidor:', errorText);
        Alert.alert('Error', 'No se pudo obtener las recomendaciones.');
        return;
      }
  
      const recommendations = await response.json();
      if (recommendations.length === 0) {
        Alert.alert('Sin recomendaciones', 'No se encontraron recomendaciones para tus preferencias.');
        return;
      }
  
      // Enriquecer los datos con descripción y precio predeterminados si faltan
      const enrichedRecommendations = recommendations.map((entity) => ({
        ...entity,
        descripcion: entity.descripcion || 'Descripción no disponible',
        precio: entity.precio || 'Precio no especificado',
      }));
  
      setEntities(enrichedRecommendations);
      setIsShowingRecommendations(true);
    } catch (error) {
      console.error('Error al obtener recomendaciones híbridas:', error);
      Alert.alert('Error', 'No se pudo obtener las recomendaciones. Verifica tu conexión.');
    }
  };
  
  
  const handleShowAllEntities = () => {
    fetchLocationAndEntities(); // Vuelve a cargar las entidades base
    setIsShowingRecommendations(false); // Cambia el estado de recomendaciones a falso
  };
  
  
  const handleMarkerPress = entity => {
    setSelectedEntity(entity);
    setShowDetailModal(true);
  };

  useEffect(() => {
    fetchLocationAndEntities();

    // Escuchar eventos para actualizar dinámicamente locales, eventos y actividades
    tiendaEventEmitterAdd.on('updateTiendas', fetchLocationAndEntities);
    tiendaEventEmitterDelete.on('updateTiendas', fetchLocationAndEntities);
    eventoEventEmitterAdd.on('updateEventos', fetchLocationAndEntities);
    eventoEventEmitterDelete.on('updateEventos', fetchLocationAndEntities);
    actividadEventEmitterAdd.on('updateActividades', fetchLocationAndEntities);
    actividadEventEmitterDelete.on('updateActividades', fetchLocationAndEntities);

    return () => {
      tiendaEventEmitterAdd.off('updateTiendas', fetchLocationAndEntities);
      tiendaEventEmitterDelete.off('updateTiendas', fetchLocationAndEntities);
      eventoEventEmitterAdd.off('updateEventos', fetchLocationAndEntities);
      eventoEventEmitterDelete.off('updateEventos', fetchLocationAndEntities);
      actividadEventEmitterAdd.off('updateActividades', fetchLocationAndEntities);
      actividadEventEmitterDelete.off('updateActividades', fetchLocationAndEntities);
    };
  }, []);

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado con el botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LocalMate</Text>
      </View>
  
      {/* Mapa con marcadores */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        customMapStyle={mapStyle}
      >
        {entities.map((entity, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: entity.latitud, longitude: entity.longitud }}
            pinColor={
              entity.type === 'local'
                ? 'blue'
                : entity.type === 'evento'
                ? 'green'
                : 'orange'
            }
            ref={(marker) => {
              entity.markerRef = marker; // Guarda una referencia al marcador
            }}
          >
          <Callout
            onPress={() => {
              if (entity.markerRef) {
                entity.markerRef.hideCallout();
              }

              const isRecommended = isShowingRecommendations; // Determina si el estado actual es de recomendaciones

              setSelectedEntity({ ...entity, isRecommended }); // Incluye el estado isRecommended
              setShowDetailModal(true); // Muestra el modal
            }}
          >
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>{entity.nombre}</Text>
              <Text style={styles.calloutDescription}>
                {entity.descripcion || 'Descripción no disponible'}
              </Text>
              <Text style={styles.calloutPrice}>
                {entity.precio ? `S/. ${entity.precio}` : 'Precio no especificado'}
              </Text>
            </View>
          </Callout>
          </Marker>
        ))}
      </MapView>

  
      {/* Controles de zoom */}
      <ZoomControls
        onZoomIn={() =>
          setRegion({
            ...region,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2,
          })
        }
        onZoomOut={() =>
          setRegion({
            ...region,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2,
          })
        }
      />
  
      {/* Botón dinámico basado en el modo actual */}
      <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
        {isShowingRecommendations ? (
          <TouchableOpacity
            style={styles.showAllButton}
            onPress={handleShowAllEntities} // Llama a la función para mostrar todas las entidades
          >
            <Text style={styles.showAllButtonText}>Ver Todo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.todayRecommendationsButton}
            onPress={fetchHybridRecommendations} // Llama a la función para mostrar recomendaciones
          >
            <Text style={styles.todayRecommendationsButtonText}>Recomendaciones Hoy</Text>
          </TouchableOpacity>
        )}
      </View>


      {/* Modal para mostrar detalles de la entidad */}
      <Modal visible={showDetailModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          {selectedEntity && (
            <StoreDetail
              store={selectedEntity}
              onClose={() => {
                setShowDetailModal(false); // Cierra el modal
                setSelectedEntity(null); // Limpia la entidad seleccionada
              }}
              onRestoreEntities={fetchLocationAndEntities}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40, // Esto es para dar espacio al botón en la parte superior
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8, // Añade padding para hacerlo más fácil de tocar
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
  todayRecommendationsButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  todayRecommendationsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  showAllButton: {
    backgroundColor: '#F5A623',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  showAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  calloutContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#71727a',
    marginTop: 5,
  },
});