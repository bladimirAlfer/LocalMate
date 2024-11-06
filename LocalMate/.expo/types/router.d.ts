/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/_sitemap` | `/data/storesData` | `/database/firebase` | `/navigation/AppTabNavigator` | `/navigation/MainNavigator` | `/screens/Auth/LoginScreen` | `/screens/Auth/RegisterScreen` | `/screens/Home/HomeScreen` | `/screens/Home/ProfileScreen` | `/screens/LoadingScreen` | `/screens/Onboarding/DiaPreferidoScreen` | `/screens/Onboarding/DispositivoScreen` | `/screens/Onboarding/FrecuenciaVisitasScreen` | `/screens/Onboarding/NivelSocioeconomicoScreen` | `/screens/Onboarding/PreferenciasScreen` | `/screens/User/ContributeScreen` | `/screens/User/HomeUserScreen` | `/screens/User/ProfileScreen` | `/screens/User/SavedScreen`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
