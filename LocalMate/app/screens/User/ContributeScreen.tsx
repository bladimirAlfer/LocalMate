import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../database/firebase';
import { useNavigation } from '@react-navigation/native';

export default function ContributeScreen() {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const userEmail = auth.currentUser?.email || 'Usuario';
    const nameWithoutDomain = userEmail.split('@')[0];
    setUserName(nameWithoutDomain);
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
      navigation.navigate('Home'); // Redirecciona a la pantalla de inicio
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header personalizado con el botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Bienvenido {userName}</Text>
        <Image
          source={require('../../../assets/images/badass-ash.jpg')}
          style={styles.profileImage}
        />
      </View>

      {/* Sección de beneficios */}
      <Text style={styles.sectionTitle}>Beneficios GreatMate</Text>
      <View style={styles.benefitsList}>
        <Text style={styles.benefit}>• Vales de descuento semanales</Text>
        <Text style={styles.benefit}>• Promocionar tu negocio</Text>
        <Text style={styles.benefit}>• Mayor alcance en tus opiniones</Text>
        <Text style={styles.benefit}>• Visualización interactiva de tus movimientos</Text>
      </View>

      {/* Opciones de suscripción */}
      <Text style={styles.plansTitle}>Planes ofrecidos</Text>
      <View style={styles.plansContainer}>
        <TouchableOpacity style={styles.planBox}>
          <Text style={styles.planText}>Suscripción Mensual</Text>
          <Text style={styles.priceText}>S/. 6.00</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.planBox}>
          <Text style={styles.planText}>Suscripción Anual</Text>
          <Text style={styles.priceText}>S/. 50.00</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    paddingRight: 10, // Espacio a la derecha del botón de menú
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefit: {
    fontSize: 16,
    color: '#71727a',
    marginBottom: 5,
    lineHeight: 24,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planBox: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 20,
    margin: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
  planText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
