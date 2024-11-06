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
import AppTabNavigator from './AppTabNavigator';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../database/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home');

  useEffect(() => {
    const checkOnboardingStatus = async (user) => {
      if (user) {
        let hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        if (!hasCompletedOnboarding) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          hasCompletedOnboarding = userDoc.exists() && userDoc.data()?.hasCompletedOnboarding ? 'true' : 'false';
          await AsyncStorage.setItem('hasCompletedOnboarding', hasCompletedOnboarding);
        }
        setInitialRoute(hasCompletedOnboarding === 'true' ? 'MainTabs' : 'PreferenciasScreen');
      } else {
        setInitialRoute('Home');
      }
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
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="PreferenciasScreen" component={PreferenciasScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NivelSocioeconomicoScreen" component={NivelSocioeconomicoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FrecuenciaVisitasScreen" component={FrecuenciaVisitasScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DispositivoScreen" component={DispositivoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DiaPreferidoScreen" component={DiaPreferidoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={AppTabNavigator} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
