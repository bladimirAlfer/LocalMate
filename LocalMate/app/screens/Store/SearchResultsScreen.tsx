import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStoresData } from "../../../app/data/storesData";
import VerticalCard from "../../../components/HomeUser/VerticalCard";
import HorizontalCard from "../../../components/HomeUser/HorizontalCard";

export default function SearchResultsScreen() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [recommendedStores, setRecommendedStores] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { searchTerm } = route.params || '';

  useEffect(() => {
    setSearchText(searchTerm || '');

    const loadStores = async () => {
      try {
        const stores = await getStoresData();
        setNearbyStores(stores.slice(0, 5));
        const randomStores = stores.sort(() => 0.5 - Math.random()).slice(0, 5);
        setRecommendedStores(randomStores);
      } catch (error) {
        console.error('Error al cargar tiendas:', error);
      }
    };

    loadStores();
  }, [searchTerm]);

  const handleSearch = (text) => {
    setSearchText(text);
    const results = nearbyStores.filter(store => store.nombre.toLowerCase().includes(text.toLowerCase()));
    setSearchResults(results);
  };

  const navigateToDetail = (store) => {
    navigation.navigate('StoreDetailScreen', { store });
  };

  const navigateToExplore = () => {
    navigation.navigate('ExploreScreen');
  };

  return (
    <View style={styles.container}>
      {/* Botón de retroceso */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#71727a" />
        <TextInput
          style={styles.searchInput}
          placeholder="¿Qué quieres hoy?"
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#71727a" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Resultados de búsqueda */}
      {searchText && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => navigateToDetail(item)}>
                <Text style={styles.resultText}>{item.nombre}</Text>
                <Ionicons name="chevron-forward" size={20} color="#333" style={styles.arrowIcon} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}

      {/* Sección de "Cerca de ti" */}
      <Text style={styles.sectionTitle}>Resultados</Text>
      <FlatList
        data={nearbyStores}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetail(item)}>
            <VerticalCard store={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />

      {/* Sección de "Otras opciones" con "Ver Más" */}
      <View style={styles.recommendedHeader}>
        <Text style={styles.sectionTitle}>Otras opciones</Text>
        <TouchableOpacity onPress={navigateToExplore} style={styles.viewMoreTextContainer}>
          <Text style={styles.viewMoreText}>Ver Más</Text>
          <Ionicons name="arrow-forward" size={16} color="#4A90E2" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recommendedStores}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetail(item)}>
            <HorizontalCard store={item} title={item.nombre} subtitle={item.categoria} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verticalListContainer}
        style={styles.recommendedList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  backButton: { marginBottom: 15, marginLeft: 20, marginTop: 23 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  clearButton: { marginLeft: 10 },
  searchResultsContainer: {
    position: 'absolute',
    top: 110, 
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 2,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: { flex: 1, fontSize: 16, color: '#333' },
  arrowIcon: { marginLeft: 10 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginHorizontal: 20, 
    marginTop: 20, 
    marginBottom: 10 
  },
  recommendedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  viewMoreTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 4,
  },
  carouselContainer: { paddingHorizontal: 10 },
  verticalListContainer: { paddingBottom: 0 },
  recommendedList: { maxHeight: 150 },
});
