import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontFamily, FontSize, Color, Border } from 'constants/StyleStoreDetail';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const StoreDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { store } = route.params;

  const handleNavigateToExplore = () => {
    navigation.navigate('ExploreScreen', {
      initialLocation: { lat: store.latitud, lng: store.longitud },
    });
  };

  const getValidImageUrl = (imageUrl) => {
    return imageUrl && imageUrl.startsWith("http")
      ? imageUrl
      : "https://via.placeholder.com/400";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Color.colorGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>
      </View>

      {/* Entity Image */}
      <Image
        source={{ uri: getValidImageUrl(store.imagenes) }}
        style={styles.mainImage}
      />

      {/* Entity Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.entityName}>{store.nombre || 'Entidad'}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={Color.colorSlategray} style={styles.locationIcon} />
          <Text style={styles.locationText}>{store.direccion || 'Dirección no disponible'}</Text>
        </View>
        <Text style={styles.detail}>Horario: {store.horario || 'No especificado'}</Text>
        <Text style={styles.detail}>Rango de Precios: {store.rango_precios || 'No especificado'}</Text>
        <Text style={styles.detail}>Métodos de Pago: {store.metodos_pago || 'No especificado'}</Text>
        <Text style={styles.detail}>Especialidades: {store.especialidades || 'No especificado'}</Text>
        <Text style={styles.detail}>Calificaciones: ⭐ {store.calificaciones || 'N/A'}</Text>
      </View>

      {/* Navigate Button */}
      <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateToExplore}>
        <Text style={styles.navigateButtonText}>Ir a la Ubicación</Text>
        <MaterialIcons name="directions" size={16} color={Color.colorWhite} style={{ marginLeft: 5 }} />
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Color.colorWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: FontSize.size_xl,
    fontWeight: 'bold',
    color: Color.colorGray,
    marginLeft: 10,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: Border.br_base,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  entityName: {
    fontSize: FontSize.size_xl,
    fontWeight: 'bold',
    color: Color.colorGray,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: FontSize.size_sm,
    color: Color.colorSlategray,
  },
  detail: {
    fontSize: FontSize.size_sm,
    color: Color.colorSlategray,
    marginBottom: 5,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Color.colorGreen,
    borderRadius: Border.br_5xs,
    marginVertical: 20,
  },
  navigateButtonText: {
    color: Color.colorWhite,
    fontWeight: 'bold',
    marginRight: 5,
  },
  recommendedHeader: {
    marginTop: 30,
    marginBottom: 10,
  },
  recommendedTitle: {
    fontSize: FontSize.size_lg,
    fontWeight: 'bold',
    color: Color.colorGray,
  },
  recommendedList: {
    marginTop: 10,
  },
});

export default StoreDetailScreen;
