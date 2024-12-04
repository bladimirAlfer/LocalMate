import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { db, auth } from "../../database/firebase"; // Asegúrate de tener configurado Firebase
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const TAGS_BY_TYPE = {
  local: {
    liked: ["Comodidad", "Servicio amigable", "Ubicación ideal"],
    improved: ["Variedad limitada", "Poco interactivo", "Estacionamiento limitado"],
  },
  evento: {
    liked: ["Bien organizado", "Emocionante", "Único"],
    improved: ["Horarios restringidos", "Demasiado concurrido", "Poco accesible"],
  },
  actividad: {
    liked: ["Divertido", "Educativo", "Interesante"],
    improved: ["Falta de materiales", "Mal tiempo", "Poco personal"],
  },
};

export default function ReviewsScreen({ route, navigation }) {
  const { entity } = route.params;
  const [selectedLikedTags, setSelectedLikedTags] = useState([]);
  const [selectedImprovedTags, setSelectedImprovedTags] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);

  // Obtener el ID del usuario autenticado
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return unsubscribe;
  }, []);

  const tagsForEntity = TAGS_BY_TYPE[entity.type] || { liked: [], improved: [] };

  const toggleTag = (tag, type) => {
    const setTags = type === "liked" ? setSelectedLikedTags : setSelectedImprovedTags;
    const currentTags =
      type === "liked" ? selectedLikedTags : selectedImprovedTags;

    if (currentTags.includes(tag)) {
      setTags(currentTags.filter((t) => t !== tag));
    } else {
      setTags([...currentTags, tag]);
    }
  };

  const submitReview = async () => {
    if (!userId) {
      Alert.alert("Error", "No estás autenticado.");
      return;
    }
    if (rating === 0) {
      Alert.alert("Error", "Por favor, selecciona una calificación.");
      return;
    }
    if (!selectedLikedTags.length && !selectedImprovedTags.length) {
      Alert.alert("Error", "Por favor, selecciona al menos un tag.");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Error", "Por favor, escribe un comentario.");
      return;
    }
  
    // Determina el campo ID correcto basado en el tipo de entidad
    const entityIdField = `${entity.type}_id`;
  
    if (!entity[entityIdField]) {
      Alert.alert("Error", `El campo ${entityIdField} no está definido para esta entidad.`);
      return;
    }
  
    const reviewData = {
        user_id: userId,
        entidad_id: entity[`${entity.type}_id`],
        entity_type: entity.type, // Agrega el tipo de entidad
        stars: rating,
        date: new Date().toISOString().split("T")[0],
        text: comment,
        palabras_clave: [...selectedLikedTags, ...selectedImprovedTags],
        useful: 0,
        funny: 0,
        cool: 0,
        likes: 0,
        dislikes: 0,
      };
  
    try {
      await addDoc(collection(db, "reviews"), reviewData);
      Alert.alert("Éxito", "Reseña enviada correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      Alert.alert("Error", "No se pudo enviar la reseña.");
    }
  };
  

  const renderTags = (tags, type) => (
    <View style={styles.tagsContainer}>
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag}
          style={
            (type === "liked" ? selectedLikedTags : selectedImprovedTags).includes(
              tag
            )
              ? [styles.tag, styles.tagSelected]
              : [styles.tag, styles.tagUnselected]
          }
          onPress={() => toggleTag(tag, type)}
        >
          <Text
            style={
              (type === "liked" ? selectedLikedTags : selectedImprovedTags).includes(
                tag
              )
                ? styles.tagTextSelected
                : styles.tagTextUnselected
            }
          >
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStars = () => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text
            style={
              star <= rating
                ? styles.starSelected
                : styles.starUnselected
            }
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.title}>¿Cómo calificarías esta entidad?</Text>
        {renderStars()}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>¿Qué te gustó?</Text>
        {renderTags(tagsForEntity.liked, "liked")}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>¿Qué se puede mejorar?</Text>
        {renderTags(tagsForEntity.improved, "improved")}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Escribe un comentario</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe aquí tu comentario..."
          multiline
          value={comment}
          onChangeText={setComment}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
        <Text style={styles.submitButtonText}>Enviar Reseña</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
  },
  backButton: {
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: "#006FFD",
    fontWeight: "600",
  },
  section: {
    marginBottom: 56,
  },
  title: {
    color: "#1F2024",
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "800",
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagUnselected: {
    backgroundColor: "#EAF2FF",
  },
  tagSelected: {
    backgroundColor: "#006FFD",
  },
  tagTextUnselected: {
    color: "#006FFD",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tagTextSelected: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  starSelected: {
    fontSize: 24,
    color: "#006FFD",
    marginRight: 8,
  },
  starUnselected: {
    fontSize: 24,
    color: "#D4D6DD",
    marginRight: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#C5C6CC",
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    color: "#1F2024",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#006FFD",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 1,
  },
  submitButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
