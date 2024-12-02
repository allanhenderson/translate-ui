<!-- pages/auth/callback.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <p>Authenticating...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  const nuxtApp = useNuxtApp()
  const router = useRouter()
  
  onMounted(async () => {
    try {
      if (!nuxtApp.$azureAuth) {
        console.error('Auth service not initialized')
        router.push('/login')
        return
      }
  
      // Handle the redirect and get the response
      const response = await nuxtApp.$azureAuth.msalInstance.handleRedirectPromise()
      
      if (response) {
        // Successfully logged in
        router.push('/')
      } else {
        // No response means no auth redirect was handled
        // Check if we're already logged in
        const accounts = nuxtApp.$azureAuth.getAllAccounts()
        if (accounts && accounts.length > 0) {
          router.push('/')
        } else {
          router.push('/login')
        }
      }
    } catch (err) {
      console.error('Auth callback error:', err)
      router.push('/login')
    }
  })
  </script>