<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <Button @click="toggleTheme" variant="ghost" size="sm">
    <Icon 
      :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" 
      width="16" 
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>