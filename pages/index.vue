<script setup>
definePageMeta({
  middleware: ['auth']
})
const { $azureAuth } = useNuxtApp()

const handleLogin = async () => {
  try {
    await $azureAuth.login()
    // Handle successful login
  } catch (error) {
    // Handle error
  }
}
</script>

<template>
  <nav>
    <!-- Other nav items -->
    <LogoutButton />
  </nav>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Translation Service
        </h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <TranslationPanel />
    </main>
  </div>
</template>