import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../database/firebase';

export default function ContributeScreen() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userEmail = auth.currentUser?.email || 'Usuario';
    const nameWithoutDomain = userEmail.split('@')[0];
    setUserName(nameWithoutDomain);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="black" />
        <Text style={styles.welcomeText}>Bienvenido {userName}</Text>
        <Image
          source={require('../../../assets/images/badass-ash.jpg')} // Cambiar a la imagen del perfil
          style={styles.profileImage}
        />
      </View>

      {/* Beneficios */}
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
    marginLeft: 10,
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
