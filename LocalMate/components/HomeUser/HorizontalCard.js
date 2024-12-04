import React, { useState } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Border, FontFamily, FontSize, Color } from "constants/StyleHorizontalcard";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, addDoc } from "firebase/firestore";

const HorizontalCard = ({ store, userId, userLocation }) => {
  const navigation = useNavigation();
  const [startTime, setStartTime] = useState(null);

  const registrarInteraccion = async (interactionDuration) => {
    const contenidoId = store.local_id;
    if (!userId || !contenidoId || !userLocation) {
      console.warn("Faltan datos para registrar la interacción.");
      return;
    }

    try {
      // Registrar la interacción en el backend
      const response = await fetch("http://172.20.10.2:5001/guardar_interaccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          contenido_id: contenidoId,
          tipo_interaccion: "Visita",
          tiempo_interaccion: interactionDuration, // Tiempo en milisegundos
          fecha_interaccion: new Date().toISOString().split("T")[0],
          hora_interaccion: new Date().toLocaleTimeString(),
          ubicacion_usuario: userLocation,
        }),
      });

      if (response.ok) {
        console.log("Interacción registrada correctamente para la tienda:", store.nombre);
      } else {
        const errorText = await response.text();
        console.error("Error en la respuesta del servidor:", errorText);
      }

      // Registrar la interacción en Firebase Firestore
      const db = getFirestore();
      const interaccionData = {
        user_id: userId,
        contenido_id: contenidoId,
        tipo_interaccion: "Visita",
        tiempo_interaccion: interactionDuration,
        fecha_interaccion: new Date().toISOString().split("T")[0],
        hora_interaccion: new Date().toLocaleTimeString(),
        ubicacion_usuario: userLocation,
        nombre_tienda: store.nombre,
        categorias: store.categorias,
      };

      const docRef = await addDoc(collection(db, "interacciones"), interaccionData);
      console.log("Interacción registrada en Firebase con ID:", docRef.id);

    } catch (error) {
      console.error("Error en registrarInteraccion:", error);
    }
  };

  const handlePressIn = () => {
    setStartTime(Date.now()); // Registrar el tiempo de inicio
  };

  const handlePressOut = () => {
    if (startTime) {
      const endTime = Date.now();
      const interactionDuration = endTime - startTime; // Calcular el tiempo de interacción
      registrarInteraccion(interactionDuration); // Enviar el tiempo al backend y Firebase
    }
  };

  const handleMoreDetails = () => {
    navigation.navigate('StoreDetailScreen', { store });
  };

  const getValidImageUrl = (imageUrl) => {
    return imageUrl && imageUrl.startsWith("http")
      ? imageUrl
      : "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";
  };

  return (
    <TouchableOpacity
      style={styles.horizontalCard}
      onPressIn={handlePressIn} // Detectar inicio de interacción
      onPressOut={() => {
        handlePressOut(); // Detectar fin de interacción
        handleMoreDetails();
      }}
    >
      <View style={styles.imageWrapper}>
      <Image
        style={styles.imageIcon}
        resizeMode="cover"
        source={{ uri: getValidImageUrl(store?.imagenes) }} // Cambia imageUrl a imagenes
      />
      </View>
      <View style={styles.contentParent}>
        <Text style={styles.title} numberOfLines={1}>
          {store?.nombre?.length > 40
            ? `${store.nombre.substring(0, 20)}...`
            : store?.nombre || "Nombre no disponible"}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {store?.categorias?.length > 40
            ? `${store.categorias.substring(0, 20)}...`
            : store?.categorias || "Categoría no disponible"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Color.neutralDarkLight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.neutralLightLight,
    borderRadius: Border.br_base,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 8,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    height: 80,
    width: "90%",
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: Border.br_base,
    overflow: "hidden",
    backgroundColor: Color.highlightLightest,
    marginRight: 12,
  },
  imageIcon: {
    width: "100%",
    height: "100%",
  },
  contentParent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: FontSize.headingH4_size,
    fontWeight: "700",
    fontFamily: FontFamily.headingH4,
    color: Color.neutralDarkDarkest,
    textAlign: "left",
  },
  subtitle: {
    fontSize: FontSize.bodyBodyS_size,
    fontFamily: FontFamily.bodyBodyS,
    color: Color.neutralDarkLight,
    textAlign: "left",
    marginTop: 2,
  },
});

export default HorizontalCard;
