<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
import { formatIDR } from '@/lib/utils'
import type { StatCardProps } from '@/components/StatCard.vue'
import TransactionTableRow from '~/components/transaction/TransactionTableRow.vue'
import TransactionDialog from '~/components/transaction/TransactionDialog.vue'

definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()
const categoriesStore = useCategoriesStore()
const { switchToRealMode: migrateAndSwitchMode } = useDataMigration()

const isDemoMode = ref(true)
const isAuthenticated = ref(false)
const config = useRuntimeConfig()

const initializeApp = async () => {
  // Always check authentication first
  isAuthenticated.value = await authStore.checkAuth(true)

  if (isAuthenticated.value) {
    // User is logged in - use real mode
    isDemoMode.value = false
    await migrateAndSwitchMode()
  } else {
    // User is not logged in - use demo mode
    isDemoMode.value = true
    transactionsStore.setDemoMode(true)
    categoriesStore.initializeDemoData()
    await transactionsStore.fetchTransactions()
    await categoriesStore.fetchCategories()
  }
}

const switchToRealMode = () => {
  window.location.href = `${config.public.backendBaseUrl}/api/dashboard`
}

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
])

const recentTransactions = computed(() =>
  transactionsStore.transactions.slice(0, 5)
)

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

const handleTransactionCreated = () => {
  transactionsStore.fetchTransactions()
}

const handleTransactionUpdated = () => {
  transactionsStore.fetchTransactions()
}

const handleDeleteTransaction = async (transactionId: string) => {
  try {
    await transactionsStore.deleteTransaction(transactionId)
  } catch (error) {
    console.error('Failed to delete transaction:', error)
  }
}

const resetAllData = () => {
  transactionsStore.resetDemoData()
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

onMounted(() => {
  initializeApp()
})

useHead({
  title: 'Fineline Dashboard'
})
</script>

<template>
  <div class="min-h-screen space-y-8 p-10 pt-8">
    <!-- Welcome Banner -->
    <Card class="bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900 border-0">
      <CardHeader class="pb-8">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-3xl text-black dark:text-gray-400 font-bold">
              {{ isDemoMode ? 'Welcome to Demo Mode.' : 'Welcome back!' }}
            </CardTitle>
            <CardDescription class="text-black dark:text-gray-300 text-lg mt-3">
              {{ isDemoMode
                ? 'Explore all features with sample data. No signup required!'
                : 'Track your finances and stay on top of your spending.'
              }}
            </CardDescription>
          </div>
        </div>
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

    <!-- Transactions Table -->
    <Card>
      <CardHeader class="pb-6">
        <div class="flex items-center justify-between">
          <CardTitle class="select-none text-xl font-semibold">All Transactions</CardTitle>
          <div class="flex items-center space-x-3">
            <ConfirmationDialog
              v-if="!isAuthenticated"
              title="Reset All Data?"
              description="This will clear all archived categories and reset to default categories. This action cannot be undone."
              confirm-text="Reset"
              cancel-text="Cancel"
              trigger-icon="mdi:refresh"
              trigger-variant="outline"
              trigger-size="default"
              @confirm="resetAllData"
            />
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
          <div class="grid grid-cols-6 gap-6 text-base font-semibold text-muted-foreground border-b pb-4 select-none">
            <div>Date</div>
            <div>Description</div>
            <div>Category</div>
            <div>Type</div>
            <div class="text-right">Amount</div>
            <div class="text-center">Actions</div>
          </div>

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
  </div>
</template>
