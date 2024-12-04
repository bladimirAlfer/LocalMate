import React, { useState } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Border, FontFamily, FontSize, Color, Padding } from "constants/GlobalStyles";

const VerticalCard = ({ store, userId, userLocation }) => {
  const navigation = useNavigation();
  const [startTime, setStartTime] = useState(null);

  // Función para registrar la interacción (Visita)
  const registrarInteraccion = async (interactionDuration) => {
    console.log("Datos para registrar la interacción:", {
      userId,
      contenido_id: store?.local_id,
      userLocation,
      tiempo_interaccion: interactionDuration,
    });

    if (!userId || !store?.local_id || !userLocation) {
      console.warn("Faltan datos para registrar la interacción:", {
        userId,
        contenido_id: store?.local_id,
        userLocation,
      });
      return;
    }

    try {
      const db = getFirestore();
      const interaccionData = {
        user_id: userId,
        contenido_id: store.local_id,
        tipo_interaccion: "Visita",
        fecha_interaccion: new Date().toISOString().split("T")[0],
        hora_interaccion: new Date().toLocaleTimeString(),
        tiempo_interaccion: interactionDuration, // Tiempo en milisegundos
        ubicacion_usuario: userLocation,
        nombre_tienda: store.nombre,
        categorias: store.categorias,
      };

      await addDoc(collection(db, "interacciones"), interaccionData);

      console.log("Interacción registrada correctamente para la tienda:", store.nombre);
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
    <View style={styles.verticalCard}>
      <View style={styles.imageParent}>
        <View style={styles.image}>
        <Image
          style={styles.imageIcon}
          resizeMode="cover"
          source={{ uri: getValidImageUrl(store?.imagenes) }} // Cambia imageUrl a imagenes
        />
        </View>
        <View style={[styles.tag, styles.tagFlexBox]}>
          <View style={styles.text}>
            <Text style={[styles.text1, styles.text1Typo]}>Rating {store?.calificaciones || "N/A"}</Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.title1} numberOfLines={1} ellipsizeMode="tail">
            {store?.nombre || "Tienda"}
          </Text>
          <Text style={[styles.subtitle, styles.buttonTypo]} numberOfLines={1} ellipsizeMode="tail">
            {store?.direccion || "Dirección no disponible"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.buttonSecondary, styles.tagFlexBox]}
          onPressIn={handlePressIn} // Detectar inicio de interacción
          onPressOut={() => {
            handlePressOut(); // Detectar fin de interacción
            handleMoreDetails();
          }}
        >
          <Text style={[styles.button, styles.buttonTypo]}>Más Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tagFlexBox: {
    borderRadius: Border.br_xs,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text1Typo: {
    fontFamily: FontFamily.actionActionM,
    fontWeight: "600",
  },
  buttonTypo: {
    fontSize: FontSize.actionActionM_size,
    textAlign: "left",
  },
  imageIcon: {
    width: "100%",
    height: "100%",
    borderRadius: Border.br_xs,
    overflow: "hidden",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: Color.neutralLightLightest,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: Color.highlightLightest,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_xs,
    overflow: "hidden",
  },
  text1: {
    fontSize: FontSize.captionCaptionM_size,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: Color.neutralLightLightest,
    textAlign: "center",
  },
  text: {
    paddingHorizontal: 4,
    paddingVertical: 0,
    flexDirection: "row",
  },
  tag: {
    top: 10,
    right: 10,
    backgroundColor: Color.highlightDarkest,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    position: "absolute",
    borderRadius: Border.br_xs,
  },
  imageParent: {
    height: 120,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  title1: {
    fontSize: FontSize.headingH4_size,
    fontWeight: "700",
    fontFamily: FontFamily.headingH4,
    color: Color.neutralDarkDarkest,
    textAlign: "left",
    alignSelf: "stretch",
  },
  subtitle: {
    fontSize: FontSize.bodyBodyS_size,
    letterSpacing: 0.1,
    lineHeight: 16,
    fontFamily: FontFamily.bodyBodyS,
    color: Color.neutralDarkLight,
    alignSelf: "stretch",
  },
  title: {
    gap: 4,
    alignSelf: "stretch",
  },
  button: {
    color: Color.highlightDarkest,
    fontFamily: FontFamily.actionActionM,
    fontWeight: "600",
  },
  buttonSecondary: {
    borderStyle: "solid",
    borderColor: Color.highlightDarkest,
    borderWidth: 1.5,
    height: 40,
    paddingHorizontal: Padding.p_base,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_xs,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  content: {
    padding: Padding.p_base,
    gap: 8,
    alignSelf: "stretch",
  },
  verticalCard: {
    borderRadius: 16,
    backgroundColor: Color.blac,
    flex: 1,
    width: 200,
    overflow: "hidden",
    marginRight: 15,
  },
});

export default VerticalCard;
