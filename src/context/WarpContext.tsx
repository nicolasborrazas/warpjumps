import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

type Warp = {
  id: string
  name: string
  type: 'routine' | 'event'
  time: string
  items: string[]
  days?: string[]
}

type WarpContextType = {
  warps: Warp[]
  addWarp: (warp: Omit<Warp, 'id'>) => void
  updateWarp: (id: string, warp: Omit<Warp, 'id'>) => void
  deleteWarp: (id: string) => void
}

const WarpContext = createContext<WarpContextType | undefined>(undefined)

export const WarpProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth()
  const [warps, setWarps] = useState<Warp[]>([])

  useEffect(() => {
    if (session?.user.id) {
      fetchWarps()
    }
  }, [session])

  const fetchWarps = async () => {
    const { data, error } = await supabase
      .from('warps')
      .select('*')
      .eq('user_id', session?.user.id)

    if (!error && data) {
      setWarps(data)
    }
  }

  const addWarp = async (warp: Omit<Warp, 'id'>) => {
    const warpWithUser = { ...warp, user_id: session?.user.id }
    const { data, error } = await supabase.from('warps').insert(warpWithUser).select()
    if (!error && data && data[0]) {
      setWarps(prev => [...prev, data[0]])
    }
  }

  const updateWarp = async (id: string, updatedWarp: Omit<Warp, 'id'>) => {
    const { data, error } = await supabase
      .from('warps')
      .update(updatedWarp)
      .eq('id', id)
      .select()

    if (!error && data && data[0]) {
      setWarps(prev =>
        prev.map(w => (w.id === id ? { ...data[0] } : w))
      )
    }
  }

  const deleteWarp = async (id: string) => {
    const { error } = await supabase.from('warps').delete().eq('id', id)
    if (!error) {
      setWarps(prev => prev.filter(w => w.id !== id))
    }
  }

  return (
    <WarpContext.Provider value={{ warps, addWarp, updateWarp, deleteWarp }}>
      {children}
    </WarpContext.Provider>
  )
}

export const useWarp = () => {
  const context = useContext(WarpContext)
  if (!context) throw new Error('useWarp must be used within WarpProvider')
  return context
}
