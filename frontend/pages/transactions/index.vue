<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@iconify/vue'

definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()

const showCreateForm = ref(false)
const editingTransaction = ref<any>(null)

// Form data
const formData = ref({
  description: '',
  amount: '',
  category: '',
  date: ''
})

// Create transaction
const createTransaction = async () => {
  if (!formData.value.description || !formData.value.amount) return

  const transaction = {
    description: formData.value.description,
    amount: parseFloat(formData.value.amount),
    category: formData.value.category || 'General',
    date: formData.value.date || new Date().toISOString()
  }

  await transactionsStore.createTransaction(transaction)
  resetForm()
  showCreateForm.value = false
}

// Update transaction
const updateTransaction = async () => {
  if (!editingTransaction.value || !formData.value.description || !formData.value.amount) return

  const updatedTransaction = {
    id: editingTransaction.value.id,
    description: formData.value.description,
    amount: parseFloat(formData.value.amount),
    category: formData.value.category || 'General',
    date: formData.value.date || new Date().toISOString()
  }

  await transactionsStore.updateTransaction(editingTransaction.value.id, updatedTransaction)
  resetForm()
  editingTransaction.value = null
  showCreateForm.value = false
}

// Delete transaction
const deleteTransaction = async (id: string) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    await transactionsStore.deleteTransaction(id)
  }
}

// Form helpers
const resetForm = () => {
  formData.value = {
    description: '',
    amount: '',
    category: '',
    date: ''
  }
}

const startEdit = (transaction: any) => {
  editingTransaction.value = transaction
  formData.value = {
    description: transaction.description || '',
    amount: transaction.amount.toString() || '',
    category: transaction.category || '',
    date: (transaction.date || transaction.created_at) ? new Date(transaction.date || transaction.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  }
  showCreateForm.value = true
}

const cancelEdit = () => {
  editingTransaction.value = null
  resetForm()
  showCreateForm.value = false
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Get amount color class
const getAmountColor = (amount: number) => {
  return amount >= 0 ? 'text-green-600' : 'text-red-600'
}

// Get transaction type badge
const getTransactionTypeBadge = (amount: number) => {
  return amount >= 0 ? { text: 'Income', variant: 'default' } : { text: 'Expense', variant: 'destructive' }
}

// Load transactions on mount
onMounted(async () => {
  await transactionsStore.fetchTransactions()
})

useHead({
  title: 'Transactions - Fineline'
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-b">
      <div class="flex h-16 items-center px-4">
        <div class="flex items-center space-x-4">
          <Button variant="ghost" size="sm" @click="$router.push('/dashboard')">
            <Icon icon="mdi:home" width="16" class="mr-1" />
            Dashboard
          </Button>
          <Separator orientation="vertical" class="h-6" />
          <div class="flex items-center space-x-2">
            <Icon icon="mdi:credit-card" width="20" class="text-primary" />
            <h1 class="text-xl font-bold">Transactions</h1>
          </div>
        </div>
        
        <div class="ml-auto flex items-center space-x-2">
          <ThemeToggle />
          <Button @click="showCreateForm = true; resetForm()">
            <Icon icon="mdi:plus" width="16" class="mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 space-y-4 p-8 pt-6">
      <!-- Create/Edit Form -->
      <Card v-if="showCreateForm">
        <CardHeader>
          <CardTitle>{{ editingTransaction ? 'Edit' : 'Create' }} Transaction</CardTitle>
          <CardDescription>
            {{ editingTransaction ? 'Update the transaction details below' : 'Add a new transaction to track your finances' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="editingTransaction ? updateTransaction() : createTransaction()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Description</label>
                <Input 
                  v-model="formData.description" 
                  placeholder="Enter description"
                  required
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Amount</label>
                <Input 
                  v-model="formData.amount" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Category</label>
                <Input 
                  v-model="formData.category" 
                  placeholder="e.g., Food, Transport, Salary"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Date</label>
                <Input 
                  v-model="formData.date" 
                  type="date"
                />
              </div>
            </div>
            
            <div class="flex space-x-2">
              <Button type="submit">
                {{ editingTransaction ? 'Update' : 'Create' }} Transaction
              </Button>
              <Button type="button" variant="outline" @click="cancelEdit()">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Transactions List -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Your Transactions</CardTitle>
              <CardDescription>
                {{ transactionsStore.transactions.length }} total transactions
              </CardDescription>
            </div>
            <Badge v-if="transactionsStore.isDemoMode" variant="secondary">
              Demo Mode
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="transactionsStore.transactions.length === 0" class="text-center py-8">
            <Icon icon="mdi:credit-card" width="48" class="mx-auto mb-4 opacity-20" />
            <h3 class="text-lg font-medium mb-2">No transactions yet</h3>
            <p class="text-muted-foreground mb-4">Start tracking your finances by adding your first transaction</p>
            <Button @click="showCreateForm = true; resetForm()">
              <Icon icon="mdi:plus" width="16" class="mr-2" />
              Add Transaction
            </Button>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="transaction in transactionsStore.transactions" 
              :key="transaction.id"
              class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     :class="Number(transaction.amount) >= 0 ? 'bg-green-100' : 'bg-red-100'">
                  <Icon 
                    :icon="Number(transaction.amount) >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'" 
                    width="16" 
                    :class="Number(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'"
                  />
                </div>
                <div>
                  <h4 class="font-medium">{{ transaction.description || 'Transaction' }}</h4>
                  <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{{ transaction.category || 'General' }}</span>
                    <span>•</span>
                    <span>{{ formatDate(transaction.date || transaction.created_at) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="font-medium" :class="getAmountColor(Number(transaction.amount))">
                    {{ Number(transaction.amount) >= 0 ? '+' : '' }}${{ Number(transaction.amount).toFixed(2) }}
                  </p>
                  <Badge 
                    :variant="getTransactionTypeBadge(Number(transaction.amount)).variant as any"
                    class="text-xs"
                  >
                    {{ getTransactionTypeBadge(Number(transaction.amount)).text }}
                  </Badge>
                </div>
                
                <div class="flex space-x-1">
                  <Button variant="ghost" size="sm" @click="startEdit(transaction)">
                    <Icon icon="mdi:cog" width="14" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="deleteTransaction(transaction.id)">
                    <Icon icon="mdi:close" width="14" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>