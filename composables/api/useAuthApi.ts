import { useApi } from '~/composables/api/useApi'

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

  const register = async (userData: any) => {
    try {
      const response = (await api.post('auth/register', userData)) as any
      
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

  const myUserInfo = async () => {
    try {
      const response = await api.get('auth/me')
      return response
    } catch (error) {
      console.error('getCurrentUser error:', error)
      throw error
    }
  }

  const updateProfile = async (userData: any) => {
  }

  const changePassword = async (passwordData: { current_password: string; new_password: string }) => {
  }

  const forgotPassword = async (email: string) => {

  }

  const resetPassword = async (resetData: { token: string; password: string }) => {
  }

  const isAuthenticated = () => {
    const authCookie = useCookie('auth_token')
    return !!authCookie.value
  }

  return {
    login,
    register,
    logout,
    myUserInfo,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated
  }
}
