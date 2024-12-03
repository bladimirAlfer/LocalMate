import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { signOut } from 'firebase/auth';
import { auth } from '../app/database/firebase';
import { CommonActions } from '@react-navigation/native';

export default function DrawerContent(props) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  // Obtén la ruta actual y la pantalla activa dentro de `AppTabNavigator`
  const currentRoute = props.state?.routes?.[props.state.index]?.state
  ? props.state.routes[props.state.index].state.routes[props.state.routes[props.state.index].state.index].name
  : props.state?.routes?.[props.state.index]?.name;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>Nombre del Usuario</Text>
        </View>

        <DrawerItem
          icon={({ size }) => (
            <Icon
              name="home-outline"
              color={currentRoute === 'HomeUserScreen' ? '#4A90E2' : '#71727a'}
              size={size}
            />
          )}
          label="Inicio"
          labelStyle={currentRoute === 'HomeUserScreen' ? styles.activeLabel : styles.inactiveLabel}
          onPress={() => {
            props.navigation.navigate('HomeTabs', { screen: 'HomeUserScreen' });
            props.navigation.closeDrawer(); // Cierra el Drawer después de la selección
          }}
        />

        <DrawerItem
          icon={({ size }) => (
            <Icon name="plus" color={currentRoute === 'AddLocationScreen' ? '#4A90E2' : '#71727a'} size={size} />
          )}
          label="Agregar Local"
          labelStyle={currentRoute === 'AddLocationScreen' ? styles.activeLabel : styles.inactiveLabel}
          onPress={() => {
            props.navigation.navigate('AddLocationScreen'); // Navega directamente a AddLocationScreen
            props.navigation.closeDrawer();
          }}
        />

        <DrawerItem
          icon={({ size }) => (
            <Icon name="storefront-outline" color={currentRoute === 'MyLocationsScreen' ? '#4A90E2' : '#71727a'} size={size} />
          )}
          label="Mis Locales"
          labelStyle={currentRoute === 'MyLocationsScreen' ? styles.activeLabel : styles.inactiveLabel}
          onPress={() => {
            props.navigation.navigate('MyLocationsScreen'); // Navega directamente a MyLocationsScreen
            props.navigation.closeDrawer();
          }}        
        />


        <DrawerItem
          icon={({ size }) => (
            <Icon
              name="account-outline"
              color={currentRoute === 'ProfileScreen' ? '#4A90E2' : '#71727a'}
              size={size}
            />
          )}
          label="Perfil"
          labelStyle={currentRoute === 'ProfileScreen' ? styles.activeLabel : styles.inactiveLabel}
          onPress={() => {
            props.navigation.navigate('HomeTabs', { screen: 'ProfileScreen' });
            props.navigation.closeDrawer();
          }}
        />

        <DrawerItem
          icon={({ size }) => (
            <Icon name="exit-to-app" color="#71727a" size={size} />
          )}
          label="Cerrar Sesión"
          labelStyle={styles.inactiveLabel}
          onPress={handleSignOut}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingVertical: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeLabel: {
    color: '#4A90E2', // Color del texto cuando está activo
    fontWeight: 'bold',
  },
  inactiveLabel: {
    color: '#71727a', // Color del texto cuando está inactivo
  },
});


