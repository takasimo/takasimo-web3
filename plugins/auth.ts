export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()

  // Uygulama başladığında auth durumunu kontrol et
  const authCookie = useCookie('auth_token')
  if (authCookie.value) {
    authStore.setToken(authCookie.value)
    
    // Token varsa user bilgilerini profile store'a yükle
    try {
      await profileStore.fetchUserProfile()
    } catch (error) {
      console.error('Failed to load user info on app start:', error)
      // User bilgisi yüklenemezse token'ı temizle
      authStore.clearAuth()
      profileStore.clearProfile()
    }
  }
}) 