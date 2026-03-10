import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from './src/screens/HomeScreen';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { GameDetailScreen } from './src/screens/GameDetailScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { CertificatesScreen } from './src/screens/CertificatesScreen';
import { ContactScreen } from './src/screens/ContactScreen';
import { AdminScreen } from './src/screens/AdminScreen';
import { AuthProvider } from './src/context/AuthContext';
import { db } from './src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={40}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.iconFocused : null}>
              <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.iconFocused : null}>
              <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Certificates"
        component={CertificatesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.iconFocused : null}>
              <Ionicons name={focused ? 'ribbon' : 'ribbon-outline'} color={color} size={size} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.iconFocused : null}>
              <Ionicons name={focused ? 'mail' : 'mail-outline'} color={color} size={size} />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}

// Senin admin Google email adresin — bunu kendi emailinle değiştir
const ADMIN_EMAIL = 'semihgul258@gmail.com';

export default function App() {
  useEffect(() => {
    const recordVisit = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        if (data.ip) {
          const docRef = await addDoc(collection(db, 'visitors'), {
            ip: data.ip,
            platform: Platform.OS,
            timestamp: serverTimestamp(),
            userAgent: Platform.OS === 'web' ? navigator.userAgent : 'Mobile App'
          });
        }
      } catch (error) {
      }
    };

    recordVisit();
  }, []);

  return (
    <AuthProvider adminEmail={ADMIN_EMAIL}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Projects" component={ProjectsScreen} />
            <Stack.Screen name="GameDetail" component={GameDetailScreen} />
            <Stack.Screen name="Admin" component={AdminScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
    height: Platform.OS === 'ios' ? 85 : 65,
  },
  iconFocused: Platform.select({
    web: {
      filter: `drop-shadow(0 0 5px ${colors.primary}) drop-shadow(0 0 10px ${colors.primary})`,
    },
    default: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 2,
    },
  }) as any
});
