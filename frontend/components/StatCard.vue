<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/vue'

export interface StatCardProps {
  title: string
  value: string | number
  icon: string
  valueColor?: string
  clickable?: boolean
  isActive?: boolean
  subtitle?: string
}

const props = withDefaults(defineProps<StatCardProps>(), {
  valueColor: 'text-black dark:text-white',
  clickable: false,
  isActive: false
});

const emit = defineEmits<{
  click: []
}>();

const handleClick = () => {
  if (props.clickable) {
    emit('click');
  }
}
</script>

<template>
  <Card
    :class="[
      clickable
        ? 'cursor-pointer transition-all hover:border-blue-400 dark:hover:border-blue-600 hover-shadow-md'
        : '',
      isActive
        ? 'border-blue-500 dark:border-blue-500 shadow-md ring-2 ring-blue-500 ring-opacity-50'
        : ''
    ]"
    @click="handleClick"
  >
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle class="text-base font-semibold select-none">{{ title }}</CardTitle>
      <Icon :icon="icon" width="24" class="text-muted-foreground" />
    </CardHeader>
    <CardContent class="pt-2">
      <div class="text-3xl font-bold select-none" :class="valueColor">
        {{ value }}
      </div>
      <p v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ subtitle }}
      </p>
    </CardContent>
  </Card>
</template>
