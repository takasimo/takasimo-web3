export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Uygulama başladığında auth durumunu kontrol et
  const authCookie = useCookie('auth_token')
  if (authCookie.value) {
    authStore.setToken(authCookie.value)
  }
}) 