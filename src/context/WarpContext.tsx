import React, { createContext, useContext, useState } from 'react'

export interface Warp {
  name: string
  type: 'routine' | 'event'
  time: string
  items: string[]
}

interface WarpContextType {
  warps: Warp[]
  addWarp: (warp: Warp) => void
}

const WarpContext = createContext<WarpContextType | undefined>(undefined)

export const WarpProvider = ({ children }: { children: React.ReactNode }) => {
  const [warps, setWarps] = useState<Warp[]>([])

  const addWarp = (warp: Warp) => {
    setWarps((prev) => [...prev, warp])
  }

  return (
    <WarpContext.Provider value={{ warps, addWarp }}>
      {children}
    </WarpContext.Provider>
  )
}

export const useWarp = () => {
  const context = useContext(WarpContext)
  if (!context) throw new Error('useWarp must be used within WarpProvider')
  return context
}
