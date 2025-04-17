// src/lib/notifications.ts
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Configuración general
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

// Solicita permisos y devuelve el token (solo por si en el futuro usamos notificaciones push)
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

// Programa una notificación local
export async function scheduleWarpNotification(time: Date, title: string) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Reminder',
      body: `Don't forget your warp: ${title}`,
    },
    trigger: {
      hour: time.getHours(),
      minute: time.getMinutes(),
      repeats: false,
    },
  })
}
