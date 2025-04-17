<<<<<<< HEAD
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
=======
import React from 'react'
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useWarp } from '../context/WarpContext'
import { Ionicons } from '@expo/vector-icons'

export default function WarpsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const { warps } = useWarp()
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Warps 🚀</Text>

<<<<<<< HEAD
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
=======
      {warps.length === 0 && (
        <Text style={styles.empty}>No warps created yet.</Text>
      )}

      <FlatList
        data={warps}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>Type: {item.type}</Text>
            <Text style={styles.cardText}>Time: {item.time}</Text>
            <Text style={styles.cardText}>Items: {item.items.join(', ')}</Text>
          </View>
        )}
        style={{ marginVertical: 16 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateWarp')}
      >
        <Ionicons name="add" size={28} color="white" />
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#2B2520',
    padding: 20,
=======
    backgroundColor: '#121212',
    padding: 24,
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
<<<<<<< HEAD
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
=======
    textAlign: 'center',
    marginBottom: 16,
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardText: {
    color: '#bbb',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FF6B00',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
  },
})
