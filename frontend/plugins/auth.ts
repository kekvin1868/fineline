/**
 * Auth initialization plugin
 * Checks authentication on app startup and migrates data if needed
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  const categoriesStore = useCategoriesStore()
  const transactionsStore = useTransactionsStore()
  const { switchToRealMode } = useDataMigration()

  // Check if user is authenticated on app startup
  await authStore.checkAuth()

  if (authStore.isAuthenticated) {
    categoriesStore.setDemoMode(false)
    transactionsStore.setDemoMode(false)

    console.log('User is authenticated on app startup. Switching to real mode...')
    await switchToRealMode()
  } else {
    console.log('User is not authenticated. Staying in demo mode.')
  }
})
