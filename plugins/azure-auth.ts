// plugins/azure-auth.ts
import { PublicClientApplication, InteractionRequiredAuthError, AccountInfo, AuthenticationResult } from '@azure/msal-browser'

interface AzureAuthService {
  msalInstance: PublicClientApplication
  login: () => Promise<AuthenticationResult>
  logout: () => void
  getToken: () => Promise<string>
  getAllAccounts: () => AccountInfo[]
}

declare module '#app' {
  interface NuxtApp {
    $azureAuth: AzureAuthService
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $azureAuth: AzureAuthService
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  
  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: config.public.azureClientId,
      authority: `https://login.microsoftonline.com/${config.public.azureTenantId}`,
      redirectUri: config.public.authRedirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  })

  // Initialize MSAL
  await msalInstance.initialize()

  const loginRequest = {
    scopes: ['User.Read']
  }

  const azureAuth: AzureAuthService = {
    msalInstance,
    async login() {
      try {
        await msalInstance.handleRedirectPromise()
        const loginResponse = await msalInstance.loginPopup(loginRequest)
        return loginResponse
      } catch (err) {
        console.error(err)
        throw err
      }
    },
    logout() {
      msalInstance.logout()
    },
    async getToken() {
      try {
        const account = msalInstance.getAllAccounts()[0]
        if (!account) {
          throw new Error('No account found')
        }
        const tokenResponse = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account
        })
        return tokenResponse.accessToken
      } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
          const response = await msalInstance.acquireTokenPopup(loginRequest)
          return response.accessToken
        }
        throw err
      }
    },
    getAllAccounts() {
      return msalInstance.getAllAccounts()
    }
  }

  // Handle redirect promise for cases where the page loads after a redirect
  await msalInstance.handleRedirectPromise()

  return {
    provide: {
      azureAuth
    }
  }
})