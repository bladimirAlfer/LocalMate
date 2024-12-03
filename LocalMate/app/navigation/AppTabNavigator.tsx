import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeUserScreen from '../screens/User/HomeUserScreen';
import ContributeScreen from '../screens/User/ContributeScreen';
import SavedScreen from '../screens/User/SavedScreen';
import ProfileScreen from '../screens/User/ProfileScreen';
import ExploreScreen from '../screens/User/ExploreScreen';

const Tab = createBottomTabNavigator();

function TabBarIcon({ name, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <MaterialCommunityIcons name={name} size={24} color={focused ? "#006ffd" : "#71727a"} />
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
          let iconName;
          let label;

          switch (route.name) {
            case "HomeUserScreen":
              iconName = "home-outline";
              label = "Inicio";
              break;
            case "ContributeScreen":
              iconName = "plus";
              label = "Contribuir";
              break;
            case "ExploreScreen":
              iconName = "map-outline";
              label = "Explorar";
              break;
            case "SavedScreen":
              iconName = "bookmark-outline";
              label = "Guardados";
              break;
            case "ProfileScreen":
              iconName = "account-outline";
              label = "Perfil";
              break;
          }

          return <TabBarIcon name={iconName} label={label} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="HomeUserScreen" component={HomeUserScreen} />
      <Tab.Screen name="ContributeScreen" component={ContributeScreen} />
      <Tab.Screen name="ExploreScreen" component={ExploreScreen} />
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
  tabText: {
    fontSize: 10,
    textAlign: 'center',
  },
  activeText: {
    color: "#006ffd", // Color azul cuando está activo
    fontWeight: '600',
  },
  inactiveText: {
    color: "#71727a", // Color gris cuando está inactivo
  },
});

