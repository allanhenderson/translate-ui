<!-- components/TranslationPanel.vue -->
<template>
  <div class="bg-white shadow-sm rounded-lg">
    <div class="p-6">
      <!-- URL and Controls Header -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-grow">
          <input
            v-model="url"
            type="url"
            class="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            :class="{ 'border-red-300': !isValidUrl && url }"
            placeholder="Enter website URL"
            :disabled="isLoading || isFetching"
          >
          <p v-if="!isValidUrl && url" class="mt-1 text-sm text-red-600">
            Please enter a valid HTTP or HTTPS URL
          </p>
        </div>
        <div class="flex gap-2">
          <select
            v-model="targetLanguage"
            class="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            :disabled="isLoading || isFetching"
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
            <option value="ja">
              Japanese
            </option>
            <option value="ko">
              Korean
            </option>
            <option value="zh">
              Chinese (Simplified)
            </option>
          </select>
          <button
            :disabled="isLoading || isFetching || !isValidUrl"
            class="px-4 py-2 rounded-md text-white font-medium inline-flex items-center"
            :class="[
              isLoading || isFetching || !isValidUrl
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            ]"
            @click="handleFetchAndTranslate"
          >
            <svg v-if="isLoading || isFetching" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
            {{ isLoading || isFetching ? 'Processing...' : 'Translate Page' }}
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-6 p-4 bg-red-50 rounded-md"
      >
        <p class="text-sm text-red-700">
          {{ error }}
        </p>
      </div>

      <!-- Content Container -->
      <div
        v-if="translatedContent"
        class="translated-content prose prose-sm sm:prose lg:prose-lg mx-auto"
        v-html="translatedContent"
      />

      <!-- Loading Placeholder -->
      <div v-else-if="isLoading || isFetching" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent" />
        <p class="mt-2 text-gray-600">
          {{ isFetching ? 'Fetching content...' : 'Translating...' }}
        </p>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-12 text-gray-500">
        Enter a URL above to fetch and translate the page content
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DOMPurify from 'isomorphic-dompurify'

const url = ref('')
const targetLanguage = ref('es')
const isLoading = ref(false)
const isFetching = ref(false)
const error = ref<string | null>(null)
const translatedContent = ref('')

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

const handleFetchAndTranslate = async () => {
  if (!isValidUrl.value) { return }

  error.value = null
  isFetching.value = true
  translatedContent.value = ''

  try {
    // Fetch content
    const response = await fetchUrlContent(url.value, {
      preserveFormatting: true
    })

    // Start translation
    isLoading.value = true
    isFetching.value = false

    const result = await translate({
      text: response.content,
      targetLanguage: targetLanguage.value
    })

    // Sanitize and set the translated HTML content
    translatedContent.value = DOMPurify.sanitize(result.translatedText, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to process content'
  } finally {
    isLoading.value = false
    isFetching.value = false
  }
}
</script>

<style>
.translated-content {
  /* Add any specific styling for the translated content */
  line-height: 1.6;
}

.translated-content h1,
.translated-content h2,
.translated-content h3,
.translated-content h4,
.translated-content h5,
.translated-content h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.translated-content p {
  margin-bottom: 1em;
}

.translated-content ul,
.translated-content ol {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.translated-content blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
}

.translated-content a {
  color: #3b82f6;
  text-decoration: underline;
}

.translated-content a:hover {
  color: #2563eb;
}
</style>
