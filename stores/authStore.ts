export const useAuthStore = defineStore('auth', () => {
  // ✅ STATE - Reactive references
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ GETTERS - Computed properties
  const getToken = computed(() => token.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)

  // ✅ ACTIONS - Functions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (value: string | null) => {
    error.value = value
  }

  const setToken = (tokenValue: string | null) => {
    token.value = tokenValue

    // Cookie-based token management
    const authCookie = useCookie('auth_token', {
      maxAge: 60 * 60 * 24 * 30, // 30 gün (API'den gelen expires_in'e göre ayarlanır)
      httpOnly: false, // Client-side erişim için
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    if (tokenValue) {
      authCookie.value = tokenValue
    } else {
      authCookie.value = null
    }
  }

  const initializeAuth = () => {
    const authCookie = useCookie('auth_token')
    if (authCookie.value) {
      setToken(authCookie.value)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const clearAuth = () => {
    setToken(null)
    setError(null)
  }

  // ✅ RETURN - Expose state, getters, and actions
  return {
    // State
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    getToken,
    isLoading,
    getError,

    // Actions
    initializeAuth,
    setToken,
    setError,
    setLoading,
    clearError,
    clearAuth
  }
})
