import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { db, auth } from '../../database/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function InformationScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://172.20.10.2:5001/categorias');
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const guardarData = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'No se pudo autenticar el usuario.');
      return;
    }

    try {
      const onboardingData = JSON.parse((await AsyncStorage.getItem('onboardingData')) || '{}');
      const {
        firstName = '',
        lastName = '',
        birthDate = '',
        age = '',
        gender = '',
        district = '',
        socioeconomicLevel = '',
        zone = '',
      } = onboardingData;

      const userData = {
        user_id: userId,
        nombre: firstName,
        apellido: lastName,
        fecha_nacimiento: birthDate,
        edad: age,
        genero: gender,
        distrito: district,
        nivel_socioeconomico: socioeconomicLevel,
        zona: zone,
        categorias_favoritas: selectedCategories,
        frecuencia_visitas: '',
        metodo_pago_preferido: '',
        ubicacion_preferida: '',
        promociones_interesantes: '',
        ultima_interaccion: new Date().toISOString(),
        popularidad_usuario: 0,
        hasCompletedOnboarding: true, // Marca el onboarding como completo
      };

      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, userData, { merge: true });

      // Limpia AsyncStorage
      await AsyncStorage.multiRemove(['onboardingData', 'userCategories']);
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

      console.log('Datos enviados a Firebase y onboarding completado.');

      navigation.replace('AppDrawer');
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el onboarding.');
      console.error(error);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007B5D" />
        <Text style={styles.loaderText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        {[...Array(2)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              index === 1 ? styles.progressBarActive : styles.progressBarInactive,
            ]}
          />
        ))}
      </View>

      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Personaliza tu experiencia</Text>
        <Text style={styles.description}>Selecciona tus intereses.</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#71727A" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar categorías..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de categorías */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategories.includes(item)
                ? styles.categoryItemSelected
                : styles.categoryItemDefault,
            ]}
            onPress={() => toggleCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategories.includes(item)
                  ? styles.categoryTextSelected
                  : styles.categoryTextDefault,
              ]}
            >
              {item}
            </Text>
            {selectedCategories.includes(item) && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#ffffff"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Botón Continuar */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedCategories.length > 0
            ? styles.continueButtonActive
            : styles.continueButtonInactive,
        ]}
        onPress={guardarData}
        disabled={selectedCategories.length === 0}
      >
        <Text style={styles.continueButtonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: 20,
    height: 5,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  progressBarActive: {
    backgroundColor: '#007B5D',
  },
  progressBarInactive: {
    backgroundColor: '#E8E9F1',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#E5E7EB',
  },
  categoryItemSelected: {
    backgroundColor: '#007B5D',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1F2937',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 8,
  },
  continueButton: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonActive: {
    backgroundColor: '#007B5D',
  },
  continueButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007B5D',
  },
});
