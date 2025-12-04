// stores/transactions.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cookieParser } from '~/lib/utils'
import CryptoJS from 'crypto-js'

export interface Transaction {
  id: string
  description: string
  amount: number
  categoryId: string
  date: string
  created_at: string
  userId?: string
}

const DEMO_TRANSACTIONS_KEY = 'fineline_demo_transactions'
const encryptionKey = 'fineline-demo-key'

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref('')
  const isDemoMode = ref(false)

  // Getters
  const getTransactionCount = computed(() => transactions.value.length)
  const getTotalBalance = computed(() =>
    transactions.value.reduce((sum, t) => sum + t.amount, 0)
  )

  // Actions
  const setDemoMode = (enabled: boolean) => {
    isDemoMode.value = enabled
    if (enabled) {
      loadDemoData()
    } else {
      transactions.value = []
    }
  }

  const loadDemoData = () => {
    if (!import.meta.client) {
      transactions.value = []
      return
    }

    loadDemoFromStorage()
  }

  const saveDemoToStorage = () => {
    if (!import.meta.client || !isDemoMode.value) return

    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(transactions.value),
        encryptionKey
      ).toString()
      localStorage.setItem(DEMO_TRANSACTIONS_KEY, encrypted)
    } catch (e) {
      console.error('Failed to encrypt demo transactions:', e)
    }
  }

  const loadDemoFromStorage = () => {
    if (!import.meta.client) return

    const encrypted = localStorage.getItem(DEMO_TRANSACTIONS_KEY)
    if (encrypted) {
      try {
        const decrypted = CryptoJS.AES.decrypt(
          encrypted,
          encryptionKey
        ).toString(CryptoJS.enc.Utf8)
        transactions.value = JSON.parse(decrypted) as Transaction[]
      } catch (e) {
        console.error('Failed to decrypt demo data:', e)
        transactions.value = []
      }
    } else {
      transactions.value = []
    }
  }

  const fetchTransactions = async () => {
    if (isDemoMode.value) {
      if (transactions.value.length === 0) {
        loadDemoFromStorage()
      }
      return
    }

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const cookies = cookieParser(document.cookie)
      const appToken = cookies['appToken']

      const response = await $fetch<{ transactions: Transaction[] }>(
        `${config.public.backendBaseUrl}/api/transactions`,
        {
          credentials: 'include',
          headers: { Authorization: `Bearer ${appToken}` },
        }
      )

      transactions.value = response?.transactions || []
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      error.value = 'Failed to load transactions'
    } finally {
      loading.value = false
    }
  }

  const refreshCategoryStats = async () => {
    const categoriesStore = useCategoriesStore()
    await categoriesStore.refreshStats()
  }

  const createTransaction = async (
    transactionData: Omit<Transaction, 'id' | 'created_at' | 'userId'>
  ) => {
    if (isDemoMode.value) {
      const newTransaction: Transaction = {
        ...transactionData,
        id: crypto.randomUUID?.() ?? `demo-${Date.now()}`,
        created_at: new Date().toISOString(),
      }
      transactions.value.push(newTransaction)
      saveDemoToStorage()
      await refreshCategoryStats()
      return
    }

    loading.value = true

    try {
      const config = useRuntimeConfig()
      const cookies = cookieParser(document.cookie)
      const appToken = cookies['appToken']

      const body = {
        description: transactionData.description,
        amount: transactionData.amount,
        categoryId: transactionData.categoryId || null,
        date: transactionData.date
      }

      await $fetch(`${config.public.backendBaseUrl}/api/transactions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${appToken}`,
          'Content-Type': 'application/json',
        },
        body: body,
      });

      await fetchTransactions()
      await refreshCategoryStats()
    } catch (err) {
      console.error('Failed to create transaction:', err)
      error.value = 'Failed to create transaction'
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (
    id: string,
    transactionData: Omit<Transaction, 'id' | 'created_at' | 'userId'>
  ) => {
    if (isDemoMode.value) {
      const index = transactions.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        const existing = transactions.value[index]
        if (existing) {
          transactions.value[index] = {
            id: existing.id,
            created_at: existing.created_at,
            userId: existing.userId,
            ...transactionData,
          }
          saveDemoToStorage()
          await refreshCategoryStats()
        }
      }
      return
    }

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const cookies = cookieParser(document.cookie)
      const appToken = cookies['appToken']

      await $fetch(
        `${config.public.backendBaseUrl}/api/transactions/${id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${appToken}`,
            'Content-Type': 'application/json',
          },
          body: transactionData,
        }
      )

      await fetchTransactions()
      await refreshCategoryStats()
    } catch (err) {
      console.error('Failed to update transaction:', err)
      error.value = 'Failed to update transaction'
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id: string) => {
    if (isDemoMode.value) {
      transactions.value = transactions.value.filter((t) => t.id !== id)
      saveDemoToStorage()
      await refreshCategoryStats()
      return
    }

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const cookies = cookieParser(document.cookie)
      const appToken = cookies['appToken']

      await $fetch(
        `${config.public.backendBaseUrl}/api/transactions/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${appToken}`,
          },
        }
      )

      await fetchTransactions()
      await refreshCategoryStats()
    } catch (err) {
      console.error('Failed to delete transaction:', err)
      error.value = 'Failed to delete transaction'
    } finally {
      loading.value = false
    }
  }

  const resetDemoData = () => {
    if (!import.meta.client) return

    localStorage.removeItem(DEMO_TRANSACTIONS_KEY)
    transactions.value = []
  }

  return {
    transactions,
    loading,
    error,
    isDemoMode,
    getTransactionCount,
    getTotalBalance,
    setDemoMode,
    loadDemoData,
    saveDemoToStorage,
    loadDemoFromStorage,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    resetDemoData,
  }
})
