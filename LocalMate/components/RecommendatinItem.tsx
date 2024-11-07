import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecommendationItem({ recommendation }) {
  const saveRecommendation = async () => {
    try {
      const savedRecommendations = JSON.parse(await AsyncStorage.getItem('savedRecommendations')) || [];
      
      // Evita guardar recomendaciones duplicadas
      if (!savedRecommendations.some((item) => item.id === recommendation.id)) {
        const updatedRecommendations = [...savedRecommendations, recommendation];
        await AsyncStorage.setItem('savedRecommendations', JSON.stringify(updatedRecommendations));
        Alert.alert('Guardado', 'Recomendación guardada exitosamente.');
      } else {
        Alert.alert('Guardado', 'Esta recomendación ya está guardada.');
      }
    } catch (error) {
      console.error('Error al guardar la recomendación:', error);
      Alert.alert('Error', 'No se pudo guardar la recomendación.');
    }
  };

  return (
    <View style={styles.recommendationContainer}>
      <Text style={styles.title}>{recommendation.name}</Text>
      <Text style={styles.description}>{recommendation.description}</Text>
      <Text style={styles.distance}>{recommendation.distance} km</Text>
      <TouchableOpacity style={styles.saveButton} onPress={saveRecommendation}>
        <Text style={styles.saveButtonText}>Guardar Recomendación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  recommendationContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  distance: {
    fontSize: 12,
    color: '#888',
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#006ffd',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
