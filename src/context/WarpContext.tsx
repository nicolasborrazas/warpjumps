<<<<<<< HEAD
// src/context/WarpContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

export interface Warp {
  id?: string
=======
import React, { createContext, useContext, useState } from 'react'

export interface Warp {
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
  name: string
  type: 'routine' | 'event'
  time: string
  items: string[]
<<<<<<< HEAD
  days?: string[]
  created_at?: string
  user_id?: string
=======
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
}

interface WarpContextType {
  warps: Warp[]
<<<<<<< HEAD
  addWarp: (warp: Warp) => Promise<void>
  deleteWarp: (id: string) => Promise<void>
  updateWarp: (id: string, updatedData: Partial<Warp>) => Promise<void>
  fetchWarps: () => Promise<void>
=======
  addWarp: (warp: Warp) => void
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
}

const WarpContext = createContext<WarpContextType | undefined>(undefined)

export const WarpProvider = ({ children }: { children: React.ReactNode }) => {
  const [warps, setWarps] = useState<Warp[]>([])
<<<<<<< HEAD
  const { user } = useAuth()

  const fetchWarps = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('warps')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading warps:', error.message)
    } else {
      setWarps(data || [])
    }
  }

  const addWarp = async (warp: Warp) => {
    if (!user) return

    const { data, error } = await supabase.from('warps').insert([
      {
        ...warp,
        user_id: user.id,
      },
    ])

    if (error) {
      console.error('Error saving warp:', error.message)
    } else {
      fetchWarps()
    }
  }

  const deleteWarp = async (id: string) => {
    const { error } = await supabase.from('warps').delete().eq('id', id)
    if (error) {
      console.error('Error deleting warp:', error.message)
    } else {
      setWarps(prev => prev.filter(w => w.id !== id))
    }
  }

  const updateWarp = async (id: string, updatedData: Partial<Warp>) => {
    const { error } = await supabase
      .from('warps')
      .update(updatedData)
      .eq('id', id)

    if (error) {
      console.error('Error updating warp:', error.message)
    } else {
      fetchWarps()
    }
  }

  useEffect(() => {
    if (user) {
      fetchWarps()
    }
  }, [user])

  return (
    <WarpContext.Provider value={{ warps, addWarp, deleteWarp, updateWarp, fetchWarps }}>
=======

  const addWarp = (warp: Warp) => {
    setWarps((prev) => [...prev, warp])
  }

  return (
    <WarpContext.Provider value={{ warps, addWarp }}>
>>>>>>> 1757a3a643b8a8946c996fd7cb8092b6d19f89be
      {children}
    </WarpContext.Provider>
  )
}

export const useWarp = () => {
  const context = useContext(WarpContext)
  if (!context) throw new Error('useWarp must be used within WarpProvider')
  return context
}
