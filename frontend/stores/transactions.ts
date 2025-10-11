// stores/transactions.ts
import { defineStore } from 'pinia';
import CryptoJS from 'crypto-js';

export interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  created_at: string
  userId?: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref('')
  const isDemoMode = ref(false)

  // Demo data for testing - starting with empty array
  const demoTransactions: Transaction[] = []

  const encryptionKey = 'fineline-demo-key'

  // Toggle demo mode
  const setDemoMode = (enabled: boolean) => {
    isDemoMode.value = enabled
    if (enabled) {
      loadDemoData()
    } else {
      transactions.value = []
    }
  }

  // Load demo data
  const loadDemoData = () => {
    // Start with empty transactions array
    transactions.value = []
    // Clear any existing demo data from localStorage
    localStorage.removeItem('demo-transactions')
  }

  // Encrypt and save to localStorage
  const saveDemoToStorage = () => {
    if (isDemoMode.value) {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(transactions.value), encryptionKey).toString()
      localStorage.setItem('demo-transactions', encrypted)
    }
  }

  // Load and decrypt from localStorage
  const loadDemoFromStorage = () => {
    const encrypted = localStorage.getItem('demo-transactions')
    if (encrypted) {
      try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, encryptionKey).toString(CryptoJS.enc.Utf8)
        transactions.value = JSON.parse(decrypted)
      } catch (e) {
        console.error('Failed to decrypt demo data')
        loadDemoData()
      }
    } else {
      loadDemoData()
    }
  }

  // Fetch real transactions from API
  const fetchTransactions = async () => {
    if (isDemoMode.value) {
      loadDemoFromStorage()
      return
    }

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const appToken = document.cookie.split('; ').find(row => row.startsWith('appToken='))?.split('=')[1] || ''
      
      const response = await $fetch(`${config.public.backendBaseUrl}/api/transactions`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${appToken}` }
      }) as any

      transactions.value = response.transactions || []
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      error.value = 'Failed to load transactions'
    } finally {
      loading.value = false
    }
  }

  // Create transaction
  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'userId'>) => {
    if (isDemoMode.value) {
      const newTransaction: Transaction = {
        ...transactionData,
        id: `demo-${Date.now()}`,
        created_at: new Date().toISOString()
      }
      transactions.value.push(newTransaction)
      saveDemoToStorage()
      return
    }

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const appToken = document.cookie.split('; ').find(row => row.startsWith('appToken='))?.split('=')[1] || ''
      
      await $fetch(`${config.public.backendBaseUrl}/api/transactions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${appToken}`,
          'Content-Type': 'application/json'
        },
        body: transactionData
      })

      await fetchTransactions()
    } catch (err) {
      console.error('Failed to create transaction:', err)
      error.value = 'Failed to create transaction'
    } finally {
      loading.value = false
    }
  }

  // Update transaction
  const updateTransaction = async (id: string, transactionData: Omit<Transaction, 'id' | 'created_at' | 'userId'>) => {
    if (isDemoMode.value) {
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) {
        const existing = transactions.value[index]
        transactions.value[index] = {
          id: existing.id,
          created_at: existing.created_at,
          userId: existing.userId,
          ...transactionData
        }
        saveDemoToStorage()
      }
      return
    }

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const appToken = document.cookie.split('; ').find(row => row.startsWith('appToken='))?.split('=')[1] || ''
      
      await $fetch(`${config.public.backendBaseUrl}/api/transactions/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${appToken}`,
          'Content-Type': 'application/json'
        },
        body: transactionData
      })

      await fetchTransactions()
    } catch (err) {
      console.error('Failed to update transaction:', err)
      error.value = 'Failed to update transaction'
    } finally {
      loading.value = false
    }
  }

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    if (isDemoMode.value) {
      transactions.value = transactions.value.filter(t => t.id !== id)
      saveDemoToStorage()
      return
    }

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const appToken = document.cookie.split('; ').find(row => row.startsWith('appToken='))?.split('=')[1] || ''
      
      await $fetch(`${config.public.backendBaseUrl}/api/transactions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${appToken}`
        }
      })

      await fetchTransactions()
    } catch (err) {
      console.error('Failed to delete transaction:', err)
      error.value = 'Failed to delete transaction'
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    error,
    isDemoMode,
    setDemoMode,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadDemoData
  }
})