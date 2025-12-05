<script setup lang="ts">
import { watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { StatCardProps } from '@/components/StatCard.vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FlowType, FlowTypeUtils, type FlowTypeValues } from '@/lib/Enums/FlowType'
import { capitalizeFirst, formatIDR } from '@/lib/utils'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

definePageMeta({
  layout: 'default'
})

const flowClass = (flow) => {
  if (flow === 'expense') return 'text-red-500'
  if (flow === 'income') return 'text-green-500'
  return 'text-yellow-500'
}

const categoryAmount = (category) => {
  const total = getCategoryTotal(category.id)
  return category.flow === 'expense' ? Math.abs(total) : total
}

const categoriesStore = useCategoriesStore()
const transactionsStore = useTransactionsStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const showCreateDialog = ref(false)
const showArchivesDrawer = ref(false)
const editingCategory = ref<any>(null)
const categoryForm = ref({ name: '', flow: ''})
const categoryToDelete = ref<any>(null)

onMounted(async () => {
  categoriesStore.initializeDemoData()
  await categoriesStore.fetchCategories()
  await categoriesStore.fetchArchivedCategories()
  await transactionsStore.fetchTransactions()

  console.log('[From OnMounted] Transactions:', transactionsStore.transactions)
  console.log('[From OnMounted] Transaction categoryIds:', transactionsStore.transactions.map(t => t.categoryId))
  console.log('[From OnMounted] Category IDs:', categoriesStore.categories.map(c => c.id))
})

const getCategoryName = (categoryId: string): string => {
  const category = categoriesStore.categories.find(c => c.id === categoryId)
  return category?.name || 'Uncategorized'
}

const getCategoryById = (categoryId: string) => {
  return categoriesStore.categories.find(c => c.id === categoryId)
}

const getTransactionCount = (categoryId: string) => {
  const category = categoriesStore.categories.find(c => c.id === categoryId)
  return category?.transactionCount || 0
}

const getCategoryTotal = (categoryId: string) => {
  const category = categoriesStore.categories.find(c => c.id === categoryId)
  return category?.totalAmount || 0
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value.name = category.name
  categoryForm.value.flow = category.flow
  showCreateDialog.value = true
}

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await categoriesStore.updateCategory(
        editingCategory.value.id,
        categoryForm.value.name,
        categoryForm.value.flow
      )
    } else {
      await categoriesStore.createCategory(
        categoryForm.value.name,
        categoryForm.value.flow
      )
    }
    showCreateDialog.value = false
    categoryForm.value.name = ''
    categoryForm.value.flow = ''
    editingCategory.value = null
  } catch (error) {
    console.error('Error saving category:', error)
  }
}

const archiveCategory = async (id: string) => {
  if (confirm('Archive this category?')) {
    try {
      await categoriesStore.archiveCategory(id)
    } catch (error) {
      console.error('Error archiving category:', error)
    }
  }
}

const restoreCategory = async (id: string) => {
  if (confirm('Restore this category?')) {
    try {
      await categoriesStore.restoreCategory(id)
    } catch (error) {
      console.error('Error restoring category:', error)
    }
  }
}

const handlePermanentDelete = (category: any) => {
  categoryToDelete.value = category
}

const confirmPermanentDelete = async () => {
  if (categoryToDelete.value) {
    try {
      await categoriesStore.permanentlyDeleteCategory(categoryToDelete.value.id)
      await categoriesStore.fetchArchivedCategories()
      categoryToDelete.value = null
    } catch (error) {
      console.error('Error permanently deleting category:', error)
    }
  }
}

