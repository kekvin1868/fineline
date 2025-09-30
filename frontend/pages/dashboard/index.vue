<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

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

// Recent transactions for dashboard
const recentTransactions = computed(() => 
  transactionsStore.transactions.slice(0, 5)
)

// Summary stats
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
          <Icon icon="mdi:currency-usd" width="32" class="text-primary" />
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
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle class="text-base font-semibold select-none">Total Balance</CardTitle>
            <Icon icon="mdi:currency-usd" width="24" class="text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-2">
            <div class="text-3xl font-bold select-none" :class="totalBalance >= 0 ? 'text-green-600' : 'text-red-600'">
              ${{ Math.abs(totalBalance).toFixed(2) }}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle class="text-base font-semibold select-none">Monthly Income</CardTitle>
            <Icon icon="mdi:trending-up" width="24" class="text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-2">
            <div class="text-3xl font-bold text-green-600 select-none">${{ monthlyIncome.toFixed(2) }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle class="text-base font-semibold select-none">Monthly Expenses</CardTitle>
            <Icon icon="mdi:trending-down" width="24" class="text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-2">
            <div class="text-3xl font-bold text-red-600 select-none">${{ monthlyExpenses.toFixed(2) }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle class="text-base font-semibold select-none">Total Transactions</CardTitle>
            <Icon icon="mdi:receipt" width="24" class="text-muted-foreground" />
          </CardHeader>
          <CardContent class="pt-2">
            <div class="text-3xl font-bold select-none">{{ recentTransactions.length }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Full Width Transactions Table -->
      <Card>
        <CardHeader class="pb-6">
          <div class="flex items-center justify-between">
            <CardTitle class="select-none text-xl font-semibold">All Transactions</CardTitle>
            <div class="flex items-center space-x-3">
              <Button @click="$router.push('/transactions')" variant="outline" size="default" class="text-base px-6">
                <Icon icon="mdi:plus" width="20" class="mr-3" />
                Add New
              </Button>
              <Button @click="$router.push('/transactions')" size="default" variant="outline" class="text-base px-6">
                <Icon icon="mdi:table" width="20" class="mr-3" />
                Manage All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="recentTransactions.length === 0" class="text-center py-16 text-muted-foreground">
            <Icon icon="mdi:credit-card" width="64" class="mx-auto mb-6 opacity-20" />
            <p class="select-none text-lg font-medium mb-2">No transactions yet</p>
            <p class="text-base select-none mb-6">Start by adding your first transaction!</p>
            <Button @click="$router.push('/transactions')" variant="outline" class="text-base px-8 py-3">
              <Icon icon="mdi:plus" width="20" class="mr-3" />
              Add Transaction
            </Button>
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
            <div 
              v-for="transaction in recentTransactions" 
              :key="transaction.id"
              class="grid grid-cols-6 gap-6 py-4 border-b hover:bg-muted/50 transition-colors select-none"
            >
              <div class="text-base text-muted-foreground font-medium">
                {{ new Date(transaction.date).toLocaleDateString() }}
              </div>
              <div class="text-base font-semibold">
                {{ transaction.description || 'Transaction' }}
              </div>
              <div class="text-base">
                <Badge variant="secondary" class="text-sm px-3 py-1 font-medium">
                  {{ transaction.category }}
                </Badge>
              </div>
              <div class="text-base">
                <Badge 
                  :variant="Number(transaction.amount) >= 0 ? 'default' : 'destructive'"
                  class="capitalize text-sm px-3 py-1 font-medium"
                >
                  <Icon 
                    :icon="Number(transaction.amount) >= 0 ? 'mdi:plus-circle' : 'mdi:minus-circle'" 
                    width="16" 
                    class="mr-2" 
                  />
                  {{ Number(transaction.amount) >= 0 ? 'Income' : 'Expense' }}
                </Badge>
              </div>
              <div 
                class="text-base font-bold text-right"
                :class="Number(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ Number(transaction.amount) >= 0 ? '+' : '' }}${{ Number(transaction.amount).toFixed(2) }}
              </div>
              <div class="text-center">
                <Button 
                  @click="$router.push('/transactions')" 
                  variant="ghost" 
                  size="default"
                  class="px-4 py-2"
                >
                  <Icon icon="mdi:pencil" width="18" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
