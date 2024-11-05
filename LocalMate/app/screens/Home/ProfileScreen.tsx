// app/screens/Home/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../../database/firebase';

const ProfileScreen = () => {
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>
      {user ? (
        <>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>UID: {user.uid}</Text>
        </>
      ) : (
        <Text style={styles.info}>No hay usuario autenticado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;
