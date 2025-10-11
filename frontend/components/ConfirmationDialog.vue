<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
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
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  triggerIcon?: string
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon'
  triggerClass?: string
}

interface Emits {
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  description: 'Are you sure you want to continue?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  triggerIcon: 'mdi:help-circle',
  triggerVariant: 'outline',
  triggerSize: 'default',
  triggerClass: ''
})

const emits = defineEmits<Emits>()

const isOpen = ref(false)

const handleConfirm = () => {
  emits('confirm')
  isOpen.value = false
}

const handleCancel = () => {
  isOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger>
      <Button 
        :variant="triggerVariant" 
        :size="triggerSize"
        :class="triggerClass"
      >
        <Icon :icon="triggerIcon" width="16" />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg flex items-center gap-3">
          <Icon icon="mdi:alert-circle" width="24" class="text-red-500" />
          {{ title }}
        </DialogTitle>
        <DialogDescription class="text-base pt-2">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button 
          variant="outline" 
          @click="handleCancel"
          class="flex-1"
        >
          {{ cancelText }}
        </Button>
        <Button 
          variant="destructive"
          @click="handleConfirm"
          class="flex-1"
        >
          {{ confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>