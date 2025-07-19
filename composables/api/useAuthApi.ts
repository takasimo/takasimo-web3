import { useApi } from '~/composables/api/useApi'

export const useAuthApi = () => {
  const { api } = useApi()

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = (await api.post('auth/login', credentials)) as any

      // Token'ı localStorage'a kaydet
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token)
      }

      return response
    } catch (error) {
      console.error('login error:', error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = (await api.post('auth/register', userData)) as any

      // Token'ı localStorage'a kaydet
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
      }

      return response
    } catch (error) {
      console.error('register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('auth/logout')

      // Token'ı localStorage'dan kaldır
      localStorage.removeItem('auth_token')

      return { success: true }
    } catch (error) {
      console.error('logout error:', error)
      // Hata olsa bile token'ı kaldır
      localStorage.removeItem('auth_token')
      throw error
    }
  }

  const myUserInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await api.get(
        'auth/me',
        {},
        {
          Authorization: `Bearer ${token}`
        }
      )

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
    if (process.client) {
      return !!localStorage.getItem('auth_token')
    }
    return false
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
