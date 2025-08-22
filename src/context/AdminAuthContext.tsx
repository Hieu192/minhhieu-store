// src/app/admin/contexts/AdminAuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

interface AdminAuthContextType {
  user: AdminUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) return false
      const data = await res.json()

      const adminUser: AdminUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }

      setUser(adminUser)
      localStorage.setItem('admin_user', JSON.stringify(adminUser))

      return true
    } catch (err) {
      console.error('[Login Error]', err)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      })
    } catch (err) {
      console.error('[Logout Error]', err)
      return false
    } finally {
      setUser(null)
      localStorage.removeItem('admin_user')
      router.push('/admin/login')
      return true
    }
  }

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
