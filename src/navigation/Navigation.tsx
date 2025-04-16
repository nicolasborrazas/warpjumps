import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import MainTabs from './MainTabs'
import CreateWarpScreen from '../screens/CreateWarpScreen'
import { useAuth } from '../context/AuthContext'

const Stack = createNativeStackNavigator()

export default function Navigation() {
  const { user } = useAuth()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="CreateWarp" component={CreateWarpScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}
