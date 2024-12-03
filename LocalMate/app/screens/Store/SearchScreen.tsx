import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  // Datos simulados con URLs de logos
  const favoritos = [
    { id: '1', nombre: 'McDonald\'s', logoUrl: 'https://1000marcas.net/wp-content/uploads/2019/11/McDonalds-Logo-2003.jpg' },
    { id: '2', nombre: 'KFC', logoUrl: 'https://1000marcas.net/wp-content/uploads/2020/01/KFC-logo.png' },
    { id: '3', nombre: 'Bembos', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Bembos_logo15.png' },
    { id: '4', nombre: 'Chifa Grulla', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYK5wJbkgqsokI4PEYI9l9TstKnSgz1tE8mw&s' },
  ];

  const recientes = ['Siete Sopas', 'Pizza','Pizza'];
  const masBuscados = ['Alesandra Penny', 'Pizza', 'Kfc', 'Makis'];

  const handleSearch = (text) => {
    setSearchText(text);
    const results = favoritos.filter(local => local.nombre.toLowerCase().includes(text.toLowerCase()));
    setSearchResults(results);
  };

  const navigateToDetail = (item) => {
    navigation.navigate('StoreDetailScreen', { store: item });
  };

  const navigateToResults = (searchTerm) => {
    navigation.navigate('SearchResultsScreen', { searchTerm });
  };

  const truncateText = (text, limit) => {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
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
      
      {/* Lista emergente de resultados de búsqueda */}
      {searchText && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => navigateToDetail(item)}>
                <Image source={{ uri: item.logoUrl }} style={styles.resultImage} />
                <Text style={styles.resultText}>{truncateText(item.nombre, 20)}</Text>
                <Ionicons name="chevron-forward" size={20} color="#333" style={styles.arrowIcon} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      {/* Encapsulamos "Favoritos" en una vista fija */}
      <View style={styles.favoritesSection}>
        <Text style={styles.sectionTitle}>Favoritos</Text>
        <FlatList
          data={favoritos}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToDetail(item)} style={styles.favoriteItemWrapper}>
              <View style={styles.favoriteItem}>
                <Image source={{ uri: item.logoUrl }} style={styles.logo} />
                <Text style={styles.favoriteName}>{truncateText(item.nombre, 10)}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Secciones "Recientes" y "Los más buscados" en un ScrollView */}
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Recientes</Text>
        {recientes.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => navigateToResults(item)}>
            <Text style={styles.recentItem}>{item}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Los más buscados</Text>
        {masBuscados.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => navigateToResults(item)}>
            <Text style={styles.popularItem}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#F7F8FA' 
  },
  backButton: { 
    marginBottom: 15 
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    borderRadius: 8,
    zIndex: 1, 
    marginBottom: 10, 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 16 
  },
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
  resultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  resultText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  favoritesSection: {
    marginBottom: 10,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 15, // Aumenta el espacio debajo del título de cada sección
  },
  favoriteItemWrapper: {
    marginRight: 15,
  },
  favoriteItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  logo: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 10 
  },
  favoriteName: { 
    fontSize: 16, 
    color: '#333' 
  },
  scrollContainer: {
    flex: 1,
  },
  recentItem: { 
    fontSize: 16, 
    paddingVertical: 8, // Aumenta el espacio vertical entre los elementos
    color: '#333' 
  },
  popularItem: { 
    fontSize: 16, 
    paddingVertical: 8, // Aumenta el espacio vertical entre los elementos
    color: '#333'  
  },
});
