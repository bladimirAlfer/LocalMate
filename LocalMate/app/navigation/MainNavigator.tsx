import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import LoadingScreen from '../screens/LoadingScreen';
import PreferenciasScreen from '../screens/Onboarding/PreferenciasScreen';
import NivelSocioeconomicoScreen from '../screens/Onboarding/NivelSocioeconomicoScreen';
import FrecuenciaVisitasScreen from '../screens/Onboarding/FrecuenciaVisitasScreen';
import DispositivoScreen from '../screens/Onboarding/DispositivoScreen';
import DiaPreferidoScreen from '../screens/Onboarding/DiaPreferidoScreen';
import AppDrawer from './AppDrawer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../database/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';

// Importar las nuevas pantallas
import StoreDetailScreen from '../screens/Store/StoreDetailScreen';
import SearchScreen from '../screens/Store/SearchScreen';
import SearchResultsScreen from '../screens/Store/SearchResultsScreen';
import EntityDetailScreen from '@/screens/User/EntityDetailScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState('LoadingScreen');

  useEffect(() => {
    const checkOnboardingStatus = async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const hasCompletedOnboarding = userDoc.exists() && userDoc.data()?.hasCompletedOnboarding;

        console.log("Valor de hasCompletedOnboarding en Firebase:", hasCompletedOnboarding);
        
        // Solo establece hasCompletedOnboarding en AsyncStorage si es true
        if (hasCompletedOnboarding) {
          await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
          setInitialRoute('AppDrawer');
        } else {
          await AsyncStorage.setItem('hasCompletedOnboarding', 'false');
          setInitialRoute('PreferenciasScreen');
        }
      } else {
        setInitialRoute('Home');
      }
      setInitialRoute('AppDrawer'); // Asegúrate de establecer el valor adecuado aquí
      setLoadingAuth(false);
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      setLoadingAuth(true);
      await checkOnboardingStatus(user);
    });

    return unsubscribe;
  }, []);

  if (loadingAuth) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="PreferenciasScreen" component={PreferenciasScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NivelSocioeconomicoScreen" component={NivelSocioeconomicoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FrecuenciaVisitasScreen" component={FrecuenciaVisitasScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DispositivoScreen" component={DispositivoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DiaPreferidoScreen" component={DiaPreferidoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="EntityDetailScreen" component={EntityDetailScreen} options={{ headerShown: false }}
/>

    </Stack.Navigator>
  );
};

export default MainNavigator;
