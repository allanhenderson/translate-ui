// composables/useWebContent.ts

interface FetchOptions {
  preserveFormatting?: boolean;
}

interface ContentMetadata {
  wordCount: number;
  paragraphCount: number;
  hasImages: boolean;
}

interface FetchResponse {
  content: string;
  title: string;
  metadata: ContentMetadata;
}

export const useWebContent = () => {
  const config = useRuntimeConfig()
  const { $fetch } = useFetch()

  const fetchUrlContent = async (url: string, options: FetchOptions = { preserveFormatting: true }): Promise<FetchResponse> => {
    try {
      // Validate URL format before making request
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Only HTTP and HTTPS protocols are supported')
      }

      // Add retry logic with exponential backoff
      const maxRetries = 3
      let lastError: Error | null = null

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            // Wait with exponential backoff: 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          }

          const response = await $fetch<FetchResponse>('/api/fetch-content', {
            baseURL: config.public.apiBase,
            method: 'POST',
            body: {
              url,
              preserveFormatting: options.preserveFormatting
            },
            headers: {
              'Content-Type': 'application/json'
            },
            retry: false // We're handling retries manually
          })

          // Validate response structure
          if (!response || typeof response.content !== 'string') {
            throw new Error('Invalid response format from server')
          }

          return {
            content: response.content,
            title: response.title || '',
            metadata: {
              wordCount: response.metadata?.wordCount || 0,
              paragraphCount: response.metadata?.paragraphCount || 0,
              hasImages: response.metadata?.hasImages || false
            }
          }
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error occurred')

          // Don't retry on certain errors
          if (err instanceof Error && (
            err.message.includes('Invalid URL') ||
            err.message.includes('404') ||
            err.message.includes('403')
          )) {
            throw err
          }

          // If it's the last attempt, throw the error
          if (attempt === maxRetries - 1) {
            throw lastError
          }
        }
      }

      // This should never be reached due to the throw in the loop
      throw lastError || new Error('Failed to fetch content')
    } catch (error) {
      console.error('Error fetching content:', error)

      // Transform error messages to be more user-friendly
      if (error instanceof Error) {
        switch (true) {
          case error.message.includes('404'):
            throw new Error('The requested page could not be found')
          case error.message.includes('403'):
            throw new Error('Access to this page is forbidden')
          case error.message.includes('timeout'):
            throw new Error('The request timed out. Please try again')
          case error.message.includes('network'):
            throw new Error('Network error. Please check your connection')
          case error.message.includes('Invalid URL'):
            throw new Error('Please enter a valid website URL')
          default:
            throw new Error('Failed to fetch website content. Please try again')
        }
      }

      throw new Error('An unexpected error occurred')
    }
  }

  // Helper function to check if a URL is accessible
  const checkUrlAccess = async (url: string): Promise<boolean> => {
    try {
      await $fetch(url, {
        method: 'HEAD',
        timeout: 5000
      })
      return true
    } catch {
      return false
    }
  }

  // Helper function to sanitize URL
  const sanitizeUrl = (url: string): string => {
    let sanitized = url.trim()

    // Ensure URL has protocol
    if (!/^https?:\/\//i.test(sanitized)) {
      sanitized = 'https://' + sanitized
    }

    // Remove any dangerous characters
    sanitized = sanitized.replace(/[<>'"]/g, '')

    try {
      // Validate URL format
      new URL(sanitized)
      return sanitized
    } catch {
      throw new Error('Invalid URL format')
    }
  }

  // Helper function to get domain from URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return ''
    }
  }

  return {
    fetchUrlContent,
    checkUrlAccess,
    sanitizeUrl,
    getDomain
  }
}
