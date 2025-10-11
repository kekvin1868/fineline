<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'
import { formatIDR } from '@/lib/utils'
import type { StatCardProps } from '@/components/StatCard.vue'
import TransactionTableRow from '~/components/transaction/TransactionTableRow.vue'

definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()

const isDemoMode = ref(true) // Start in demo mode by default

const config = useRuntimeConfig()

// Demo/Auth logic
const initializeApp = async () => {
  if (isDemoMode.value) {
    // Start in demo mode
    transactionsStore.setDemoMode(true)
    await transactionsStore.fetchTransactions()
  } else {
    // Check real authentication
    const isAuthenticated = await authStore.checkAuth()
    if (isAuthenticated) {
      transactionsStore.setDemoMode(false)
      await transactionsStore.fetchTransactions()
    } else {
      // Fallback to demo mode if not authenticated
      isDemoMode.value = true
      transactionsStore.setDemoMode(true)
      await transactionsStore.fetchTransactions()
    }
  }
}

// Switch to real login
const switchToRealMode = () => {
  window.location.href = `${config.public.backendBaseUrl}/api/auth/login`
}

//-- STATISTICS DASHBOARD START --//

// `StatCard` Props
const stats = computed<StatCardProps[]>(() => [
  {
    title: "Total Balance",
    icon: "mdi:coins",
    value: formatIDR(Math.abs(totalBalance.value), true),
    valueColor: totalBalance.value >= 0 ? 'text-green-600' : 'text-red-600'
  },
  {
    title: "Monthly Income",
    icon: "mdi:trending-up",
    value: formatIDR(monthlyIncome.value, true),
    valueColor: monthlyIncome.value >= 0 ? 'text-green-600' : 'text-red-600'
  },
  {
    title: "Monthly Expenses",
    icon: "mdi:trending-down",
    value: formatIDR(monthlyExpenses.value, true),
    valueColor: 'text-red-600'
  },
  {
    title: "Total Transactions",
    icon: "mdi:cash-multiple",
    value: recentTransactions.value.length
  }
]);

// RECENT TRANSACTION
const recentTransactions = computed(() => 
  transactionsStore.transactions.slice(0, 5)
)

// SUMMARY
const totalBalance = computed(() => 
  transactionsStore.transactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0)
)

const monthlyIncome = computed(() => 
  transactionsStore.transactions
    .filter((t: any) => Number(t.amount) > 0)
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0)
)

const monthlyExpenses = computed(() => 
  transactionsStore.transactions
    .filter((t: any) => Number(t.amount) < 0)
    .reduce((sum: number, t: any) => sum + Math.abs(Number(t.amount)), 0)
)

// Handle transaction creation
const handleTransactionCreated = () => {
  transactionsStore.fetchTransactions()
}

// Handle transaction update
const handleTransactionUpdated = () => {
  transactionsStore.fetchTransactions()
}

// Handle transaction deletion
const handleDeleteTransaction = async (transactionId: string) => {
  try {
    await transactionsStore.deleteTransaction(transactionId)
  } catch (error) {
    console.error('Failed to delete transaction:', error)
  }
}



onMounted(() => {
  initializeApp()
})

useHead({
  title: 'Fineline Dashboard'
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-b">
      <div class="flex h-20 items-center px-6">
        <div class="flex items-center space-x-6">
          <h1 class="text-2xl font-bold">Fineline</h1>
          <Badge v-if="isDemoMode" variant="secondary" class="text-base px-3 py-1">
            Demo Mode
          </Badge>
        </div>
        
        <div class="ml-auto flex items-center space-x-6">
          <div class="text-base text-muted-foreground font-medium">
            {{ authStore.user ? `Welcome, ${authStore.user.username}!` : 'Welcome! Try our demo' }}
          </div>
          
          <!-- Theme Toggle -->
          <ThemeToggle />
          
          <!-- Mode Toggle -->
          <div class="flex space-x-3">
            <Button 
              v-if="isDemoMode" 
              @click="switchToRealMode"
              size="default"
              class="text-base px-6"
            >
              Sign Up / Login
            </Button>
            <Button 
              v-if="authStore.user" 
              @click="authStore.logout"
              variant="ghost"
              size="default"
              class="text-base px-4"
            >
              <Icon icon="mdi:logout" width="20" class="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 space-y-8 p-10 pt-8">
      <!-- Welcome Banner -->
      <Card class="bg-gray-800 text-white dark:bg-gray-300 dark:text-gray-900 border-0">
        <CardHeader class="pb-8">
          <CardTitle class="text-3xl text-white dark:text-gray-900 font-bold">
            {{ isDemoMode ? 'Welcome to Fineline Demo!' : 'Welcome back!' }}
          </CardTitle>
          <CardDescription class="text-gray-300 dark:text-gray-700 text-lg mt-3">
            {{ isDemoMode 
              ? 'Explore all features with sample data. No signup required!' 
              : 'Track your finances and stay on top of your spending.' 
            }}
          </CardDescription>
        </CardHeader>
      </Card>

      <!-- Stats Cards -->
      <div class="grid gap-6 md:grid-cols-4">
        <StatCard 
          v-for="stat in stats" 
          :key="stat.title"
          :title="stat.title"
          :icon="stat.icon"
          :value="stat.value"
          :valueColor="stat.valueColor"
        />
      </div>

      <!-- Full Width Transactions Table -->
      <Card>
        <CardHeader class="pb-6">
          <div class="flex items-center justify-between">
            <CardTitle class="select-none text-xl font-semibold">All Transactions</CardTitle>
            <div class="flex items-center space-x-3">
              <TransactionDialog 
                trigger-text="Add New"
                trigger-variant="outline"
                trigger-size="default"
                @transaction-created="handleTransactionCreated"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="recentTransactions.length === 0" class="text-center py-16 text-muted-foreground">
            <Icon icon="mdi:credit-card" width="64" class="mx-auto mb-6 opacity-20" />
            <p class="select-none text-lg font-medium mb-2">No transactions yet</p>
            <p class="text-base select-none">Start by adding your first transaction using the "Add New" button above!</p>
          </div>
          
          <div v-else class="space-y-5">
            <!-- Table Header -->
            <div class="grid grid-cols-6 gap-6 text-base font-semibold text-muted-foreground border-b pb-4 select-none">
              <div>Date</div>
              <div>Description</div>
              <div>Category</div>
              <div>Type</div>
              <div class="text-right">Amount</div>
              <div class="text-center">Actions</div>
            </div>
            
            <!-- Transaction Rows -->
            <TransactionTableRow
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              :transaction="transaction"
              @transaction-updated="handleTransactionUpdated"
              @delete="handleDeleteTransaction"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
