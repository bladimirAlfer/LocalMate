import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import VerticalCard from "../../../components/HomeUser/VerticalCard";
import HorizontalCard from "../../../components/HomeUser/HorizontalCard";
import * as Location from 'expo-location';
import { getAuth } from "firebase/auth"; 
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function HomeUserScreen() {
  const [nearbyStores, setNearbyStores] = useState([]);
  const [recommendedStores, setRecommendedStores] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const auth = getAuth(); // Define auth aquí

  useEffect(() => {
    const fetchUserAndRecommendations = async () => {
      setLoading(true);

      try {
        // Obtener ubicación del usuario
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu ubicación.');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });

        // Obtener datos del usuario desde Firebase
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          Alert.alert("Error", "Usuario no autenticado.");
          setLoading(false);
          return;
        }

        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
          Alert.alert("Error", "Datos del usuario no encontrados.");
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        const radius_km = 1; // Radio fijo de 1 km

        // Solicitar recomendaciones al backend
        const recommendResponse = await fetch("http://172.20.10.2:5001/recommend_hybrid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.uid,
            user_location: [latitude, longitude],
            user_preference: userData.categorias_favoritas || [], // Array de preferencias
            radius_km,
            id_df: ["local_id", "evento_id", "actividad_id"], // Asegúrate de que sea una lista
          }),
        });
        

        if (!recommendResponse.ok) {
          const errorText = await recommendResponse.text();
          console.error("Error en la respuesta de recomendaciones:", errorText);
          setLoading(false);
          return;
        }

        const recommendations = await recommendResponse.json();
        setRecommendedStores(recommendations);

        // Solicitar tiendas cercanas al backend
        const nearbyResponse = await fetch("http://172.20.10.2:5001/nearby_entities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_location: [latitude, longitude],
            radius_km,
            entity_types: ["local", "evento", "actividad"], // Asegúrate de incluir entity_types
          }),
        });
        

        if (!nearbyResponse.ok) {
          const errorText = await nearbyResponse.text();
          console.error("Error en la respuesta de tiendas cercanas:", errorText);
          setLoading(false);
          return;
        }

        const nearbyStoresData = await nearbyResponse.json();
        setNearbyStores(nearbyStoresData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        Alert.alert("Error", "No se pudieron obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRecommendations();
  }, []);


  const navigateToSearchScreen = () => {
    navigation.navigate('SearchScreen');
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header personalizado con el botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.logo}>LocalMate</Text>
      </View>

      {/* Barra de búsqueda que lleva a SearchScreen */}
      <TouchableOpacity style={styles.searchContainer} onPress={navigateToSearchScreen}>
        <Ionicons name="search" size={20} color="#71727a" />
        <Text style={styles.searchInput}>Buscar otras opciones</Text>
      </TouchableOpacity>

      {/* Sección de "Cerca de ti" */}
      <Text style={styles.sectionTitle}>Cerca de ti</Text>
      <FlatList
        data={nearbyStores}
        renderItem={({ item }) => (
          <VerticalCard 
            store={item}
            userId={auth.currentUser.uid} 
            userLocation={userLocation} 
          />
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />

      {/* Sección de "Recomendados" desplazable verticalmente */}
      <Text style={styles.sectionTitle}>Recomendados</Text>
      <FlatList
        data={recommendedStores}
        renderItem={({ item }) => (
          
          <HorizontalCard 
            store={item}
            userId={auth.currentUser.uid} 
            userLocation={userLocation} 
          />
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
        style={styles.recommendedList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 15 },
  menuButton: { marginRight: 10 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#4A90E2', flex: 1, textAlign: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginBottom: 10 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#71727a' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginHorizontal: 20, marginBottom: 10 },
  carouselContainer: { paddingHorizontal: 10 },
  recommendedList: { maxHeight: 150 },
  verticalListContainer: { paddingBottom: 0 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
});
