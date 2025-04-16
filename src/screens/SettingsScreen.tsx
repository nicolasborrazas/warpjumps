import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabaseClient'

export default function SettingsScreen() {
  const { signOut, user } = useAuth()

  const [darkMode, setDarkMode] = useState(true)
  const [boldText, setBoldText] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const loadPreferences = async () => {
      const dark = await AsyncStorage.getItem('darkMode')
      const bold = await AsyncStorage.getItem('boldText')
      if (dark !== null) setDarkMode(JSON.parse(dark))
      if (bold !== null) setBoldText(JSON.parse(bold))
    }
    loadPreferences()
  }, [])

  useEffect(() => {
    AsyncStorage.setItem('darkMode', JSON.stringify(darkMode))
    AsyncStorage.setItem('boldText', JSON.stringify(boldText))
  }, [darkMode, boldText])

  const toggleDarkMode = () => setDarkMode(prev => !prev)
  const toggleBold = () => setBoldText(prev => !prev)
  const toggleNotifications = () => setNotifications(prev => !prev)

  const confirmReset = () =>
    Alert.alert('Reset Settings', 'Are you sure you want to reset all settings?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.clear()
          setDarkMode(true)
          setBoldText(false)
          setNotifications(true)
          Alert.alert('Settings reset')
        },
      },
    ])

  const confirmDeleteWarps = () =>
    Alert.alert('Delete All Warps', 'Are you sure you want to delete all Warps?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => Alert.alert('All Warps deleted') },
    ])

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.')
      return
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.')
      return
    }

    // Reautenticación con la contraseña antigua
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })

    if (loginError) {
      Alert.alert('Error', 'Current password is incorrect.')
      return
    }

    // Actualizar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    if (updateError) {
      Alert.alert('Error', updateError.message)
    } else {
      Alert.alert('Success', 'Password updated successfully.')
      setShowPasswordModal(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingRow icon="mail-outline" label={`Email: ${user?.email}`} />
          <SettingRow icon="lock-closed-outline" label="Change Password" onPress={() => setShowPasswordModal(true)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingSwitch icon="notifications-outline" label="Notifications" value={notifications} onValueChange={toggleNotifications} />
          <SettingSwitch icon="moon-outline" label="Dark Mode" value={darkMode} onValueChange={toggleDarkMode} />
          <SettingSwitch icon="text-outline" label="Bold Text" value={boldText} onValueChange={toggleBold} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <SettingRow icon="trash-outline" label="Delete All Warps" onPress={confirmDeleteWarps} />
          <SettingRow icon="refresh-outline" label="Reset Settings" onPress={confirmReset} />
          <SettingRow icon="help-circle-outline" label="Help & FAQ" onPress={() => Alert.alert('Coming soon')} />
          <SettingRow icon="mail-outline" label="Contact Support" onPress={() => Alert.alert('Coming soon')} />
          <SettingRow icon="star-outline" label="Rate the App" onPress={() => Alert.alert('Coming soon')} />
          <SettingRow icon="document-outline" label="Terms & Privacy" onPress={() => Alert.alert('Coming soon')} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Modal: Change Password */}
      <Modal visible={showPasswordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              placeholder="Current Password"
              placeholderTextColor="#888"
              secureTextEntry
              style={styles.modalInput}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="#888"
              secureTextEntry
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)} style={styles.modalCancel}>
                <Text style={styles.buttonTextAlt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePasswordChange} style={styles.modalConfirm}>
                <Text style={styles.buttonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const SettingRow = ({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.row}>
    <Ionicons name={icon} size={20} color="#ccc" style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
)

const SettingSwitch = ({ icon, label, value, onValueChange }: {
  icon: any
  label: string
  value: boolean
  onValueChange: (val: boolean) => void
}) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={20} color="#ccc" style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scroll: { padding: 24, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24, textAlign: 'center' },
  section: { marginBottom: 30 },
  sectionTitle: { color: '#FF6B00', fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1e1e1e',
  },
  icon: { marginRight: 12 },
  label: { color: '#fff', fontSize: 16, flex: 1 },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 18, backgroundColor: '#FF6B00',
  },
  signOutText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', padding: 24,
  },
  modalContainer: {
    backgroundColor: '#2B2520', padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20, color: '#fff',
    marginBottom: 16, textAlign: 'center',
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 12, color: '#2B2520',
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 8,
  },
  modalCancel: {
    flex: 1, backgroundColor: '#F5F5F5', padding: 14,
    borderRadius: 12, marginRight: 8, alignItems: 'center',
  },
  modalConfirm: {
    flex: 1, backgroundColor: '#FF6B00', padding: 14,
    borderRadius: 12, marginLeft: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  buttonTextAlt: { color: '#FF6B00', fontWeight: 'bold' },
})
