<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/vue'

export interface StatCardProps {
  title: string
  value: string | number
  icon: string
  valueColor?: string
}

withDefaults(defineProps<StatCardProps>(), {
  valueColor: 'text-black dark:text-white'
});
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle class="text-base font-semibold select-none">{{ title }}</CardTitle>
      <Icon :icon="icon" width="24" class="text-muted-foreground" />
    </CardHeader>
    <CardContent class="pt-2">
      <div class="text-3xl font-bold select-none" :class="valueColor">
        {{ value }}
      </div>
    </CardContent>
  </Card>
</template>