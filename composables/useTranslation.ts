// composables/useTranslation.ts
import type { TranslationRequest, TranslationResponse } from '~/types/api'

export const useTranslation = () => {
  const config = useRuntimeConfig()

  const translate = async (request: TranslationRequest): Promise<TranslationResponse> => {
    try {
      const response = await $fetch<TranslationResponse>('/translate', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          text: request.text,
          targetLanguage: request.targetLanguage,
          sourceLanguage: request.sourceLanguage || 'en'
        },
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        onRequest ({ options }) {
          // Handle any request preprocessing
          console.log('Making request to:', options.baseURL)
        },
        onRequestError ({ error }) {
          // Handle request errors
          console.error('Request error:', error)
          throw new Error('Failed to make translation request')
        },
        onResponse ({ response }) {
          // Handle successful responses
          console.log('Response received:', response.status)
        },
        onResponseError ({ error }) {
          // Handle response errors
          console.error('Response error:', error)
          throw new Error('Failed to translate text')
        }
      })
      return response
    } catch (error) {
      console.error('Translation error:', error)
      throw new Error('Failed to translate text')
    }
  }

  return {
    translate
  }
}
