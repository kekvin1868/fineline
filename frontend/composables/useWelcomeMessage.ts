export const useWelcomeMessage = () => {
  const welcomeMessages = [
    "Welcome to your financial journey! 🎉",
    "Great to have you on board! 💸",
    "Let's make your money work smarter! 📈",
    "Your financial success starts here! 🌟",
    "Ready to take control of your finances? 💪",
    "Welcome to better financial management! 🚀",
    "Time to unlock your financial potential! 💎",
    "Your journey to financial freedom begins! 🗝️",
    "Welcome to smarter spending! 🧠",
    "Let's build your financial future together! 🏗️"
  ]

  const colors = [
    'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-200',
    'from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-200',
    'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-800 dark:text-blue-200'
  ]

  const currentMessage = ref('')
  const currentColor = ref('')
  const showMessage = ref(false)
  const messageTimeout = ref<NodeJS.Timeout>()

  const getRandomMessage = (): string => {
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length)
    return welcomeMessages[randomIndex] ?? welcomeMessages[0]!
  }

  const getRandomColor = (): string => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex] ?? colors[0]!
  }

  const setWelcomeTimestamp = () => {
    if (import.meta.client) {
      localStorage.setItem('welcomeTimestamp', Date.now().toString())
    }
  }

  const getWelcomeTimestamp = (): number => {
    if (import.meta.client) {
      const timestamp = localStorage.getItem('welcomeTimestamp')
      return timestamp ? parseInt(timestamp) : 0
    }
    return 0
  }

  const clearWelcomeTimestamp = () => {
    if (import.meta.client) {
      localStorage.removeItem('welcomeTimestamp')
    }
  }

  const isWithin10Minutes = (): boolean => {
    const timestamp = getWelcomeTimestamp()
    if (!timestamp) return false
    
    const now = Date.now()
    const tenMinutes = 10 * 60 * 1000 // 10 minutes in milliseconds
    return (now - timestamp) < tenMinutes
  }

  const initializeWelcomeMessage = () => {
    if (!import.meta.client) return

    if (isWithin10Minutes()) {
      showMessage.value = true
      currentMessage.value = getRandomMessage()
      currentColor.value = getRandomColor()

      // Calculate remaining time
      const timestamp = getWelcomeTimestamp()
      const now = Date.now()
      const tenMinutes = 10 * 60 * 1000
      const remainingTime = tenMinutes - (now - timestamp)

      // Set timeout to hide message when 10 minutes expire
      messageTimeout.value = setTimeout(() => {
        showMessage.value = false
        clearWelcomeTimestamp()
      }, remainingTime)
    }
  }

  const triggerWelcomeMessage = () => {
    if (!import.meta.client) return

    setWelcomeTimestamp()
    showMessage.value = true
    currentMessage.value = getRandomMessage()
    currentColor.value = getRandomColor()

    // Clear any existing timeout
    if (messageTimeout.value) {
      clearTimeout(messageTimeout.value)
    }

    // Set timeout to hide message after 10 minutes
    messageTimeout.value = setTimeout(() => {
      showMessage.value = false
      clearWelcomeTimestamp()
    }, 10 * 60 * 1000) // 10 minutes
  }

  const refreshMessage = () => {
    if (showMessage.value && isWithin10Minutes()) {
      currentMessage.value = getRandomMessage()
      currentColor.value = getRandomColor()
    }
  }

  const hideMessage = () => {
    showMessage.value = false
    clearWelcomeTimestamp()
    if (messageTimeout.value) {
      clearTimeout(messageTimeout.value)
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (messageTimeout.value) {
      clearTimeout(messageTimeout.value)
    }
  })

  return {
    showMessage: readonly(showMessage),
    currentMessage: readonly(currentMessage),
    currentColor: readonly(currentColor),
    initializeWelcomeMessage,
    triggerWelcomeMessage,
    refreshMessage,
    hideMessage
  }
}