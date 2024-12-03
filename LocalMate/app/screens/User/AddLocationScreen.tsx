import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../database/firebase';
import { tiendaEventEmitterAdd } from '../../../components/eventEmitters';

const API_URL = 'http://172.20.10.2:5001';


function SearchableCategoryInput({ onAddCategory, onRemoveCategory, categories, selectedCategories }) {
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const matches = categories.filter((cat) =>
        cat.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCategories(matches);
      setShowDropdown(true);
    } else {
      setFilteredCategories(categories);
      setShowDropdown(false);
    }
  };

  const handleBlur = () => {
    if (search && !selectedCategories.includes(search)) {
      onAddCategory(search);
      setSearch('');
    }
    setShowDropdown(false);
  };

  const handleSelectCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      onAddCategory(category);
    }
    setSearch('');
    setShowDropdown(false);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Buscar o agregar categoría..."
        value={search}
        onChangeText={handleSearch}
        onBlur={handleBlur}
        onFocus={() => search && setShowDropdown(true)}
      />
      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectCategory(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <View style={styles.selectedCategoriesContainer}>
        {selectedCategories.map((category, index) => (
          <View key={index} style={styles.selectedCategory}>
            <Text style={styles.categoryText}>{category}</Text>
            <TouchableOpacity onPress={() => onRemoveCategory(category)}>
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}


export default function AddLocationScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categorias`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la ubicación para continuar.');
        setLoadingLocation(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarkerLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
      setLoadingLocation(false);
    };

    fetchUserLocation();
  }, []);

  const handleAddCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  const addTienda = async () => {
    if (!name || !description || !markerLocation || selectedCategories.length === 0) {
      Alert.alert('Error', 'Completa todos los campos, selecciona una ubicación y al menos una categoría.');
      return;
    }
  
    const newTienda = {
      nombre: name || null,
      descripcion: description || null,
      categorias: selectedCategories, // Envía como lista
      latitud: markerLocation?.latitude || null,
      longitud: markerLocation?.longitude || null,
      user_id: auth.currentUser?.uid || null,
    };
  
    try {
      // Verificar categorías existentes antes de agregar nuevas
      const currentCategoriesResponse = await fetch(`${API_URL}/categorias`);
      const existingCategories = await currentCategoriesResponse.json();
  
      for (const category of selectedCategories) {
        if (!existingCategories.includes(category)) {
          const response = await fetch(`${API_URL}/add_categorias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category }),
          });
          if (response.ok) {
            console.log(`Categoría '${category}' añadida correctamente.`);
          } else {
            const result = await response.json();
            console.warn(result.message);
          }
        }
      }
  
      // Agregar la tienda
      const response = await fetch(`${API_URL}/tiendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTienda),
      });
      if (response.ok) {
        Alert.alert('Éxito', 'Local agregado correctamente.');
        tiendaEventEmitterAdd.emit('updateTiendas');
        
        // Refrescar categorías
        const refreshedCategoriesResponse = await fetch(`${API_URL}/categorias`);
        const refreshedCategories = await refreshedCategoriesResponse.json();
        setCategories(refreshedCategories);
  
        // Restablecer los campos
        setName('');
        setDescription('');
        setMarkerLocation(null);
        setSelectedCategories([]);
        
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'No se pudo agregar el local.');
      }
    } catch (error) {
      console.error('Error al agregar local:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el local.');
    }
  };
  
  

  if (loadingLocation) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Nuevo Local</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nombre del local"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del local"
        value={description}
        onChangeText={setDescription}
      />

      <SearchableCategoryInput
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}  // Añade esta línea
        categories={categories}
        selectedCategories={selectedCategories}
      />

      {location && (
        <MapView
          style={styles.map}
          region={location}
          onPress={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
        >
          {markerLocation && (
            <Marker
              coordinate={markerLocation}
              title="Ubicación del local"
              draggable
              onDragEnd={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
            />
          )}
        </MapView>
      )}

      <Button title="Agregar Local" onPress={addTienda} />
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
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#F7F8FA',
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: { marginBottom: 20, zIndex: 1 },
  dropdown: {
    position: 'absolute',
    top: 55,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 150,
    backgroundColor: 'white',
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  selectedCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 5,
  },  
});
