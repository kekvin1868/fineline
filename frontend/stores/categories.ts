// stores/categories.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FlowType, FlowTypeUtils, type FlowTypeValues } from '~/lib/Enums/FlowType'

export interface Category {
  id: string
  name: string
  flow: FlowTypeValues
  isArchived?: boolean
  userId?: string
  createdAt?: string
  updatedAt?: string
  transactionCount?: number
  totalAmount?: number
}

const DEMO_CATEGORIES_KEY = 'fineline_demo_categories'
const DEMO_ARCHIVED_CATEGORIES_KEY = 'fineline_demo_archived_categories'

// Default categories to seed on first load
const DEFAULT_CATEGORIES: Category[] = [
  // EXPENSE
  { id: '1', name: 'Transport', flow: FlowType.EXPENSE, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '2', name: 'Health', flow: FlowType.EXPENSE, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '3', name: 'Food', flow: FlowType.EXPENSE, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '4', name: 'Leisure', flow: FlowType.EXPENSE, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '5', name: 'Gifts', flow: FlowType.EXPENSE, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },

  // INCOME
  { id: '6', name: 'Investments', flow: FlowType.INCOME, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '7', name: 'Salary', flow: FlowType.INCOME, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '8', name: 'Bonus', flow: FlowType.INCOME, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '9', name: 'Freelance', flow: FlowType.INCOME, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
  { id: '10', name: 'Transfers', flow: FlowType.INCOME, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },

  // UNCATEGORIZED
  { id: '11', name: 'Uncategorized', flow: FlowType.UNCATEGORIZED, createdAt: new Date().toISOString(), transactionCount: 0, totalAmount: 0 },
];

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref<Category[]>([])
  const archivedCategories = ref<Category[]>([])
  const loading = ref(false)
  const isDemoMode = ref(true)

  // Getters
  const getArchivedCategoriesCount = computed(() => archivedCategories.value.length)

  // Helper, stats calculation in demo
  const _computeDemoStats = () => {
    if (!isDemoMode.value) return

    const transactionsStore = useTransactionsStore()

    categories.value = categories.value.map(cat => {
      const categoryTransactions = transactionsStore.transactions.filter((t: Transaction) => t.categoryId === cat.id)

      return {
        ...cat,
        transactionCount: categoryTransactions.length,
        totalAmount: categoryTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      }
    })
  }

  // Actions
  const initializeDemoData = () => {
    if (!import.meta.client) return

    const saved = localStorage.getItem(DEMO_CATEGORIES_KEY)
    const savedArchived = localStorage.getItem(DEMO_ARCHIVED_CATEGORIES_KEY)

    if (saved) {
      try {
        categories.value = JSON.parse(saved) as Category[]
      } catch (e) {
        console.error('Failed to parse demo categories:', e)
        categories.value = DEFAULT_CATEGORIES
        _saveDemoData()
      }
    } else {
      categories.value = DEFAULT_CATEGORIES
      _saveDemoData()
    }

    if (savedArchived) {
      try {
        archivedCategories.value = JSON.parse(savedArchived) as Category[]
      } catch (e) {
        console.error('Failed to parse archived categories:', e)
        archivedCategories.value = []
      }
    }

    _computeDemoStats()
  }

  const setDemoMode = (value: boolean) => {
    isDemoMode.value = value
  }

  const _saveDemoData = () => {
    if (!import.meta.client || !isDemoMode.value) return

    localStorage.setItem(DEMO_CATEGORIES_KEY, JSON.stringify(categories.value))
    localStorage.setItem(DEMO_ARCHIVED_CATEGORIES_KEY, JSON.stringify(archivedCategories.value))
  }

  const fetchCategories = async () => {
    if (isDemoMode.value) {
      if (categories.value.length === 0) {
        initializeDemoData()
      } else {
        _computeDemoStats()
      }
      return
    }

    try {
      loading.value = true
      const config = useRuntimeConfig()
      const data = await $fetch(`${config.public.backendBaseUrl}/api/categories/stats`, {
        credentials: 'include',
      })
      categories.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (name: string, flow: FlowTypeValues): Promise<Category> => {
    if (!FlowTypeUtils.isValid(flow)) {
      throw new Error(`Invalid flow type: ${flow}.`)
    }

    if (isDemoMode.value) {
      const newCategory: Category = {
        id: crypto.randomUUID?.() ?? Date.now().toString(),
        name,
        flow,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactionCount: 0,
        totalAmount: 0
      }
      categories.value.push(newCategory)
      _saveDemoData()
      return newCategory
    }

    try {
      const config = useRuntimeConfig()
      const data = await $fetch<Category>(`${config.public.backendBaseUrl}/api/categories`, {
        method: 'POST',
        credentials: 'include',
        body: { name, flow },
      })

      await fetchCategories()
      return data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  const updateCategory = async (
    id: string,
    name: string,
    flow: FlowTypeValues
  ): Promise<Category | null> => {
    if (!FlowTypeUtils.isValid(flow)) {
      throw new Error(`Invalid flow type: ${flow}.`)
    }

    if (isDemoMode.value) {
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        const category = categories.value[index]
        if (category) {
          category.name = name
          category.flow = flow
          category.updatedAt = new Date().toISOString()
          _saveDemoData()
          _computeDemoStats()
          return category
        }
      }
      return null
    }

    try {
      const config = useRuntimeConfig()
      const data = await $fetch<Category>(
        `${config.public.backendBaseUrl}/api/categories/${id}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: { name, flow },
        }
      )

      await fetchCategories()

      return data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  const archiveCategory = async (id: string) => {
    if (isDemoMode.value) {
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        const [category] = categories.value.splice(index, 1)
        if (category) {
          archivedCategories.value.push(category)
          _saveDemoData()
        }
      }
      return
    }

    try {
      const config = useRuntimeConfig()

      const currentCategory = await $fetch(`${config.public.backendBaseUrl}/api/categories/${id}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (currentCategory == null) {
        throw new Error('Category not found')
      }

      await $fetch(`${config.public.backendBaseUrl}/api/categories/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: { isArchived: true }
      })
      await fetchCategories()
      await fetchArchivedCategories()
    } catch (error) {
      console.error('Error archiving category:', error)
      throw error
    }
  }

  const fetchArchivedCategories = async () => {
    if (isDemoMode.value) {
      if (archivedCategories.value.length === 0) {
        initializeDemoData()
      }
      return
    }

    try {
      loading.value = true
      const config = useRuntimeConfig()
      const data = await $fetch(`${config.public.backendBaseUrl}/api/categories/archived`, {
        credentials: 'include',
      })
      archivedCategories.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching archived categories:', error)
    } finally {
      loading.value = false
    }
  }

  const restoreCategory = async (id: string) => {
    if (isDemoMode.value) {
      const index = archivedCategories.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        const [category] = archivedCategories.value.splice(index, 1)
        if (category) {
          categories.value.push(category)
          _saveDemoData()
          _computeDemoStats()
        }
      }
      return
    }

    try {
      const config = useRuntimeConfig()

      const currentCategory = await $fetch(`${config.public.backendBaseUrl}/api/categories/${id}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (currentCategory == null) {
        throw new Error('Category not found')
      }

      await $fetch(`${config.public.backendBaseUrl}/api/categories/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: { isArchived: false }
      })
      await fetchCategories()
      await fetchArchivedCategories()
    } catch (error) {
      console.error('Error restoring category:', error)
      throw error
    }
  }

  const permanentlyDeleteCategory = async (id: string) => {
    if (isDemoMode.value) {
      const index = archivedCategories.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        archivedCategories.value.splice(index, 1)
        _saveDemoData()
      }
      return
    }

    try {
      const config = useRuntimeConfig()
      await $fetch(`${config.public.backendBaseUrl}/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      await fetchCategories()
      await fetchArchivedCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  const resetDemoData = () => {
    if (!import.meta.client) return

    localStorage.removeItem(DEMO_CATEGORIES_KEY)
    localStorage.removeItem(DEMO_ARCHIVED_CATEGORIES_KEY)

    categories.value = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)) as Category[]
    archivedCategories.value = []

    _saveDemoData()

    const transactionsStore = useTransactionsStore()
    transactionsStore.resetDemoData()
  }

  const refreshStats = async () => {
    if (isDemoMode.value) {
      _computeDemoStats()
    } else {
      await fetchCategories()
    }
  }

  return {
    categories,
    archivedCategories,
    loading,
    isDemoMode,
    getArchivedCategoriesCount,
    initializeDemoData,
    setDemoMode,
    fetchCategories,
    createCategory,
    updateCategory,
    archiveCategory,
    fetchArchivedCategories,
    restoreCategory,
    refreshStats,
    permanentlyDeleteCategory,
    resetDemoData,
  }
})
