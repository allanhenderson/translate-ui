// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    const nuxtApp = useNuxtApp()
  
    if (!nuxtApp.$azureAuth) {
      console.error('Azure Auth not initialized')
      return navigateTo('/login')
    }
    
    try {
      const accounts = nuxtApp.$azureAuth.getAllAccounts()
      if (!accounts || accounts.length === 0) {
        return navigateTo('/login')
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      return navigateTo('/login')
    }
  })