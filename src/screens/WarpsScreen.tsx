import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useWarp } from '../context/WarpContext'
import { Ionicons } from '@expo/vector-icons'

export default function WarpsScreen() {
  const navigation = useNavigation()
  const { warps, deleteWarp } = useWarp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Warp',
      'Are you sure you want to delete this warp?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteWarp(id) },
      ]
    )
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.warpItem}>
      <Text style={styles.warpName}>{item.name}</Text>
      <Text style={styles.warpTime}>{item.time}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('CreateWarp', { warp: item })}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Warps</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 40 }} />
      ) : warps.length === 0 ? (
        <Text style={styles.emptyText}>You have no warps created, press + to create a new one</Text>
      ) : (
        <FlatList
          data={warps}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={{ marginTop: 16 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateWarp')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2520',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  warpItem: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  warpName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  warpTime: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FF6B00',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#C0392B',
    padding: 8,
    borderRadius: 8,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#FF6B00',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
})
