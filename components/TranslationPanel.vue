<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-xl shadow-xl p-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Source Input -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-lg font-semibold text-gray-700">
                English Text
              </label>
              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {{ sourceText.length }} characters
              </span>
            </div>
            <textarea
              v-model="sourceText"
              rows="12"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-700 font-medium resize-none transition duration-200 ease-in-out hover:border-indigo-300"
              placeholder="Paste text to translate..."
              :disabled="isLoading"
            />
          </div>

          <!-- Translation Output -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <label class="text-lg font-semibold text-gray-700">
                  Translation
                </label>
                <select
                  v-model="targetLanguage"
                  class="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-600 text-sm font-medium hover:border-indigo-300 transition duration-200 ease-in-out"
                  :disabled="isLoading"
                >
                  <option value="nl" selected>Dutch</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <button
                @click="handleTranslate"
                :disabled="isLoading || !sourceText.trim()"
                class="inline-flex items-center px-6 py-2.5 rounded-lg text-white font-medium transition duration-200 ease-in-out transform hover:scale-105"
                :class="[
                  isLoading || !sourceText.trim()
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                ]"
              >
                <template v-if="isLoading">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Translating...
                </template>
                <template v-else>
                  Translate
                </template>
              </button>
            </div>
            <textarea
              v-model="translatedText"
              rows="12"
              readonly
              class="w-full rounded-lg bg-gray-50 border-gray-200 shadow-inner text-gray-700 font-medium resize-none"
              placeholder="Translation will appear here..."
            />
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center space-x-2"
        >
          <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-red-600 font-medium">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sourceText = ref('')
const translatedText = ref('')
const targetLanguage = ref('es')
const isLoading = ref(false)
const error = ref<string | null>(null)

const { translate } = useTranslation()

const handleTranslate = async () => {
  if (!sourceText.value.trim()) return

  isLoading.value = true
  error.value = null

  try {
    const result = await translate({
      text: sourceText.value,
      targetLanguage: targetLanguage.value
    })
    translatedText.value = result.translatedText
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to translate text'
  } finally {
    isLoading.value = false
  }
}
</script>
