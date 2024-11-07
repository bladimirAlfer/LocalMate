import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../database/firebase';
import { useNavigation } from '@react-navigation/native';

export default function ContributeScreen() {
  const [userName, setUserName] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
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
      navigation.navigate('Home'); // Redirect to home screen after sign out
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.container}>
      {/* Header with welcome message and profile image */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Bienvenido {userName}</Text>
        <Image
          source={require('../../../assets/images/badass-ash.jpg')}
          style={styles.profileImage}
        />
      </View>

      {/* Modal for the hamburger menu */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="slide"
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalBackground}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              toggleMenu();
              navigation.navigate('ProfileScreen'); // Navigate to ProfileScreen
            }}>
              <Ionicons name="person" size={24} color="#333" />
              <Text style={styles.menuText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              toggleMenu();
              handleSignOut();
            }}>
              <Ionicons name="log-out" size={24} color="#333" />
              <Text style={styles.menuText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Benefits Section */}
      <Text style={styles.sectionTitle}>Beneficios GreatMate</Text>
      <View style={styles.benefitsList}>
        <Text style={styles.benefit}>• Vales de descuento semanales</Text>
        <Text style={styles.benefit}>• Promocionar tu negocio</Text>
        <Text style={styles.benefit}>• Mayor alcance en tus opiniones</Text>
        <Text style={styles.benefit}>• Visualización interactiva de tus movimientos</Text>
      </View>

      {/* Subscription Options */}
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
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
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
