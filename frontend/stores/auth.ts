// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const loading = ref(false)
  const error = ref('')

  const checkAuth = async () => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const appToken = document.cookie.split('; ').find(row => row.startsWith('appToken='))?.split('=')[1] || ''
      
      const response = await $fetch(`${config.public.backendBaseUrl}/api/auth/me`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${appToken}` }
      })
      
      if (response.user) {
        user.value = response.user
      }
      return !!response.user
    } catch (err) {
      console.error('Auth check failed:', err)
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.backendBaseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      
      user.value = null
      
      if (response.endSessionUrl) {
        window.location.href = response.endSessionUrl
      } else {
        await navigateTo('/login')
      }
    } catch (err) {
      console.error('Logout error:', err)
      user.value = null
      await navigateTo('/login')
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    checkAuth,
    logout
  }
})