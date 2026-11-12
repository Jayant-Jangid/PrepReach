import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { saveTokens, clearTokens } from '@/lib/auth'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: User, accessToken: string, refreshToken?: string) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (userData, accessToken, refreshToken = '') => {
        saveTokens(accessToken, refreshToken)
        set({ user: userData, isAuthenticated: true, isLoading: false })
      },

      logout: () => {
        clearTokens()
        set({ user: null, isAuthenticated: false, isLoading: false })
      },

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'prepreach-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
