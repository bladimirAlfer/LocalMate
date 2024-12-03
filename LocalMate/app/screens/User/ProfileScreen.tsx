import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../database/firebase';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
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

      {/* Resto del contenido */}
      <Text style={styles.sectionTitle}>Preferencia: Ropa</Text>
      <Text style={styles.subTitle}>Planes ofrecidos</Text>
      
      {/* Opciones */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SavedScreen')}>
          <Ionicons name="bookmark" size={24} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.optionText}>Recomendaciones hechas</Text>
            <Text style={styles.optionDescription}>Tu lista de recomendaciones guardadas</Text>
          </View>
        </TouchableOpacity>
        
        {/* Otros botones */}
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
