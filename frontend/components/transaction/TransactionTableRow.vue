<script setup lang="ts">
import type { Transaction } from '@/stores/transactions'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'
import { formatIDR } from '@/lib/utils'
import TransactionDialog from '~/components/transaction/TransactionDialog.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

defineProps<{
  transaction: Transaction
}>();

const emit = defineEmits<{
  'transaction-updated': []
  'delete': [id: string]
}>();
</script>

<template>
  <div class="grid grid-cols-6 gap-6 py-4 border-b hover:bg-muted/50 transition-colors select-none">
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
        :variant="Number(transaction.amount) >= 0 ? 'outline' : 'destructive'"
        :class="[
          'capitalize text-sm px-3 py-1 font-medium',
          Number(transaction.amount) >= 0 ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' : ''
        ]"
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
      {{ formatIDR(Number(transaction.amount), true) }}
    </div>
    <div class="flex items-center justify-center">
      <div class="grid grid-cols-2 gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <!-- Edit -->
        <TransactionDialog
          mode="edit"
          :transaction="transaction"
          trigger-text=""
          trigger-icon="mdi:pencil"
          trigger-variant="ghost"
          trigger-size="sm"
          trigger-class="w-8 h-8 p-0 hover:bg-green-100 hover:text-green-600"
          @transaction-updated="emit('transaction-updated')"
        />
        
        <!-- Delete -->
        <ConfirmationDialog
          title="Delete Transaction"
          description="Are you sure you want to delete this transaction? This will be permanently removed from records."
          confirm-text="Delete"
          cancel-text="Cancel"
          trigger-icon="mdi:delete"
          trigger-variant="ghost"
          trigger-size="sm"
          trigger-class="w-8 h-8 p-0 hover:bg-red-100 hover:text-red-600"
          @confirm="emit('delete', transaction.id)"
        />
      </div>
    </div>
  </div>
</template>