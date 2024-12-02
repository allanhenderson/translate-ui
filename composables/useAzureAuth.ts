import { defineNuxtPlugin } from '#app'
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser'

export default defineNuxtPlugin(() => {
  const config = {
    auth: {
      clientId: process.env.AZURE_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
      redirectUri: process.env.AUTH_REDIRECT_URI,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  }

  const msalInstance = new PublicClientApplication(config)

  const loginRequest = {
    scopes: ['User.Read']
  }

  const useAzureAuth = () => {
    const login = async () => {
      try {
        const loginResponse = await msalInstance.loginPopup(loginRequest)
        return loginResponse
      } catch (err) {
        console.error(err)
        throw err
      }
    }

    const logout = () => {
      msalInstance.logout()
    }

    const getToken = async () => {
      try {
        const account = msalInstance.getAllAccounts()[0]
        const tokenResponse = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account
        })
        return tokenResponse.accessToken
      } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
          return msalInstance.acquireTokenPopup(loginRequest)
        }
        throw err
      }
    }

    return {
      login,
      logout,
      getToken
    }
  }

  return {
    provide: {
      azureAuth: useAzureAuth()
    }
  }
})