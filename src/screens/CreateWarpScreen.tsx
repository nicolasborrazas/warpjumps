import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Platform, Alert
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useWarp } from '../context/WarpContext'
import { Ionicons, Feather } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEKDAY_MAP = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
}

export default function CreateWarpScreen() {
  const route = useRoute()
  const editingWarp = route.params?.warp

  const [name, setName] = useState(editingWarp?.name || '')
  const [type, setType] = useState<'routine' | 'event'>(editingWarp?.type || 'routine')

  const [time, setTime] = useState(() => {
    if (editingWarp?.time) {
      const [hours, minutes] = editingWarp.time.split(':').map(Number)
      const date = new Date()
      date.setHours(hours, minutes, 0, 0)
      return date
    }
    return new Date()
  })

  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(editingWarp?.days || [])
  const [items, setItems] = useState<string[]>(editingWarp?.items || [])
  const [newItem, setNewItem] = useState('')

  const { addWarp, updateWarp, deleteWarp } = useWarp()
  const navigation = useNavigation()

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()])
      setNewItem('')
    }
  }

  const clearForm = () => {
    setName('')
    setType('routine')
    setTime(new Date())
    setSelectedDays([])
    setItems([])
    setNewItem('')
  }

  const scheduleRoutineNotifications = async (warpName: string, days: string[], time: Date) => {
    const hour = time.getHours()
    const minute = time.getMinutes()

    for (const day of days) {
      const weekday = WEEKDAY_MAP[day]
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${warpName}`,
          body: `Don't forget your warp items.`,
        },
        trigger: {
          weekday,
          hour,
          minute,
          repeats: true,
        },
      })
    }
  }

  const scheduleEventNotification = async (warpName: string, time: Date) => {
    const now = new Date()
    const eventTime = new Date(time)

    if (eventTime < now) {
      eventTime.setDate(eventTime.getDate() + 1)
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ ${warpName}`,
        body: `Don't forget your warp items.`,
      },
      trigger: {
        hour: eventTime.getHours(),
        minute: eventTime.getMinutes(),
        repeats: false,
      },
    })
  }

  const saveOrUpdateWarp = async () => {
    if (!name || items.length === 0) {
      Alert.alert('Please complete all fields.')
      return
    }

    const formattedTime = time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const warpData = {
      name,
      type,
      time: formattedTime,
      items,
      days: type === 'routine' ? selectedDays : [],
    }

    if (editingWarp) {
      updateWarp(editingWarp.id, warpData)
    } else {
      addWarp(warpData)

      if (type === 'routine') {
        await scheduleRoutineNotifications(name, selectedDays, time)
      } else {
        await scheduleEventNotification(name, time)
      }
    }

    navigation.goBack()
  }

  const handleClose = () => {
    Alert.alert(
      'Discard changes?',
      'Do you want to discard changes or delete this warp?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: editingWarp ? 'Delete' : 'Discard',
          style: 'destructive',
          onPress: () => {
            if (editingWarp) deleteWarp(editingWarp.id)
            navigation.goBack()
          },
        },
        { text: 'Keep editing', style: 'default' },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{editingWarp ? 'Edit Warp' : 'New Warp'}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Warp Name */}
      <Text style={styles.label}>Warp Name</Text>
      <View style={styles.inputContainer}>
        <Feather name="edit-2" size={18} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter warp name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Type */}
      <Text style={styles.label}>Type</Text>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setType('routine')}
          style={[styles.switch, type === 'routine' && styles.switchSelected]}
        >
          <Text style={styles.switchText}>Routine</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType('event')}
          style={[styles.switch, type === 'event' && styles.switchSelected]}
        >
          <Text style={styles.switchText}>Event</Text>
        </TouchableOpacity>
      </View>

      {/* Reminder Time */}
      <Text style={styles.label}>Reminder Time</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputContainer}>
        <Ionicons name="time-outline" size={18} color="#444" style={styles.icon} />
        <Text style={[styles.input, { paddingVertical: 0 }]}>
          {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || time
            setShowTimePicker(false)
            setTime(currentDate)
          }}
          themeVariant="dark"
        />
      )}

      {/* Repeat days */}
      {type === 'routine' && (
        <>
          <Text style={styles.label}>Repeat on</Text>
          <View style={styles.daysContainer}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayBox,
                  selectedDays.includes(day) && styles.daySelected
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text style={{ color: selectedDays.includes(day) ? '#000' : '#fff' }}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Add Item */}
      <Text style={styles.label}>Add Item</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="add-outline" size={18} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="e.g. keys, wallet..."
          placeholderTextColor="#888"
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={addItem}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>}
        style={{ marginVertical: 16 }}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={saveOrUpdateWarp}>
          <Text style={styles.buttonText}>{editingWarp ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={clearForm}>
          <Text style={styles.buttonTextAlt}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2520',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -10,
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    padding: 8,
  },
  label: {
    color: '#fff',
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  switch: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#444',
    marginHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
  },
  switchSelected: {
    backgroundColor: '#FF6B00',
  },
  switchText: {
    color: '#fff',
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dayBox: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  daySelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  item: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextAlt: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
