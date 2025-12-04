<script setup lang="ts">
import { Icon } from '@iconify/vue'

const isOpen = ref(false)

// Use Nuxt 3's recommended way instead of deprecated process.client
const { $router } = useNuxtApp()

// Handle responsive behavior properly with Nuxt 3
onMounted(() => {
  // Set initial state based on screen size
  const updateSidebarState = () => {
    isOpen.value = window.innerWidth >= 1024
  }
  
  updateSidebarState()
  window.addEventListener('resize', updateSidebarState)
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateSidebarState)
  })
})

// Auto-close on mobile when route changes
const route = useRoute()
watch(() => route.path, () => {
  if (import.meta.client && typeof window !== 'undefined' && window.innerWidth < 1024) {
    isOpen.value = false
  }
})

const closeMobileNav = () => {
  if (import.meta.client && typeof window !== 'undefined' && window.innerWidth < 1024) {
    isOpen.value = false
  }
}

defineExpose({
  toggle: () => {
    isOpen.value = !isOpen.value
  }
})
</script>

<template>
  <!-- Mobile Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
      @click="isOpen = false"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide">
    <aside
      v-show="isOpen"
      class="fixed inset-y-0 left-0 w-64 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-r border-white/30 dark:border-white/10 z-50 flex flex-col shadow-2xl shadow-black/20 dark:shadow-black/40 lg:relative lg:z-auto lg:shadow-lg"
    >
      <!-- Close button (mobile only) -->
      <button
        @click="isOpen = false"
        class="absolute top-4 right-4 lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-200 border border-white/30 dark:border-white/20"
      >
        <Icon icon="mdi:close" width="20" />
      </button>

      <!-- Sidebar Content -->
      <div class="flex flex-col h-full p-6">
        <!-- Logo -->
        <div class="mb-8 pt-2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Fineline
          </h2>
        </div>

        <!-- Navigation -->
        <nav class="space-y-3 flex-1">
          <NuxtLink
            to="/dashboard"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            :class="{ 
              'bg-white/40 dark:bg-white/10 border border-black/40 dark:border-white/20 text-gray-900 dark:text-white shadow-lg backdrop-blur-sm': $route.path === '/dashboard',
              'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-white/30 dark:hover:border-white/20 hover:backdrop-blur-sm': $route.path !== '/dashboard'
            }"
            @click="closeMobileNav"
          >
            <Icon icon="mdi:view-dashboard" width="20" class="transition-transform duration-200 group-hover:scale-110" />
            <span class="font-medium">Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/categories"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            :class="{ 
              'bg-white/40 dark:bg-white/10 border border-black/40 dark:border-white/20 text-gray-900 dark:text-white shadow-lg backdrop-blur-sm': $route.path.startsWith('/categories'),
              'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-white/30 dark:hover:border-white/20 hover:backdrop-blur-sm': !$route.path.startsWith('/categories')
            }"
            @click="closeMobileNav"
          >
            <Icon icon="mdi:tag-multiple" width="20" class="transition-transform duration-200 group-hover:scale-110" />
            <span class="font-medium">Categories</span>
          </NuxtLink>
        </nav>

        <!-- Footer -->
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-auto p-3 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm border border-white/30 dark:border-white/20">
          © 2025 Fineline
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
