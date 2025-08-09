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

  // IBAN API functions
  const getBankAccounts = async () => {
    try {
      const response = await api.get('/bank-accounts')
      return response.data
    } catch (error) {
      console.error('getBankAccounts error:', error)
      throw error
    }
  }

  const createBankAccount = async (payload: any) => {
    try {
      const response = await api.post('/bank-accounts', payload)
      return response.data
    } catch (error) {
      console.error('createBankAccount error:', error)
      throw error
    }
  }

  const updateBankAccount = async (bankAccountCode: string, payload: any) => {
    try {
      // hasBankInfo kontrolü ile conditional API call
      const response = await api.put(`/bank-accounts/${bankAccountCode}`, payload)
      return response.data
    } catch (error) {
      console.error('updateBankAccount error:', error)
      throw error
    }
  }

  const deleteBankAccount = async (bankAccountCode: string) => {
    try {
      const response = await api.delete(`/bank-accounts/${bankAccountCode}`)
      return response.data
    } catch (error) {
      console.error('deleteBankAccount error:', error)
      throw error
    }
  }

  return {
    myUserInfo,
    editUser,
    editPassword,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    getBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
  }
}
