export interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

export interface TranslationResponse {
  translatedText: string
  detectedSourceLanguage: string
  targetLanguage: string
  timestamp: string
}
