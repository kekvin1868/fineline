<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'
import TransactionDialog from '@/components/transaction/TransactionDialog.vue'
import { formatIDR } from '~/lib/utils'

const route = useRoute()
const router = useRouter()
const categoriesStore = useCategoriesStore()
const transactionsStore = useTransactionsStore()

const categoryId = computed(() => route.params.id as string)

// Get current category
const category = computed(() => {
  return categoriesStore.categories.find(c => c.id === categoryId.value)
})

// Get transactions for this category
const categoryTransactions = computed(() => {
  return transactionsStore.transactions.filter(t => t.category === category.value?.name)
})

// Calculate category stats
const categoryStats = computed(() => {
  const transactions = categoryTransactions.value
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    count: transactions.length,
    totalExpenses: totalExpenses.toFixed(2),
    totalIncome: totalIncome.toFixed(2),
    net: (totalIncome - totalExpenses).toFixed(2)
  }
})

// Format date for display
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  // Initialize stores if needed
  if (categoriesStore.categories.length === 0) {
    categoriesStore.initializeDemoData()
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="sticky top-8 z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 border rounded-lg">
          <div class="px-4 sm:px-6 py-4 sm:py-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <Button
                  @click="router.back()"
                  variant="ghost"
                  size="icon"
                  class="h-10 w-10"
                >
                  <Icon icon="mdi:arrow-left" class="w-5 h-5" />
                </Button>
                <div>
                  <h1 v-if="category" class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {{ category.name }}
                  </h1>
                  <p v-else class="text-slate-500 dark:text-slate-400">Category not found</p>
                </div>
              </div>
              <div v-if="category" class="flex items-center gap-2">
                <Badge variant="destructive" class="text-xs">
                  {{ category.flow }}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Stats Cards -->
      <div v-if="category" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-slate-900 dark:text-white">
              {{ categoryStats.count }}
            </div>
          </CardContent>
        </Card>

        <Card class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-red-200 dark:border-red-900">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-red-600 dark:text-red-400">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-red-600 dark:text-red-400">
              {{ formatIDR(Number(categoryStats.totalExpenses)) }}
            </div>
          </CardContent>
        </Card>

        <Card class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-green-200 dark:border-green-900">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-green-600 dark:text-green-400">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">
              {{ formatIDR(Number(categoryStats.totalIncome)) }}
            </div>
          </CardContent>
        </Card>

        <Card class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-slate-600 dark:text-slate-400">
              Net Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div :class="[
              'text-3xl font-bold',
              Number(categoryStats.net) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]">
              {{ formatIDR(Number(categoryStats.net)) }}
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Transactions List -->
      <Card v-if="category" class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader class="border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                All transactions in the {{ category.name }} category
              </CardDescription>
            </div>
            <TransactionDialog
              trigger-text="Add New"
              trigger-icon="mdi:plus"
              trigger-size="sm"
              :category-param="category"
              @transaction-created="() => {}"
            />
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div v-if="categoryTransactions.length === 0" class="text-center py-12">
            <Icon icon="mdi:inbox-outline" class="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
            <p class="text-slate-500 dark:text-slate-400">
              No transactions in this category yet
            </p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="transaction in categoryTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    transaction.amount > 0
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  ]">
                    <Icon
                      :icon="transaction.amount > 0 ? 'mdi:plus-circle' : 'mdi:minus-circle'"
                      :class="[
                        'w-6 h-6',
                        transaction.amount > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      ]"
                    />
                  </div>
                  <div>
                    <p class="font-medium text-slate-900 dark:text-white">
                      {{ transaction.description }}
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ formatDate(transaction.date) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p :class="[
                  'font-semibold text-lg',
                  transaction.amount > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                ]">
                  {{ transaction.amount > 0 ? '+' : '' }}{{ formatIDR(transaction.amount) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Category Not Found -->
      <Card v-else class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent class="pt-6 text-center">
          <Icon icon="mdi:alert-circle-outline" class="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
          <p class="text-slate-500 dark:text-slate-400 mb-4">
            Category not found
          </p>
          <Button @click="router.push('/categories')" variant="outline">
            Back to Categories
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
