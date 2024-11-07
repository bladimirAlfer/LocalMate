import React, { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

const exploreIcon = require("../../assets/images/Explore.png");
const addIcon = require("../../assets/images/Add.png");
const saveIcon = require("../../assets/images/Guardados.png");
const profileIcon = require("../../assets/images/Profile.png");

const TabBar = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Explorar");

  const handlePress = (tab, route) => {
    setSelectedTab(tab);
    navigation.navigate(route);
  };

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tab1} onPress={() => handlePress("Explorar", "HomeUserScreen")}>
        <Image style={styles.icon} resizeMode="cover" source={exploreIcon} />
        <Text style={[styles.tabName, selectedTab === "Explorar" ? styles.activeText : styles.inactiveText]}>Explorar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab1} onPress={() => handlePress("Contribuir", "ContributeScreen")}>
        <Image style={styles.icon} resizeMode="cover" source={addIcon} />
        <Text style={[styles.tabName, selectedTab === "Contribuir" ? styles.activeText : styles.inactiveText]}>Contribuir</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab1} onPress={() => handlePress("Guardados", "SavedScreen")}>
        <Image style={styles.icon} resizeMode="cover" source={saveIcon} />
        <Text style={[styles.tabName, selectedTab === "Guardados" ? styles.activeText : styles.inactiveText]}>Guardados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab1} onPress={() => handlePress("Perfil", "ProfileScreen")}>
        <Image style={styles.icon} resizeMode="cover" source={profileIcon} />
        <Text style={[styles.tabName, selectedTab === "Perfil" ? styles.activeText : styles.inactiveText]}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    height: 88,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 4,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab1: {
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  tabName: {
    textAlign: "center",
    fontSize: 10,
  },
  activeText: {
    color: "#1f2024",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#71727a",
  },
});

export default TabBar;
