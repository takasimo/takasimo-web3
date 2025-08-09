import { useProfileApi } from '~/composables/api/useProfileApi'

export const useProfileStore = defineStore('profile', () => {
  const { myUserInfo, editUser, editPassword } = useProfileApi()

  // ✅ STATE - Reactive references
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ GETTERS - Computed properties
  const getUser = computed(() => user.value)
  console.log("getUser",getUser.value)
  const isProfileLoaded = computed(() => !!user.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)

  // ✅ ACTIONS - Functions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (value: string | null) => {
    error.value = value
  }

  const setUser = (userData: any) => {
    user.value = userData
  }

  const fetchUserProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const userInfo = await myUserInfo()
      setUser(userInfo)
      return { success: true, data: userInfo }
    } catch (err: any) {
      console.error('Fetch user profile error:', err)
      setError('Kullanıcı bilgileri yüklenirken hata oluştu')
      return { success: false, error: 'Kullanıcı bilgileri yüklenirken hata oluştu' }
    } finally {
      setLoading(false)
    }
  }

  const clearProfile = () => {
    setUser(null)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const updateUserProfile = async (userData: any) => {
    setLoading(true)
    setError(null)

    try {
      const response = await editUser(userData)
      // API response'undan user data'sını extract et
      const updatedUser = response.data || response
      
      // Mevcut user ile merge et (sadece gönderilen field'lar değişsin)
      const mergedUser = { ...user.value, ...updatedUser }
      setUser(mergedUser)
      
      return { success: true, data: mergedUser }
    } catch (err: any) {
      console.error('Update user profile error:', err)
      setError('Profil güncellenirken hata oluştu')
      return { success: false, error: 'Profil güncellenirken hata oluştu' }
    } finally {
      setLoading(false)
    }
  }

  const updateUserPassword = async (passwordData: any) => {
    setLoading(true)
    setError(null)

    try {
      const result = await editPassword(passwordData)
      return { success: true, data: result }
    } catch (err: any) {
      console.error('Update password error:', err)
      setError('Şifre güncellenirken hata oluştu')
      return { success: false, error: 'Şifre güncellenirken hata oluştu' }
    } finally {
      setLoading(false)
    }
  }

  // ✅ RETURN - Expose state, getters, and actions
  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    getUser,
    isProfileLoaded,
    isLoading,
    getError,

    // Actions
    setUser,
    fetchUserProfile,
    updateUserProfile,
    updateUserPassword,
    clearProfile,
    setError,
    setLoading,
    clearError
  }
})
