import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Border, FontFamily, FontSize, Color } from "constants/StyleHorizontalcard";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HorizontalCard = ({ store, userId, userLocation }) => {
  const navigation = useNavigation();

  // Función para registrar la interacción (Visita)
  const registrarInteraccion = async () => {
    if (!userId || !store?.tienda_id || !userLocation) {
      console.warn("Faltan datos para registrar la interacción.");
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
    <TouchableOpacity style={styles.horizontalCard} onPress={handleMoreDetails}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.imageIcon}
          resizeMode="cover"
          source={store?.imageUrl
            ? { uri: store.imageUrl }
            : { uri: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" }}
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
