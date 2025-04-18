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

  return (
    <AuthProvider>
      <WarpProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#2B2520" />
          <Navigation />
        </NavigationContainer>
      </WarpProvider>
    </AuthProvider>
  )
}
