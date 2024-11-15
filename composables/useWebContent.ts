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

  const fetchUrlContent = async (url: string, options: FetchOptions = { preserveFormatting: true }) => {
    try {
      // Validate URL format before making request
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Only HTTP and HTTPS protocols are supported')
      }

      // Using useFetch composable
      const { data, error } = await useFetch(`${config.public.apiBase}/fetch-content`, {
        method: 'POST',
        body: {
          url,
          preserveFormatting: options.preserveFormatting
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (error.value) {
        throw new Error(error.value.message || 'Failed to fetch content')
      }

      if (!data.value) {
        throw new Error('No data received from server')
      }

      return {
        content: data.value.content || '',
        title: data.value.title || '',
        metadata: {
          wordCount: data.value.metadata?.wordCount || 0,
          paragraphCount: data.value.metadata?.paragraphCount || 0,
          hasImages: data.value.metadata?.hasImages || false
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error)
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
            throw new Error(`Failed to fetch website content: ${error.message}`)
        }
      }
      throw new Error('An unexpected error occurred')
    }
  }

  return {
    fetchUrlContent
  }
}
