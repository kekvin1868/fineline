<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import Sidebar from '@/layouts/sidebar.vue'
import WelcomeMessage from '@/components/WelcomeMessage.vue'

const authStore = useAuthStore()
const sidebarRef = ref()
const config = useRuntimeConfig()

const toggleSidebar = () => {
  sidebarRef.value?.toggle()
}

const switchToRealMode = () => {
  window.location.href = `${config.public.backendBaseUrl}/api/auth/login`
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Welcome Message -->
    <WelcomeMessage />
    
    <!-- Sidebar -->
    <Sidebar ref="sidebarRef" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10">
        <div class="flex h-20 items-center px-6 justify-between">
          <!-- Left: Menu Toggle -->
          <div class="flex items-center space-x-4">
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition text-gray-700 dark:text-gray-300"
            >
              <Icon icon="mdi:menu" width="24" />
            </button>
          </div>

          <!-- Right: Demo Mode + Sign Up + Theme + Logout -->
          <div class="flex items-center space-x-6">
            <Button 
              v-if="!authStore.user" 
              @click="switchToRealMode"
              size="sm"
              variant="outline"
              class="hidden sm:flex"
            >
              Sign Up
            </Button>
            <ThemeToggle />
            <button
              v-if="authStore.user"
              @click="authStore.logout"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition text-gray-700 dark:text-gray-300"
              title="Logout"
            >
              <Icon icon="mdi:logout" width="20" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
