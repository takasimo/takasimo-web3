import { useProfileApi } from '~/composables/api'

export const useProfileStore = defineStore('profile', () => {
  const { myUserInfo } = useProfileApi()

  // ✅ STATE - Reactive references
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ GETTERS - Computed properties
  const getUser = computed(() => user.value)
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
    clearProfile,
    setError,
    setLoading,
    clearError
  }
})
