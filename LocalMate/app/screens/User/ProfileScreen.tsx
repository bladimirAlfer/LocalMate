import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../database/firebase';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Obtén el nombre de usuario (antes del @ en el correo)
    const email = auth.currentUser?.email;
    if (email) {
      const name = email.split('@')[0];
      setUsername(name);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Bienvenido {username}</Text>
        <Image
          source={require('../../../assets/images/badass-ash.jpg')}
          style={styles.profileImage}
        />
      </View>

      {/* Sección de Preferencia y Opciones */}
      <Text style={styles.sectionTitle}>Preferencia: Ropa</Text>
      <Text style={styles.subTitle}>Planes ofrecidos</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="bookmark" size={24} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.optionText}>Recomendaciones hechas</Text>
            <Text style={styles.optionDescription}>Tu lista de recomendaciones guardadas</Text>
          </View>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.option}>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
