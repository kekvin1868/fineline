<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 -translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-4 scale-95"
  >
    <div
      v-if="showMessage"
      :class="`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-auto px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm border border-white/30 bg-gradient-to-r ${currentColor} transition-all duration-500`"
    >
      <div class="flex items-center justify-between">
        <p class="font-medium text-sm sm:text-base">
          {{ currentMessage }}
        </p>
        <button
          @click="hideMessage"
          class="ml-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close welcome message"
        >
          <Icon icon="mdi:close" width="16" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { 
  showMessage, 
  currentMessage, 
  currentColor, 
  initializeWelcomeMessage, 
  refreshMessage, 
  hideMessage 
} = useWelcomeMessage()

// Initialize on mount
onMounted(() => {
  initializeWelcomeMessage()
})

// Refresh message on route changes
const route = useRoute()
watch(() => route.path, () => {
  refreshMessage()
})
</script>