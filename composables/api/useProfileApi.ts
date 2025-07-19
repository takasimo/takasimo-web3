import { useApi } from '~/composables/api/useApi'

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

  const updateProfile = async (userData: any) => {
  }

  const changePassword = async (passwordData: { current_password: string; new_password: string }) => {
  }

  const forgotPassword = async (email: string) => {
  }

  const resetPassword = async (resetData: { token: string; password: string }) => {
  }

  return {
    myUserInfo,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  }
}
