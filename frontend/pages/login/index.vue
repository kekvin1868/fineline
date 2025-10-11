<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const loading = ref(false)
const error = ref('')

const config = useRuntimeConfig();
const baseUrl = config.public.backendBaseUrl;

const handleLogin = () => {
  loading.value = true;
  error.value = '';
  window.location.href = `${baseUrl}/api/auth/login`;
};

// Demo mode toggle
const isDemoMode = ref(false)

const enterDemoMode = () => {
  isDemoMode.value = true
  navigateTo('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md space-y-6">
      <div class="flex flex-col items-center text-center space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Welcome to Fineline</h1>
        <p class="text-muted-foreground">Track your finances with ease</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Sign in to your account or try our demo
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Real Login Button -->
          <Button 
            @click="handleLogin" 
            :disabled="loading"
            class="w-full"
          >
            {{ loading ? 'Redirecting...' : 'Login with Authentik' }}
          </Button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <Separator class="w-full" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <!-- Demo Mode Button -->
          <Button 
            @click="enterDemoMode"
            variant="outline"
            class="w-full"
          >
            Try Demo Mode
          </Button>

          <p class="text-xs text-center text-muted-foreground">
            Demo mode lets you test all features with sample data
          </p>
        </CardContent>
      </Card>

      <!-- Error Message -->
      <Card v-if="error" class="border-destructive">
        <CardContent class="pt-6">
          <p class="text-sm text-destructive">{{ error }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
