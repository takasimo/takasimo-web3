import { useApi } from './useApi'

export const useProfileApi = () => {
  const { api } = useApi()

  const myUserInfo = async () => {
    try {
      // POST metodu ile kullanıcı bilgilerini al (API POST ile çalışıyor)
      const response = await api.post('auth/me')
      return response
    } catch (error) {
      console.error('getCurrentUser error:', error)
      throw error
    }
  }

  const editUser = async (payload: any) => {
    try {
      const response = await api.put('/auth/user', payload)
      return response.data
    } catch (error) {
      console.error('editUser error:', error)
      throw error
    }
  }

  const editPassword = async (payload: any) => {
    try {
      const response = await api.put('/auth/password', payload)
      return response.data
    } catch (error) {
      console.error('editPassword error:', error)
      throw error
    }
  }

  const updateProfile = async (userData: any) => {
    return editUser(userData)
  }

  const changePassword = async (passwordData: { current_password: string; new_password: string }) => {
    return editPassword(passwordData)
  }

  const forgotPassword = async (email: string) => {
  }

  const resetPassword = async (resetData: { token: string; password: string }) => {
  }

  return {
    myUserInfo,
    editUser,
    editPassword,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  }
}
