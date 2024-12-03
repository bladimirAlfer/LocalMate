import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Border, FontFamily, FontSize, Color, Padding } from "constants/GlobalStyles";
import { useNavigation } from '@react-navigation/native';

const VerticalCard = ({ store, userId, userLocation }) => {
  const navigation = useNavigation();

  // Función para registrar la interacción (Visita)
  const registrarInteraccion = async () => {
    if (!userId || !store?.local_id || !userLocation) {
      console.warn("Faltan datos para registrar la interacción:", {
        userId,
        contenido_id: store?.local_id,
        userLocation,
      });
      return;
    }
  
    try {
      const response = await fetch("http://172.20.10.2:5001/guardar_interaccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          contenido_id: store.local_id,
          tipo_interaccion: "Visita",
          fecha_interaccion: new Date().toISOString().split("T")[0],
          hora_interaccion: new Date().toLocaleTimeString(),
          ubicacion_usuario: userLocation,
        }),
      });
  
      if (response.ok) {
        console.log("Interacción registrada correctamente para la tienda:", store.nombre);
      } else {
        console.error("Error al registrar la interacción.");
      }
    } catch (error) {
      console.error("Error en registrarInteraccion:", error);
    }
  };
  

  const handleMoreDetails = () => {
    registrarInteraccion(); // Registrar interacción al hacer clic
    navigation.navigate('StoreDetailScreen', { store });
  };

  return (
    <View style={styles.verticalCard}>
      <View style={styles.imageParent}>
        <View style={styles.image}>
          <Image
            style={styles.imageIcon}
            resizeMode="cover"
            source={
              store?.imageUrl
                ? { uri: store.imageUrl }
                : { uri: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" }
            }
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
        <TouchableOpacity style={[styles.buttonSecondary, styles.tagFlexBox]} onPress={handleMoreDetails}>
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
    alignItems: "center"
  },
  text1Typo: {
    fontFamily: FontFamily.actionActionM,
    fontWeight: "600"
  },
  buttonTypo: {
    fontSize: FontSize.actionActionM_size,
    textAlign: "left"
  },
  imageIcon: {
    width: "100%",
    height: "100%",
    borderRadius: Border.br_xs,
    overflow: "hidden"
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
    overflow: "hidden"
  },
  text1: {
    fontSize: FontSize.captionCaptionM_size,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: Color.neutralLightLightest,
    textAlign: "center"
  },
  text: {
    paddingHorizontal: 4,
    paddingVertical: 0,
    flexDirection: "row"
  },
  tag: {
    top: 10,
    right: 10,
    backgroundColor: Color.highlightDarkest,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    position: "absolute",
    borderRadius: Border.br_xs
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
    alignSelf: "stretch"
  },
  subtitle: {
    fontSize: FontSize.bodyBodyS_size,
    letterSpacing: 0.1,
    lineHeight: 16,
    fontFamily: FontFamily.bodyBodyS,
    color: Color.neutralDarkLight,
    alignSelf: "stretch"
  },
  title: {
    gap: 4,
    alignSelf: "stretch"
  },
  button: {
    color: Color.highlightDarkest,
    fontFamily: FontFamily.actionActionM,
    fontWeight: "600"
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
    overflow: "hidden"
  },
  content: {
    padding: Padding.p_base,
    gap: 8,
    alignSelf: "stretch"
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
