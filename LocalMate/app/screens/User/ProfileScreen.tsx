import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../database/firebase';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
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
      navigation.navigate('Home'); // Redirect to home screen
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
              navigation.navigate('ProfileScreen'); // Ensure route name matches navigation stack
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

      {/* Rest of the content */}
      <Text style={styles.sectionTitle}>Preferencia: Ropa</Text>
      <Text style={styles.subTitle}>Planes ofrecidos</Text>
      
      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SavedScreen')}>
          <Ionicons name="bookmark" size={24} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.optionText}>Recomendaciones hechas</Text>
            <Text style={styles.optionDescription}>Tu lista de recomendaciones guardadas</Text>
          </View>
        </TouchableOpacity>
        
        {/* Other buttons */}
        <TouchableOpacity style={styles.option}>
          <Ionicons name="settings" size={24} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.optionText}>Configuración</Text>
            <Text style={styles.optionDescription}>Ajustes dentro de la app</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.option}>
          <Ionicons name="chatbubbles" size={24} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.optionText}>Ayuda y feedback</Text>
            <Text style={styles.optionDescription}>Nos importa tu opinión o mejoras</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.option} onPress={handleSignOut}>
          <Ionicons name="power" size={24} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.optionText}>Apagar Localmate</Text>
            <Text style={styles.optionDescription}>Cerrar sesión o cerrar cuenta</Text>
          </View>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: '#71727a',
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionDescription: {
    fontSize: 12,
    color: '#71727a',
  },
});