const resetAllData = () => {
  categoriesStore.resetDemoData()
  // Refresh after a short delay to ensure state is updated
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

// Filter
const activeFilter = ref<FlowTypeValues | 'all'>('all')

const filteredCategories = computed(() => {
  if (activeFilter.value === 'all') {
    return categoriesStore.categories
  }

  return categoriesStore.categories.filter(c => c.flow === activeFilter.value)
})

// Calculate Flow Stats
const flowStats = (flowType: FlowTypeValues) => {
  const flowCategories = categoriesStore.categories.filter(c => c.flow === flowType);

  const flowTotalAmount = flowCategories.reduce((sum, cat) => sum + (cat.totalAmount || 0), 0)
  const flowTransactionCount = flowCategories.reduce((sum, cat) => sum + (cat.transactionCount || 0), 0)

  return { flowTotalAmount, flowTransactionCount }
}

const expenseStats = computed(() => flowStats(FlowType.EXPENSE))
const incomeStats = computed(() => flowStats(FlowType.INCOME))

const categoryStats = computed<StatCardProps[]>(() => {
  return [
    {
      title: 'Expense',
      icon: 'mdi:arrow-up',
      value: formatIDR(Math.abs(expenseStats.value.flowTotalAmount), true),
      valueColor: 'text-red-500',
      subtitle: `${expenseStats.value.flowTransactionCount} ${expenseStats.value.flowTransactionCount === 1 ? 'transaction' : 'transactions'}`,
      clickable: true,
      isActive: activeFilter.value === FlowType.EXPENSE
    },
    {
      title: 'Income',
      icon: 'mdi:arrow-down',
      value: formatIDR(Math.abs(incomeStats.value.flowTotalAmount), true),
      valueColor: 'text-green-500',
      subtitle: `${incomeStats.value.flowTransactionCount} ${incomeStats.value.flowTransactionCount === 1 ? 'transaction' : 'transactions'}`,
      clickable: true,
      isActive: activeFilter.value === FlowType.INCOME
    }
  ]
})

watch([() => categoriesStore.categories], () => {
  console.log('[From Watcher] Watch Categories: ', categoriesStore.categories)
  console.log('[From Watcher] Expense Stats: ', expenseStats.value)
  console.log('[From Watcher] Income Stats: ', incomeStats.value)
}, { deep: true, immediate: true })

const handleStatClick = (flowType: FlowTypeValues) => {
  if (activeFilter.value === flowType) {
    activeFilter.value = 'all'
  } else {
    activeFilter.value = flowType
  }
}

const getIconColorClass = (option: typeof filterOptions[0]) => {
  return activeFilter.value === option.value
    ? option.activeIconColor
    : option.inactiveIconColor
}

const getButtonClass = (optionValue: string) => {
  const isActive = activeFilter.value === optionValue
  return [
    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
    isActive
      ? 'bg-black dark:bg-black text-white font-medium'
      : 'bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700'
  ]
}

const flowOptions = FlowTypeUtils.values()
  .filter(v => v !== FlowType.UNCATEGORIZED)
  .map(value => (
    {
      value: value,
      label: capitalizeFirst(value)
    }
  ));

useHead({
  title: 'Categories - Fineline'
})

watch(showCreateDialog, (open) => {
  if (open && !editingCategory.value) {
    categoryForm.value = { name: '', flow: '' }
  }
})
</script>

<template>
  <div class="min-h-screen space-y-8 p-10 pt-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold">Categories</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage and organize your transaction categories</p>
      </div>
      <div class="flex items-center space-x-3">
        <Button
          @click="showArchivesDrawer = true"
          variant="outline"
          class="flex items-center space-x-2"
        >
          <Icon icon="mdi:archive" width="18" />
          <span>Archives</span>
          <Badge v-if="categoriesStore.getArchivedCategoriesCount > 0" variant="secondary">
            {{ categoriesStore.getArchivedCategoriesCount }}
          </Badge>
        </Button>
        <Button @click="showCreateDialog = true" class="flex items-center space-x-2">
          <Icon icon="mdi:plus" width="18" />
          <span>Add Category</span>
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="categoriesStore.loading" class="text-center py-12">
      <Icon icon="mdi:loading" width="40" class="mx-auto animate-spin text-gray-400 mb-4" />
      <p class="text-gray-500">Loading categories...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="categoriesStore.categories.length === 0" class="text-center py-16">
      <Icon icon="mdi:tag-off" width="64" class="mx-auto mb-6 text-gray-300 dark:text-gray-700" />
      <p class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No categories yet</p>
      <p class="text-gray-500 mb-6">Create your first category to organize your transactions</p>
      <Button @click="showCreateDialog = true">Create Category</Button>
    </div>

    <!-- Categories View -->
    <div v-else class="space-y-6">
      <!-- Flow Stats -->
      <div class="grid gap-4 md:grid-cols-2">
        <StatCard
          v-for="(stat, index) in categoryStats"
          :key="stat.title"
          v-bind="stat"
          @click="handleStatClick(index === 0 ? FlowType.EXPENSE : FlowType.INCOME)"
        />
      </div>

      <!-- Categories Grid -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">
            {{ capitalizeFirst(activeFilter) }} Categories
          </h2>
        </div>

        <div v-if="filteredCategories.length === 0" class="text-center py-12 border-2 border-dashed rounded-lg">
          <Icon icon="mdi:folder-off" width="48" class="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <p class="text-gray-600 dark:text-gray-400">No {{ activeFilter }} categories yet m8. Go create one!</p>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="category in filteredCategories"
            :key="category.id"
            :to="`/categories/${category.id}`"
            class="group"
          >
            <Card class="h-full hover:border-blue-400 dark:hover:border-blue-600 transition cursor-pointer">
              <CardHeader class="pb-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <CardTitle class="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {{ category.name }}
                    </CardTitle>
                  </div>
                  <div class="flex items-center space-x-1 ml-2">
                    <button
                      @click.prevent.stop="editCategory(category)"
                      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
                      title="Edit"
                    >
                      <Icon icon="mdi:pencil" width="18" />
                    </button>
                    <button
                      @click.prevent.stop="archiveCategory(category.id)"
                      class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                      title="Archive"
                    >
                      <Icon icon="mdi:delete" width="18" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  <div class="flex items-baseline justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span
                      class="text-2xl font-bold"
                      :class="flowClass(category.flow)"
                    >
                      {{ formatIDR(categoryAmount(category), true) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Transactions</span>
                    <span class="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {{ getTransactionCount(category.id) }}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingCategory ? 'Edit Category' : 'Create New Category' }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              v-model="categoryForm.name"
              placeholder="e.g., Groceries, Utilities, Entertainment"
              @keyup.enter="saveCategory"
            />
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <Label htmlFor="category-name">Select Flow</Label>
            <Select v-model="categoryForm.flow">
              <SelectTrigger>
                <SelectValue placeholder="Select Flow..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in flowOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            @click="saveCategory"
            :disabled="!categoryForm.name.trim() || !categoryForm.flow"
          >
            {{ editingCategory ? 'Update' : 'Create' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Archives Drawer -->
    <Sheet v-model:open="showArchivesDrawer">
      <SheetContent side="right" class="w-96">
        <SheetHeader>
          <SheetTitle>Archived Categories</SheetTitle>
        </SheetHeader>
        <div class="space-y-4 mt-6">
          <ConfirmationDialog
            v-if="!isAuthenticated"
            triggerTitle="Reset Categories"
            title="Reset All Data?"
            description="This will clear all archived categories and reset to default categories. This action cannot be undone."
            confirm-text="Reset"
            cancel-text="Cancel"
            placeholder="Reset Categories"
            trigger-icon="mdi:refresh"
            trigger-variant="outline"
            trigger-size="default"
            @confirm="resetAllData"
          />
          <div v-if="categoriesStore.archivedCategories.length === 0" class="text-center py-8">
            <Icon icon="mdi:archive-off" width="40" class="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
            <p class="text-gray-600 dark:text-gray-400">No archived categories</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="category in categoriesStore.archivedCategories"
              :key="category.id"
              class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <span class="font-medium">{{ category.name }}</span>
              <div class="flex items-center space-x-2">
                <Button
                  size="sm"
                  @click="restoreCategory(category.id)"
                  class="flex items-center space-x-1"
                >
                  <Icon icon="mdi:restore" width="16" />
                  <span>Restore</span>
                </Button>
                <ConfirmationDialog
                  title="Permanently Delete?"
                  description="This will permanently remove this archived category. This action cannot be undone."
                  confirm-text="Delete"
                  cancel-text="Cancel"
                  trigger-icon="mdi:trash-can"
                  trigger-variant="destructive"
                  trigger-size="sm"
                  @confirm="handlePermanentDelete(category); confirmPermanentDelete()"
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
