import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EntityDetailScreen({ route, navigation }) {
    const { entity, isRecommended = false } = route.params;
    
        // Validar la existencia de la entidad
        if (!entity) {
        return (
            <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se encontró información sobre la entidad seleccionada.</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            </View>
        );
        }
    
        const fetchAllEntities = async () => {
        try {
            const response = await fetch('http://172.20.10.2:5001/entidades/todas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta del servidor:', errorText);
            Alert.alert('Error', 'No se pudieron obtener las entidades.');
            return;
            }
    
            const allEntities = await response.json();
            const enrichedEntities = allEntities.map((entity) => ({
            ...entity,
            descripcion: entity.descripcion || 'Descripción no disponible',
            categorias: Array.isArray(entity.categorias) ? entity.categorias : [entity.categorias || 'Categoría no disponible'],
            precio: entity.rango_precios || 'Precio no especificado',
            }));
    
            // Navegar a ExploreScreen con todas las entidades
            navigation.navigate('ExploreScreen');
        } catch (error) {
            console.error('Error al navegar a ExploreScreen:', error);
            Alert.alert('Error', 'No se pudo navegar a la pantalla de exploración.');
            }
        };
        
        const fetchRecommendationsForEntity = async () => {
        try {
            const response = await fetch('http://172.20.10.2:5001/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_df: `${entity.type}_id`,
                [`${entity.type}_id`]: entity[`${entity.type}_id`],
                user_location: [entity.latitud, entity.longitud],
                radius_km: 1,
            }),
            });
    
            if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta del servidor:', errorText);
            Alert.alert('Error', 'No se pudieron obtener las recomendaciones.');
            return;
            }
    
            const recommendations = await response.json();
    
            if (recommendations.length === 0) {
            Alert.alert('Sin recomendaciones', 'No se encontraron recomendaciones para esta entidad.');
            return;
            }
    
            const enrichedRecommendations = recommendations.map((rec) => ({
            ...rec,
            descripcion: rec.descripcion_unificada || 'Descripción no disponible',
            categorias: Array.isArray(rec.categorias) ? rec.categorias : [rec.categorias || 'Categoría no disponible'],
            precio: rec.precio_unificado || 'Precio no especificado',
            }));
    
            // Navegar a ExploreScreen con las recomendaciones
            navigation.navigate('ExploreScreen', { recommendedEntities: enrichedRecommendations });
        } catch (error) {
            console.error('Error al obtener recomendaciones:', error);
            Alert.alert('Error', 'No se pudieron obtener las recomendaciones.');
        }
        };
    
        return (
        <ScrollView style={styles.container}>
            {/* Botón para regresar */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
    
            {/* Información de la entidad */}
            <Text style={styles.title}>{entity.nombre}</Text>
            <Text style={styles.description}>{entity.descripcion || 'Descripción no disponible'}</Text>
            <Text style={styles.price}>
            {entity.precio ? `S/. ${entity.precio}` : 'Precio no especificado'}
            </Text>
            <Text style={styles.category}>
            Categorías:{' '}
            {Array.isArray(entity.categorias)
                ? entity.categorias.join(', ')
                : entity.categorias || 'No especificadas'}
            </Text>
    
            {/* Botón dinámico */}
            {!isRecommended ? (
            <TouchableOpacity style={styles.button} onPress={fetchRecommendationsForEntity}>
                <Text style={styles.buttonText}>Otras opciones</Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity style={styles.button} onPress={fetchAllEntities}>
                <Text style={styles.buttonText}>Ver Todo</Text>
            </TouchableOpacity>
            )}
        </ScrollView>
        );
    }


const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#006ffd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
});
