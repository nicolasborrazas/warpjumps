import * as Notifications from 'expo-notifications'

export async function scheduleWarpNotification(warpName: string, time: string, items: string[]) {
  const [hourStr, minuteStr] = time.split(':')
  const now = new Date()

  const triggerDate = new Date()
  triggerDate.setHours(parseInt(hourStr, 10))
  triggerDate.setMinutes(parseInt(minuteStr, 10))
  triggerDate.setSeconds(0)

  // Si la hora ya pasó hoy, programa para mañana
  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1)
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🚀 Warp Reminder: ${warpName}`,
      body: `Don't forget: ${items.join(', ')}`,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: triggerDate,
  })
}
