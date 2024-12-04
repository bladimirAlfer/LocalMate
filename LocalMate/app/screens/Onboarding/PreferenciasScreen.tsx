import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DropdownSelect from '../../../components/Onboarding/DropdownSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PreferenciasScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [district, setDistrict] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const districtOptions = [
    // Alto nivel socioeconómico
    { label: 'San Isidro', value: 'San Isidro' },
    { label: 'Miraflores', value: 'Miraflores' },
    { label: 'La Molina', value: 'La Molina' },
    { label: 'San Borja', value: 'San Borja' },
    { label: 'Surco', value: 'Surco' },

    // Medio nivel socioeconómico
    { label: 'Jesús María', value: 'Jesús María' },
    { label: 'Lince', value: 'Lince' },
    { label: 'Magdalena', value: 'Magdalena' },
    { label: 'Pueblo Libre', value: 'Pueblo Libre' },
    { label: 'San Miguel', value: 'San Miguel' },
    // Bajo nivel socioeconómico
    { label: 'Comas', value: 'Comas' },
    { label: 'San Juan de Lurigancho', value: 'San Juan de Lurigancho' },
    { label: 'Villa María del Triunfo', value: 'Villa María del Triunfo' },
    { label: 'Rímac', value: 'Rímac' },
    { label: 'Ventanilla', value: 'Ventanilla' },
    { label: 'Carabayllo', value: 'Carabayllo' },
    { label: 'Puente Piedra', value: 'Puente Piedra' },
  ];

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const determineSocioeconomicLevel = (district: string) => {
    if (['San Isidro', 'Miraflores', 'La Molina', 'San Borja', 'Surco'].includes(district)) {
      return 'Alto';
    } else if (
      ['Comas', 'San Juan de Lurigancho', 'Villa María del Triunfo', 'Rímac', 'Ventanilla', 'Carabayllo', 'Puente Piedra'].includes(district)
    ) {
      return 'Bajo';
    }
    return 'Medio';
  };

  const determineZone = (district: string) => {
    if (['San Isidro', 'Miraflores', 'La Molina', 'San Borja', 'Surco'].includes(district)) {
      return 'Centro';
    } else if (['Comas', 'San Juan de Lurigancho', 'Carabayllo', 'Puente Piedra'].includes(district)) {
      return 'Norte';
    } else if (['Villa María del Triunfo', 'Ventanilla', 'Rímac'].includes(district)) {
      return 'Sur';
    }
    return 'Oeste';
  };

  const handleContinue = async () => {
    if (!firstName || !lastName || !day || !month || !year || !gender || !district) {
      Alert.alert('Por favor, completa todos los campos.');
      return;
    }

    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const age = calculateAge(birthDate);
    const socioeconomicLevel = determineSocioeconomicLevel(district);
    const zone = determineZone(district);

    try {
      // Guarda los datos temporalmente en AsyncStorage
      await AsyncStorage.setItem(
        'onboardingData',
        JSON.stringify({
          firstName,
          lastName,
          birthDate,
          age,
          gender,
          district,
          socioeconomicLevel,
          zone,
        })
      );

      navigation.navigate('InformationScreen'); // Navega a la siguiente pantalla
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos.');
      console.error(error);
    }
  };

  useEffect(() => {
    setIsComplete(firstName && lastName && day && month && year && gender && district);
  }, [firstName, lastName, day, month, year, gender, district]);

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        {[...Array(2)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              index === 0 ? styles.progressBarActive : styles.progressBarInactive,
            ]}
          />
        ))}
      </View>

      {/* Título y descripción */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Tell us more about yourself</Text>
        <Text style={styles.description}>
          Please enter your name, birth date, gender, and district to complete your profile.
        </Text>
      </View>

      {/* Campos de entrada */}
      <Text style={styles.inputLabel}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.inputLabel}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your last name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.inputLabel}>Date of Birth</Text>
      <View style={styles.birthDateContainer}>
        <TextInput
          style={[styles.input, styles.birthDateInput]}
          placeholder="DD"
          keyboardType="numeric"
          maxLength={2}
          value={day}
          onChangeText={setDay}
          placeholderTextColor="#aaa"
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          style={[styles.input, styles.birthDateInput]}
          placeholder="MM"
          keyboardType="numeric"
          maxLength={2}
          value={month}
          onChangeText={setMonth}
          placeholderTextColor="#aaa"
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          style={[styles.input, styles.birthDateInput]}
          placeholder="YYYY"
          keyboardType="numeric"
          maxLength={4}
          value={year}
          onChangeText={setYear}
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.inputLabel}>Gender</Text>
      <DropdownSelect items={genderOptions} value={gender} setValue={setGender} />

      <Text style={styles.inputLabel}>District</Text>
      <DropdownSelect items={districtOptions} value={district} setValue={setDistrict} />

      {/* Botón continuar */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          isComplete ? styles.continueButtonActive : styles.continueButtonInactive,
        ]}
        onPress={handleContinue}
        disabled={!isComplete}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: 20,
    height: 5,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  progressBarActive: {
    backgroundColor: '#007B5D',
  },
  progressBarInactive: {
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E7EAEB',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    color: '#333333',
  },
  birthDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  birthDateInput: {
    flex: 1,
    textAlign: 'center',
  },
  separator: {
    marginHorizontal: 5,
    fontSize: 18,
    color: '#333',
  },
  continueButton: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonActive: {
    backgroundColor: '#007B5D',
  },
  continueButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
