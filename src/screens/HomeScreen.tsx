// src/screens/HomeScreen.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useWarp } from '../context/WarpContext'

export default function HomeScreen() {
  const navigation = useNavigation()
  const { warps } = useWarp()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const nextWarps = warps.slice(0, 2)

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting()} 👋</Text>
      <Text style={styles.subtext}>Welcome back to Warp Jumps</Text>

      {/* Next Warps */}
      <Text style={styles.sectionTitle}>Next Warps</Text>
      {nextWarps.length === 0 ? (
        <Text style={styles.emptyText}>You have no upcoming warps.</Text>
      ) : (
        <FlatList
          data={nextWarps}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardInfo}>🕒 {item.time}</Text>
              <Text style={styles.cardInfo}>📦 {item.items.join(', ')}</Text>
            </View>
          )}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CreateWarp')}>
          <Ionicons name="add-circle-outline" size={26} color="#FF6B00" />
          <Text style={styles.actionText}>New Warp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Warps')}>
          <Ionicons name="list-outline" size={26} color="#FF6B00" />
          <Text style={styles.actionText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <Text style={styles.sectionTitle}>Stats</Text>
      <View style={styles.statsBox}>
        <Text style={styles.statsText}>Total Warps: {warps.length}</Text>
        <Text style={styles.statsText}>Routines: {warps.filter(w => w.type === 'routine').length}</Text>
        <Text style={styles.statsText}>Events: {warps.filter(w => w.type === 'event').length}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2520',
    padding: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardInfo: {
    color: '#ccc',
    marginTop: 4,
    fontSize: 14,
  },
  emptyText: {
    color: '#888',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  statsBox: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
  },
  statsText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
})
