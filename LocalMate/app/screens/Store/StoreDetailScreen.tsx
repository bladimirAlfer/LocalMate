import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontFamily, FontSize, Color, Border } from 'constants/StyleStoreDetail';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const StoreDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { store } = route.params;

  const handleVisitRestaurant = () => {
    // Implementar navegación a la ubicación del restaurante en el mapa
  };

  const handleCheckOtherRestaurant = (restaurant) => {
    navigation.navigate('StoreDetailScreen', { store: restaurant });
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

      {/* Restaurant Image */}
      <Image source={{ uri: store.imageUrl || 'https://via.placeholder.com/400' }} style={styles.mainImage} />

      {/* Restaurant Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.restaurantName}>{store.nombre || "Tienda"}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={Color.colorSlategray} style={styles.locationIcon} />
          <Text style={styles.locationText}>{store.direccion || "Dirección no disponible"}</Text>
        </View>
      </View>

      {/* Open Hours */}
      <View style={styles.hoursContainer}>
        <Text style={styles.openStatus}>Open today</Text>
        <Text style={styles.hours}>{store.horarioApertura || "10:00 AM - 12:00 PM"}</Text>
        <TouchableOpacity onPress={handleVisitRestaurant} style={styles.visitButton}>
          <Text style={styles.visitButtonText}>Visit the Restaurant</Text>
          <MaterialIcons name="directions" size={16} color={Color.colorWhite} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>

      {/* Other Restaurants Section */}
      <View style={styles.otherRestaurantsHeader}>
        <Text style={styles.otherRestaurantsTitle}>List other restaurants</Text>
        <Text style={styles.otherRestaurantsSubtitle}>Check the menu at this restaurant</Text>
      </View>

      {/* Other Restaurants List */}
      <View style={styles.otherRestaurantsList}>
        {store.otherRestaurants?.map((restaurant, index) => (
          <View key={index} style={styles.restaurantCard}>
            <Image source={{ uri: restaurant.imageUrl || 'https://via.placeholder.com/50' }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantNameCard}>{restaurant.nombre}</Text>
              <Text style={styles.restaurantAddress}>{restaurant.direccion}</Text>
            </View>
            <TouchableOpacity style={styles.checkButton} onPress={() => handleCheckOtherRestaurant(restaurant)}>
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
  restaurantName: {
    fontSize: FontSize.size_xl,
    fontWeight: 'bold',
    color: Color.colorGray,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: FontSize.size_sm,
    color: Color.colorSlategray,
  },
  hoursContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  openStatus: {
    fontSize: FontSize.size_md,
    color: Color.colorGreen,
  },
  hours: {
    fontSize: FontSize.size_sm,
    color: Color.colorGray,
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Color.colorGreen,
    borderRadius: Border.br_5xs,
  },
  visitButtonText: {
    color: Color.colorWhite,
    fontWeight: 'bold',
  },
  otherRestaurantsHeader: {
    marginTop: 30,
    marginBottom: 10,
  },
  otherRestaurantsTitle: {
    fontSize: FontSize.size_lg,
    fontWeight: 'bold',
    color: Color.colorGray,
  },
  otherRestaurantsSubtitle: {
    fontSize: FontSize.size_sm,
    color: Color.colorSlategray,
  },
  otherRestaurantsList: {
    marginTop: 10,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.colorWhite,
    borderRadius: Border.br_base,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: Border.br_5xs,
    marginRight: 10,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantNameCard: {
    fontSize: FontSize.size_md,
    fontWeight: 'bold',
    color: Color.colorGray,
  },
  restaurantAddress: {
    fontSize: FontSize.size_sm,
    color: Color.colorSlategray,
  },
  checkButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: Color.colorGreen,
    borderRadius: Border.br_5xs,
  },
  checkButtonText: {
    color: Color.colorWhite,
    fontWeight: 'bold',
  },
});

export default StoreDetailScreen;
