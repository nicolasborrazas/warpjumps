<<<<<<< HEAD
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Navigation from './src/navigation/Navigation'
import { AuthProvider } from './src/context/AuthContext'
import { WarpProvider } from './src/context/WarpContext'
import { StatusBar } from 'expo-status-bar'
import * as Notifications from 'expo-notifications'

// Configurar cómo se muestran las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function App() {
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        console.warn('Permission for notifications not granted')
      }
    }

    requestPermission()
  }, [])

=======
import React from 'react'
import { StatusBar } from 'react-native'
import Navigation from './src/navigation/Navigation'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/context/AuthContext'
import { WarpProvider } from './src/context/WarpContext'

export default function App() {
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
  return (
    <AuthProvider>
      <WarpProvider>
        <NavigationContainer>
<<<<<<< HEAD
          <StatusBar style="light" backgroundColor="#2B2520" />
=======
          {/* Barra de estado del sistema (hora, señal, batería) */}
          <StatusBar barStyle="light-content" backgroundColor="#2B2520" />
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
          <Navigation />
        </NavigationContainer>
      </WarpProvider>
    </AuthProvider>
  )
}
