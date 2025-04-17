import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native'
import { useWarp } from '../context/WarpContext'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function WarpsScreen() {
  const { warps, fetchWarps, deleteWarp } = useWarp()
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await fetchWarps()
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = (id: string) => {
    Alert.alert('Delete Warp', 'Are you sure you want to delete this warp?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteWarp(id) },
    ])
  }

  const handleEdit = (warp: any) => {
    navigation.navigate('CreateWarp' as never, { warp } as never)
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.text}>Type: {item.type}</Text>
      <Text style={styles.text}>Time: {item.time}</Text>
      <Text style={styles.text}>Items: {item.items?.join(', ')}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Warps 🚀</Text>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Warps 🚀</Text>

      {warps.length === 0 ? (
        <Text style={styles.emptyText}>No warps created. Tap + to add one!</Text>
      ) : (
        <FlatList
          data={warps}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateWarp' as never)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2520',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 60,
  },
  card: {
    backgroundColor: '#3a332f',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  text: {
    color: '#ccc',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF6B00',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteBtn: {
    flexDirection: 'row',
    backgroundColor: '#D33C32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  fab: {
    backgroundColor: '#FF6B00',
    borderRadius: 50,
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
})
