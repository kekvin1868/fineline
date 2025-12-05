<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Icon } from '@iconify/vue'

interface Props {
  mode?: 'add' | 'edit' | 'view'
  transaction?: any
  categoryParam?: Category
  triggerText?: string
  triggerIcon?: string
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon'
  triggerClass?: string
}

interface Emits {
  (e: 'transaction-created'): void
  (e: 'transaction-updated'): void
  (e: 'edit-mode'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  transaction: null,
  triggerText: 'Add Transaction',
  triggerIcon: 'mdi:plus',
  triggerVariant: 'default',
  triggerSize: 'default',
  triggerClass: ''
})

const emits = defineEmits<Emits>()

const transactionsStore = useTransactionsStore()
const categoriesStore = useCategoriesStore()
const isSubmitting = ref(false)
const isOpen = ref(false)
const currentMode = ref(props.mode)

const formData = ref({
  type: 'expense',
  description: '',
  amount: '',
  categoryId: '',
  date: new Date().toISOString().split('T')[0]
})

// Reset form function
const resetForm = () => {
  formData.value = {
    type: 'expense',
    description: '',
    amount: '',
    categoryId: props.categoryParam?.id || '',
    date: new Date().toISOString().split('T')[0]
  }
}

// Load transaction data into form
const loadTransactionData = () => {
  if (props.transaction) {
    const amount = Math.abs(Number(props.transaction.amount))
    formData.value = {
      type: Number(props.transaction.amount) >= 0 ? 'income' : 'expense',
      description: props.transaction.description || '',
      amount: amount.toString(),
      categoryId: props.transaction.categoryId || '',
      date: props.transaction.date ? new Date(props.transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }
  }
}

// Watch mode
watch(() => props.mode, (newMode) => {
  currentMode.value = newMode
  if (newMode === 'add') {
    resetForm()
  }
}, { immediate: true })

// Watch dialog open state
watch(isOpen, (newValue) => {
  if (newValue) {
    currentMode.value = props.mode
    if (props.transaction && (props.mode === 'edit' || props.mode === 'view')) {
      loadTransactionData()
    } else if (props.mode === 'add') {
      resetForm()
    }
  }
})

// Initialize form data
watch(() => props.transaction, (newTransaction) => {
  if (newTransaction && (currentMode.value === 'edit' || currentMode.value === 'view')) {
    loadTransactionData()
  }
}, { immediate: true })

const isFormValid = computed(() => {
  return formData.value.type &&
         formData.value.description.trim() &&
         formData.value.amount &&
         parseFloat(formData.value.amount) > 0 &&
         formData.value.date
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    const amount = parseFloat(formData.value.amount)
    const finalAmount = formData.value.type === 'expense' ? -Math.abs(amount) : Math.abs(amount)

    const transactionData = {
      description: formData.value.description,
      amount: finalAmount,
      categoryId: formData.value.categoryId || null,
      date: formData.value.date
        ? new Date(formData.value.date).toISOString()
        : new Date().toISOString()
    }

    if (props.mode === 'edit' && props.transaction) {
      await transactionsStore.updateTransaction(props.transaction.id, transactionData)
      emits('transaction-updated')
    } else {
      await transactionsStore.createTransaction(transactionData)
      emits('transaction-created')
    }

    resetForm()
    isOpen.value = false
  } catch (error) {
    console.error('Failed to save transaction:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleEditMode = () => {
  currentMode.value = 'edit'
}

const handleCancel = () => {
  resetForm()
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger>
      <Button
        :variant="triggerVariant"
        :size="triggerSize"
        :class="triggerClass || 'text-base'"
      >
        <Icon :icon="triggerIcon" class="w-5 h-5" :class="triggerText ? 'mr-2' : ''" />
        {{ triggerText }}
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg">
          {{ currentMode === 'add' ? 'Add New Transaction' :
             currentMode === 'edit' ? 'Edit Transaction' : 'Transaction Details' }}
        </DialogTitle>
        <DialogDescription>
          {{ currentMode === 'view' ? 'View transaction details' : 'Enter the details for your transaction.' }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <!-- Transaction Type -->
        <div class="grid gap-3">
          <Label class="text-base font-medium">Transaction Type</Label>
          <div class="grid grid-cols-2 gap-2">
            <Button
              @click="formData.type = 'expense'"
              :disabled="currentMode === 'view'"
              :variant="formData.type === 'expense' ? 'destructive' : 'outline'"
              :class="formData.type === 'expense' ? 'border-red-500 bg-red-200 text-red-700 hover:bg-red-200' : 'border-red-300 text-red-600 hover:bg-red-50'"
              class="h-12 justify-center font-medium"
            >
              <Icon icon="mdi:minus-circle" class="w-5 h-5 mr-2" />
              Expense
            </Button>
            <Button
              @click="formData.type = 'income'"
              :disabled="currentMode === 'view'"
              :variant="formData.type === 'income' ? 'default' : 'outline'"
              :class="formData.type === 'income' ? 'border-green-500 bg-green-200 text-green-700 hover:bg-green-200' : 'border-green-300 text-green-600 hover:bg-green-50'"
              class="h-12 justify-center font-medium"
            >
              <Icon icon="mdi:plus-circle" class="w-5 h-5 mr-2" />
              Income
            </Button>
          </div>
        </div>

        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Input
            id="description"
            v-model="formData.description"
            placeholder="What was this transaction for?"
            :readonly="currentMode === 'view'"
            required
          />
        </div>

        <div class="grid gap-2">
          <Label for="amount">Amount</Label>
          <Input
            id="amount"
            v-model="formData.amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            :readonly="currentMode === 'view'"
            required
          />
        </div>

        <div v-if="!categoryParam" class="grid gap-2">
          <Label for="categoryId">Category</Label>
          <Select v-model="formData.categoryId" :disabled="currentMode === 'view'" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="category in categoriesStore.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-else class="grid gap-2">
          <Label>Category</Label>
          <div class="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
            {{ categoryParam.name }}
          </div>
          <Input
            v-model="formData.categoryId"
            :value="categoryParam.id"
            type="hidden"
          />
        </div>

        <div class="grid gap-2">
          <Label for="date">Date</Label>
          <Input
            id="date"
            v-model="formData.date"
            type="date"
            :readonly="currentMode === 'view'"
            required
          />
        </div>
      </div>
      <DialogFooter>
        <div v-if="currentMode === 'view'" class="w-full">
          <Button
            @click="handleEditMode"
            class="w-full"
          >
            Edit Transaction
          </Button>
        </div>
        <div v-else class="flex gap-2 w-full">
          <Button
            variant="outline"
            @click="handleCancel"
            class="flex-1"
          >
            Cancel
          </Button>
          <Button
            @click="handleSubmit"
            :disabled="!isFormValid || isSubmitting"
            class="flex-1"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Transaction' }}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
