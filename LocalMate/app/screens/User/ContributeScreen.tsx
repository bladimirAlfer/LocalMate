import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ContributeScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header con el botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Título de la página */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Escoge tu plan de beneficios</Text>
        <Text style={styles.subtitle}>Y opten una prueba gratis de 7 dias</Text>
      </View>

      {/* Opciones de suscripción */}
      <View style={styles.planContainer}>
        {/* Plan anual */}
        <TouchableOpacity
          style={[styles.planBox, selectedPlan === 'Anual' && styles.activePlanBox]}
          onPress={() => handlePlanSelection('Anual')}
        >
          <View style={styles.planDetails}>
            <View style={selectedPlan === 'Anual' ? styles.planCircleActive : styles.planCircle}>
              {selectedPlan === 'Anual' && <View style={styles.planInnerCircle} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>GreatMate Emprendedores</Text>
            </View>
            <View style={styles.planPrice}>
              <Text style={styles.price}>$ 49.90</Text>
              <Text style={styles.priceDetails}>cada mes</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Plan mensual */}
        <TouchableOpacity
          style={[styles.planBox, selectedPlan === 'Mensual' && styles.activePlanBox]}
          onPress={() => handlePlanSelection('Mensual')}
        >
          <View style={styles.planDetails}>
            <View style={selectedPlan === 'Mensual' ? styles.planCircleActive : styles.planCircle}>
              {selectedPlan === 'Mensual' && <View style={styles.planInnerCircle} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>GreatMate Usuarios</Text>
            </View>
            <View style={styles.planPrice}>
              <Text style={styles.price}>$ 6.90</Text>
              <Text style={styles.priceDetails}>cada mes</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Plan semanal */}
        <TouchableOpacity
          style={[styles.planBox, selectedPlan === 'Semanal' && styles.activePlanBox]}
          onPress={() => handlePlanSelection('Semanal')}
        >
          <View style={styles.planDetails}>
            <View style={selectedPlan === 'Semanal' ? styles.planCircleActive : styles.planCircle}>
              {selectedPlan === 'Semanal' && <View style={styles.planInnerCircle} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Semanal</Text>
            </View>
            <View style={styles.planPrice}>
              <Text style={styles.price}>$ 1.90</Text>
              <Text style={styles.priceDetails}>cada semana</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Beneficios */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Podras obtener:</Text>
        <Text style={styles.benefit}>• Mejor visualización de tu local</Text>
        <Text style={styles.benefit}>• Reporte de interacciones</Text>
        <Text style={styles.benefit}>• Mayor alcance de usuarios</Text>
        <Text style={styles.benefit}></Text>
        <Text style={styles.benefit}>• Cupones cerca de ti</Text>
        <Text style={styles.benefit}>• Descuentos en eventos</Text>
      </View>

      {/* Botón de suscripción */}
      <TouchableOpacity style={styles.subscribeButton}>
        <Text style={styles.subscribeText}>Suscribete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuButton: {
    padding: 10,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2024',
    letterSpacing: 0.24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71727A',
    lineHeight: 20,
  },
  planContainer: {
    gap: 12,
    marginBottom: 32,
  },
  planBox: {
    height: 67,
    padding: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#D4D6DD',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  activePlanBox: {
    backgroundColor: '#EAF2FF',
  },
  planDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planCircle: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#C5C6CC',
  },
  planCircleActive: {
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#006FFD',
    backgroundColor: '#006FFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planInnerCircle: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'white',
  },
  planInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2024',
  },
  planDiscount: {
    fontSize: 10,
    color: '#006FFD',
    lineHeight: 14,
    letterSpacing: 0.15,
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2024',
  },
  priceDetails: {
    fontSize: 10,
    fontWeight: '400',
    color: '#1F2024',
    lineHeight: 14,
    letterSpacing: 0.15,
  },
  benefitsContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#F8F9FE',
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2024',
    letterSpacing: 0.08,
    marginBottom: 16,
  },
  benefit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#71727A',
    lineHeight: 16,
    letterSpacing: 0.12,
  },
  subscribeButton: {
    height: 48,
    backgroundColor: '#006FFD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});

