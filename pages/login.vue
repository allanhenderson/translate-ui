<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Using your organization credentials
        </p>
      </div>
      <div class="mt-8 space-y-6">
        <button
          @click="handleLogin"
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign in with Microsoft</span>
        </button>
        <p v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const router = useRouter()

const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!nuxtApp.$azureAuth) {
    error.value = 'Authentication service not initialized'
    return
  }

  isLoading.value = true
  error.value = ''
  
  try {
    await nuxtApp.$azureAuth.login()
    router.push('/')
  } catch (err) {
    error.value = 'Failed to sign in. Please try again.'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (nuxtApp.$azureAuth) {
    try {
      const accounts = nuxtApp.$azureAuth.getAllAccounts()
      if (accounts && accounts.length > 0) {
        router.push('/')
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    }
  }
})
</script>