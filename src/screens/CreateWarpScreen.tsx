import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import { useWarp } from '../context/WarpContext'
import { Ionicons, Feather } from '@expo/vector-icons'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CreateWarpScreen() {
  const [name, setName] = useState('')
  const [type, setType] = useState<'routine' | 'event'>('routine')
  const [time, setTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [items, setItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')

  const { addWarp } = useWarp()
  const navigation = useNavigation()

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
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

  const saveWarp = () => {
    if (!name || items.length === 0) {
      alert('Please complete all fields.')
      return
    }

    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    addWarp({
      name,
      type,
      time: formattedTime,
      items,
      days: type === 'routine' ? selectedDays : [],
    })

    alert('Warp saved!')
    navigation.navigate('MainTabs', { screen: 'Warps' })
  }

  return (
    <View style={styles.container}>
      {/* Botón X cerrar */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>New Warp</Text>

      <Text style={styles.label}>Warp Name</Text>
      <View style={styles.inputContainer}>
        <Feather name="edit-2" size={18} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter warp name"
          placeholderTextColor="#5C5C5C"
          value={name}
          onChangeText={setName}
        />
      </View>

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

      <Text style={styles.label}>Reminder Time</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputContainer}>
        <Ionicons name="time-outline" size={18} style={styles.icon} />
        <Text style={[styles.input, { paddingVertical: 0 }]}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || time
              setShowTimePicker(false)
              setTime(currentDate)
            }}
          />
        </View>
      )}

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

      <Text style={styles.label}>Add Item</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="add-outline" size={18} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="e.g. keys, wallet..."
          placeholderTextColor="#5C5C5C"
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={addItem}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>• {item}</Text>
        )}
        style={{ marginVertical: 16 }}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={saveWarp}>
          <Text style={styles.buttonText}>Save</Text>
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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
    color: '#5C5C5C',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2B2520',
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
  pickerWrapper: {
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
    borderRadius: 14,
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
    backgroundColor: '#F5F5F5',
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
