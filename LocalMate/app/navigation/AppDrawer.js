// AppDrawer.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppTabNavigator from './AppTabNavigator';
import ProfileScreen from '../screens/User/ProfileScreen';
import AddLocationScreen from '../screens/User/AddLocationScreen';
import MyLocationsScreen from '../screens/User/MyLocationsScreen';
import DrawerContent from '../../components/DrawerContent';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen 
        name="HomeTabs" 
        component={AppTabNavigator} 
        options={{ title: 'Inicio' }} 
      />
      <Drawer.Screen 
        name="AddLocationScreen" 
        component={AddLocationScreen} 
        options={{ title: 'Agregar Local', headerShown: false }} // headerShown: true oculta el tab bar
      />
      <Drawer.Screen 
        name="MyLocationsScreen" 
        component={MyLocationsScreen} 
        options={{ title: 'Mis Locales', headerShown: false }}
      />
      
      
    </Drawer.Navigator>
  );
}
