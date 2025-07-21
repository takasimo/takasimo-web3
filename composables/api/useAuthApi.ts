import { useApi } from './useApi'

export const useAuthApi = () => {
  const { api } = useApi()

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = (await api.post('auth/login', credentials)) as any

      return response
    } catch (error) {
      console.error('login error:', error)
      throw error
    }
  }

  const register = async (formData: any) => {
    try {
      console.log('register', formData)
      const form = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      }
      const response = (await api.post('auth/register', form)) as any

      return response
    } catch (error) {
      console.error('register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('auth/logout')

      // Token'ı cookies'den kaldır
      const authCookie = useCookie('auth_token')
      authCookie.value = null

      return { success: true }
    } catch (error) {
      console.error('logout error:', error)
      // Hata olsa bile token'ı kaldır
      const authCookie = useCookie('auth_token')
      authCookie.value = null
      throw error
    }
  }

  const isAuthenticated = () => {
    const authCookie = useCookie('auth_token')
    return !!authCookie.value
  }

  return {
    login,
    register,
    logout,
    isAuthenticated
  }
}
