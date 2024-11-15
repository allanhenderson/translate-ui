<template>
  <div class="bg-white shadow-sm rounded-lg">
    <div class="p-6">
      <!-- URL Input -->
      <div class="mb-6">
        <label for="url" class="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <div class="mt-1 flex flex-col sm:flex-row gap-3">
          <div class="flex-1 min-w-0">
            <input
              id="url"
              v-model="url"
              type="url"
              name="url"
              class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              :class="{ 'border-red-300': !isValidUrl && url }"
              placeholder="https://example.com"
              :disabled="isLoading || isFetching"
            >
            <p v-if="!isValidUrl && url" class="mt-1 text-sm text-red-600">
              Please enter a valid HTTP or HTTPS URL
            </p>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center">
              <input
                v-model="preserveFormatting"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                :disabled="isLoading || isFetching"
              >
              <span class="ml-2 text-sm text-gray-600">Preserve formatting</span>
            </label>
            <button
              type="button"
              :disabled="isLoading || isFetching || !isValidUrl"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
              :class="[
                isLoading || isFetching || !isValidUrl
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              ]"
              @click="fetchContent"
            >
              <template v-if="isFetching">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Fetching...
              </template>
              <template v-else>
                Fetch Content
              </template>
            </button>
          </div>
        </div>
      </div>

      <!-- Content Statistics -->
      <div v-if="contentMetadata" class="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 class="text-sm font-medium text-gray-700 mb-2">
          Content Details
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <span class="font-medium">Words:</span> {{ contentMetadata.wordCount }}
          </div>
          <div>
            <span class="font-medium">Paragraphs:</span> {{ contentMetadata.paragraphCount }}
          </div>
          <div>
            <span class="font-medium">Has Images:</span> {{ contentMetadata.hasImages ? 'Yes' : 'No' }}
          </div>
          <div>
            <span class="font-medium">Title:</span> {{ contentMetadata.title || 'N/A' }}
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Source Text Panel -->
        <div class="flex-1">
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label for="source" class="block text-sm font-medium text-gray-700">
                Source Content
              </label>
              <span class="text-sm text-gray-500">
                {{ sourceText.length }} characters
              </span>
            </div>
            <textarea
              id="source"
              v-model="sourceText"
              rows="16"
              class="font-mono text-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Website content will appear here..."
              :disabled="isLoading"
            />
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-col justify-start items-center gap-4 pt-8">
          <select
            v-model="targetLanguage"
            class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            :disabled="isLoading"
          >
            <option value="es">
              Spanish
            </option>
            <option value="fr">
              French
            </option>
            <option value="de">
              German
            </option>
            <option value="it">
              Italian
            </option>
            <option value="pt">
              Portuguese
            </option>
            <option value="nl">
              Dutch
            </option>
          </select>

          <button
            :disabled="isLoading || !sourceText.trim()"
            class="px-4 py-2 rounded-md text-white font-medium w-full"
            :class="[
              isLoading || !sourceText.trim()
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            ]"
            @click="handleTranslate"
          >
            <template v-if="isLoading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Translating...
            </template>
            <template v-else>
              Translate →
            </template>
          </button>
        </div>

        <!-- Translated Text Panel -->
        <div class="flex-1">
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label for="translated" class="block text-sm font-medium text-gray-700">
                Translated Content
              </label>
              <span class="text-sm text-gray-500">
                {{ translatedText.length }} characters
              </span>
            </div>
            <textarea
              id="translated"
              v-model="translatedText"
              rows="16"
              readonly
              class="font-mono text-sm mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm"
              placeholder="Translation will appear here..."
            />
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mt-4 p-4 bg-red-50 rounded-md"
      >
        <p class="text-sm text-red-700">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TranslationResponse } from '~/types/api'

interface ContentMetadata {
  wordCount: number
  paragraphCount: number
  hasImages: boolean
  title: string
}

const url = ref('')
const sourceText = ref('')
const translatedText = ref('')
const targetLanguage = ref('es')
const isLoading = ref(false)
const isFetching = ref(false)
const error = ref<string | null>(null)
const preserveFormatting = ref(true)
const contentMetadata = ref<ContentMetadata | null>(null)

const { translate } = useTranslation()
const { fetchUrlContent } = useWebContent()

const isValidUrl = computed(() => {
  try {
    const parsedUrl = new URL(url.value)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
})

const fetchContent = async () => {
  if (!isValidUrl.value) { return }

  error.value = null
  isFetching.value = true
  contentMetadata.value = null

  try {
    const response = await fetchUrlContent(url.value, {
      preserveFormatting: preserveFormatting.value
    })

    sourceText.value = response.content
    contentMetadata.value = {
      wordCount: response.metadata.wordCount,
      paragraphCount: response.metadata.paragraphCount,
      hasImages: response.metadata.hasImages,
      title: response.title || 'N/A'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch content'
    sourceText.value = ''
  } finally {
    isFetching.value = false
  }
}

const handleTranslate = async () => {
  if (!sourceText.value.trim()) { return }

  isLoading.value = true
  error.value = null

  try {
    const result = await translate({
      text: sourceText.value,
      targetLanguage: targetLanguage.value,
      sourceLanguage: 'en'
    })
    translatedText.value = result.translatedText
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to translate content'
    translatedText.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>
