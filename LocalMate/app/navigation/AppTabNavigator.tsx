import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View, StyleSheet } from 'react-native';
import HomeUserScreen from '../screens/User/HomeUserScreen';
import ContributeScreen from '../screens/User/ContributeScreen';
import SavedScreen from '../screens/User/SavedScreen';
import ProfileScreen from '../screens/User/ProfileScreen';

const exploreIcon = require("../../assets/images/Explore.png");
const addIcon = require("../../assets/images/Add.png");
const saveIcon = require("../../assets/images/Guardados.png");
const profileIcon = require("../../assets/images/Profile.png");

const Tab = createBottomTabNavigator();

function TabBarIcon({ source, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <Image source={source} style={[styles.icon, focused ? styles.activeIcon : styles.inactiveIcon]} />
      <Text style={[styles.tabText, focused ? styles.activeText : styles.inactiveText]}>{label}</Text>
    </View>
  );
}

export default function AppTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let iconSource;
          let label;

          switch (route.name) {
            case "HomeUserScreen":
              iconSource = exploreIcon;
              label = "Explorar";
              break;
            case "ContributeScreen":
              iconSource = addIcon;
              label = "Contribuir";
              break;
            case "SavedScreen":
              iconSource = saveIcon;
              label = "Guardados";
              break;
            case "ProfileScreen":
              iconSource = profileIcon;
              label = "Perfil";
              break;
          }

          return <TabBarIcon source={iconSource} label={label} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="HomeUserScreen" component={HomeUserScreen} />
      <Tab.Screen name="ContributeScreen" component={ContributeScreen} />
      <Tab.Screen name="SavedScreen" component={SavedScreen} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 88,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  activeIcon: {
    tintColor: "#006ffd", // Cambia el color a azul cuando está activo
  },
  inactiveIcon: {
    tintColor: "#71727a", // Color gris cuando está inactivo
  },
  tabText: {
    fontSize: 10,
    textAlign: 'center',
  },
  activeText: {
    color: "#006ffd", // Cambia el color del texto a azul cuando está activo
    fontWeight: '600',
  },
  inactiveText: {
    color: "#71727a", // Color gris cuando está inactivo
  },
});
