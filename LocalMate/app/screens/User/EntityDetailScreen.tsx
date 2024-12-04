import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

export default function EntityDetailScreen({ route, navigation }) {
    const { entity, isRecommended = false } = route.params;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userReactions, setUserReactions] = useState({}); // Inicializa como un objeto vacío

    useEffect(() => {
        if (entity) {
            fetchReviews();
        }
    }, [entity]);

    const fetchReviews = async () => {
        try {
            const db = getFirestore();
            const entityIdField = `${entity.type}_id`;

            if (!entity[entityIdField]) {
                throw new Error(`El campo ${entityIdField} no está definido para esta entidad.`);
            }

            const q = query(
                collection(db, 'reviews'),
                where('entidad_id', '==', entity[entityIdField]),
                where('entity_type', '==', entity.type)
            );
            const querySnapshot = await getDocs(q);

            const reviewsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setReviews(reviewsList);
        } catch (error) {
            console.error('Error al obtener reseñas:', error);
            Alert.alert('Error', 'No se pudieron cargar las reseñas.');
        } finally {
            setLoading(false);
        }
    };

    const updateReviewInteraction = async (reviewId, field) => {
        try {
            const db = getFirestore();
            const reviewRef = doc(db, 'reviews', reviewId);

            const updatedReviews = reviews.map((review) => {
                if (review.id === reviewId) {
                    const updatedValue = (review[field] || 0) + 1;
                    return { ...review, [field]: updatedValue };
                }
                return review;
            });

            setReviews(updatedReviews);

            const updatedReview = updatedReviews.find((review) => review.id === reviewId);
            await updateDoc(reviewRef, { [field]: updatedReview[field] });
        } catch (error) {
            console.error(`Error al actualizar ${field}:`, error);
            Alert.alert('Error', 'No se pudo registrar la interacción.');
        }
    };

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
            navigation.navigate('ExploreScreen', { entities: allEntities });
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
            navigation.navigate('ExploreScreen', { recommendedEntities: recommendations });
        } catch (error) {
            console.error('Error al obtener recomendaciones:', error);
            Alert.alert('Error', 'No se pudieron obtener las recomendaciones.');
        }
    };

    const toggleReaction = async (reviewId, reaction) => {
        try {
            const db = getFirestore();
            const reviewRef = doc(db, 'reviews', reviewId);

            const currentReaction = userReactions[reviewId];
            const updatedReaction = currentReaction === reaction ? null : reaction; // Toggle reaction

            const updatedReviews = reviews.map((review) => {
                if (review.id === reviewId) {
                    const newCounts = { ...review };

                    // Adjust counts for previous and new reaction
                    if (currentReaction) {
                        newCounts[currentReaction] = (newCounts[currentReaction] || 1) - 1;
                    }
                    if (updatedReaction) {
                        newCounts[updatedReaction] = (newCounts[updatedReaction] || 0) + 1;
                    }

                    return newCounts;
                }
                return review;
            });

            setReviews(updatedReviews);
            setUserReactions({ ...userReactions, [reviewId]: updatedReaction });

            const updatedReview = updatedReviews.find((review) => review.id === reviewId);
            await updateDoc(reviewRef, {
                [reaction]: updatedReview[reaction],
            });
        } catch (error) {
            console.error(`Error al actualizar reacción:`, error);
            Alert.alert('Error', 'No se pudo registrar la reacción.');
        }
    };
    
    const renderReview = ({ item }) => {
        const userReaction = userReactions[item.id];

        return (
            <View style={styles.reviewCard}>
                <Text style={styles.reviewText}>{item.text}</Text>
                <View style={styles.reviewDetails}>
                    <Text style={styles.reviewRating}>⭐ {item.stars}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
                <View style={styles.actionsContainer}>
                    {['likes', 'dislikes', 'useful', 'funny', 'cool'].map((reaction) => (
                        <TouchableOpacity
                            key={reaction}
                            style={[
                                styles.actionButton,
                                userReaction === reaction && styles.selectedActionButton,
                            ]}
                            onPress={() => toggleReaction(item.id, reaction)}
                        >
                            <Ionicons
                                name={
                                    reaction === 'likes'
                                        ? 'thumbs-up-outline'
                                        : reaction === 'dislikes'
                                        ? 'thumbs-down-outline'
                                        : reaction === 'useful'
                                        ? 'checkmark-circle-outline'
                                        : reaction === 'funny'
                                        ? 'happy-outline'
                                        : 'snow-outline'
                                }
                                size={20}
                                color={userReaction === reaction ? '#ffffff' : '#006ffd'}
                            />
                            <Text
                                style={{
                                    color: userReaction === reaction ? '#ffffff' : '#006ffd',
                                }}
                            >
                                {item[reaction] || 0}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {!entity ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No se encontró información sobre la entidad seleccionada.</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    renderItem={renderReview}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="#333" />
                            </TouchableOpacity>
                            <Image source={{ uri: entity.imagenes }} style={styles.image} />
                            <Text style={styles.title}>{entity.nombre}</Text>
                            <Text style={styles.description}>{entity.descripcion_breve || 'Descripción no disponible'}</Text>
                            <Text style={styles.detail}>Dirección: {entity.direccion}</Text>
                            <Text style={styles.detail}>Horario: {entity.horario}</Text>
                            <Text style={styles.detail}>Calificaciones: ⭐ {entity.calificaciones}</Text>
                            <Text style={styles.detail}>Rango de precios: {entity.rango_precios}</Text>
                            <Text style={styles.detail}>Métodos de pago: {entity.metodos_pago}</Text>
                            <Text style={styles.detail}>
                                Accesibilidad: {entity.accesibilidad ? 'Sí' : 'No'}
                            </Text>
                            <Text style={styles.detail}>
                                Estacionamiento: {entity.estacionamiento ? 'Sí' : 'No'}
                            </Text>
                            <Text style={styles.detail}>Wifi: {entity.wifi ? 'Disponible' : 'No disponible'}</Text>
                            <Text style={styles.detail}>
                                Especialidades: {entity.especialidades || 'No especificadas'}
                            </Text>
                            <Text style={styles.detail}>Tags: {entity.tags}</Text>
                            <Text style={styles.sectionTitle}>Reseñas:</Text>
                        </>
                    }
                    ListFooterComponent={
                        <>
                            <TouchableOpacity
                                style={styles.reviewButton}
                                onPress={() => navigation.navigate('ReviewScreen', { entity })}
                            >
                                <Text style={styles.reviewButtonText}>Deja tu reseña</Text>
                            </TouchableOpacity>
                            {!isRecommended ? (
                                <TouchableOpacity style={styles.button} onPress={fetchRecommendationsForEntity}>
                                    <Text style={styles.buttonText}>Otras opciones</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.button} onPress={fetchAllEntities}>
                                    <Text style={styles.buttonText}>Ver Todo</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    }
                    ListEmptyComponent={
                        <Text style={styles.noReviewsText}>No hay reseñas disponibles.</Text>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
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
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
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
    detail: {
        fontSize: 14,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    reviewsList: {
        marginBottom: 20,
    },
    reviewCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    reviewText: {
        fontSize: 14,
        marginBottom: 10,
    },
    reviewDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reviewRating: {
        fontWeight: 'bold',
    },
    reviewDate: {
        fontSize: 12,
        color: '#888',
    },
    noReviewsText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
    },
    reviewButton: {
        backgroundColor: '#006ffd',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    reviewButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    loadingText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#888',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#EAF2FF',
    },
    selectedActionButton: {
        backgroundColor: '#006ffd',
    },
});
