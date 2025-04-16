import React from 'react'
import { StatusBar } from 'react-native'
import Navigation from './src/navigation/Navigation'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/context/AuthContext'
import { WarpProvider } from './src/context/WarpContext'

export default function App() {
  return (
    <AuthProvider>
      <WarpProvider>
        <NavigationContainer>
          {/* Barra de estado del sistema (hora, señal, batería) */}
          <StatusBar barStyle="light-content" backgroundColor="#2B2520" />
          <Navigation />
        </NavigationContainer>
      </WarpProvider>
    </AuthProvider>
  )
}
