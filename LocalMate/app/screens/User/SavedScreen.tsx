import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SavedScreen() {
  const [savedRecommendations, setSavedRecommendations] = useState<any[]>([]);

  // Cargar recomendaciones guardadas desde AsyncStorage, luego podemos cambiarlas a firebase
  useEffect(() => {
    const loadSavedRecommendations = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedRecommendations');
        if (savedData) {
          setSavedRecommendations(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error al cargar las recomendaciones guardadas:', error);
        Alert.alert('Error', 'No se pudieron cargar las recomendaciones guardadas.');
      }
    };

    loadSavedRecommendations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recomendaciones Guardadas</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {savedRecommendations.length > 0 ? (
          savedRecommendations.map((recommendation) => (
            <View key={recommendation.id} style={styles.recommendationContainer}>
              <Text style={styles.recommendationName}>{recommendation.name}</Text>
              <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
              <Text style={styles.recommendationInfo}>{`${recommendation.distance} km • ${recommendation.rating} ⭐`}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noRecommendationsText}>No tienes recomendaciones guardadas.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  recommendationContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#71727a',
  },
  recommendationInfo: {
    fontSize: 12,
    color: '#71727a',
    marginTop: 4,
  },
  noRecommendationsText: {
    fontSize: 16,
    color: '#71727a',
    textAlign: 'center',
    marginTop: 50,
  },
});
