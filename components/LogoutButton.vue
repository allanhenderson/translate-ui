<!-- components/LogoutButton.vue -->
<template>
    <button
      @click="handleLogout"
      :disabled="isLoading"
      class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      <span v-if="isLoading">Logging out...</span>
      <span v-else>Logout</span>
    </button>
  </template>
  
  <script setup>
  const nuxtApp = useNuxtApp()
  const router = useRouter()
  const isLoading = ref(false)
  
  const handleLogout = async () => {
    if (!nuxtApp.$azureAuth) {
      console.error('Auth service not initialized')
      return
    }
  
    isLoading.value = true
    
    try {
      await nuxtApp.$azureAuth.logout()
      // Optionally clear any local storage or state
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }
  </script>