// src/context/WarpContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

export interface Warp {
  id?: string
  name: string
  type: 'routine' | 'event'
  time: string
  items: string[]
  days?: string[]
  created_at?: string
  user_id?: string
}

interface WarpContextType {
  warps: Warp[]
  addWarp: (warp: Warp) => Promise<void>
  deleteWarp: (id: string) => Promise<void>
  updateWarp: (id: string, updatedData: Partial<Warp>) => Promise<void>
  fetchWarps: () => Promise<void>
}

const WarpContext = createContext<WarpContextType | undefined>(undefined)

export const WarpProvider = ({ children }: { children: React.ReactNode }) => {
  const [warps, setWarps] = useState<Warp[]>([])
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
      {children}
    </WarpContext.Provider>
  )
}

export const useWarp = () => {
  const context = useContext(WarpContext)
  if (!context) throw new Error('useWarp must be used within WarpProvider')
  return context
}
