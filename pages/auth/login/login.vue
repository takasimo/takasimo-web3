<template>
  <v-main class="login-page">
    <v-container fluid class="login-container">
      <v-row justify="center" align="center" class="login-row">
        <v-col cols="12" sm="8" md="6" lg="5" xl="4">
          <v-card class="login-modal-card">
            <v-btn icon class="close-btn" @click="handleClose">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-text class="login-card-content">
              <div class="text-center mb-6">
                <div class="login-logo">takasimo</div>
                <div class="login-title">Giriş Yap</div>
              </div>
              
              <v-form @submit.prevent="handleLogin" ref="loginForm">
                <v-text-field
                  v-model="formData.email"
                  label="E-posta"
                  prepend-inner-icon="mdi-email"
                  variant="underlined"
                  class="mb-4 email-field"
                  color="#8B2865"
                  :rules="emailRules"
                  type="email"
                  autocomplete="email"
                  required
                  hide-details="auto"
                />
                
                <v-text-field
                  v-model="formData.password"
                  label="Şifre"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="togglePassword"
                  variant="underlined"
                  class="mb-4 password-field"
                  color="#8B2865"
                  :rules="passwordRules"
                  autocomplete="current-password"
                  required
                  hide-details="auto"
                />
                
                <div class="d-flex justify-space-between align-center mb-4">
                  <v-checkbox 
                    v-model="formData.rememberMe"
                    label="Beni hatırla" 
                    hide-details 
                    density="compact" 
                    class="remember-checkbox" 
                    color="#8B2865" 
                  />
                  <a href="#" class="forgot-link">Şifremi unuttum</a>
                </div>
                
                <v-btn 
                  block 
                  color="#8B2865" 
                  class="login-btn mb-4" 
                  size="large" 
                  rounded="xl"
                  type="submit"
                  :loading="isLoading"
                  :disabled="isLoading"
                > 
                  {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş yap' }}
                </v-btn>
              </v-form>
              
              <div class="text-center mb-4">
                <span class="register-text">
                  Hesabın yok mu? 
                  <a href="#" class="register-link" @click.prevent="navigateTo('/signup')">Hesap aç</a>
                </span>
              </div>
              
              <div class="divider-row">
                <div class="divider"></div>
                <span class="divider-text">veya</span>
                <div class="divider"></div>
              </div>
              
              <div class="social-buttons">
                <v-btn 
                  block 
                  variant="outlined" 
                  class="social-btn google-btn mb-3" 
                  @click="handleGoogleLogin"
                  :loading="isGoogleLoading"
                  :disabled="isGoogleLoading"
                >
                  <img src="/assets/auth/google.svg" alt="Google" class="social-icon" />
                  <span>Google ile giriş yap</span>
                </v-btn>
                
                <v-btn 
                  block 
                  variant="outlined" 
                  class="social-btn facebook-btn mb-3" 
                  @click="handleFacebookLogin"
                  :loading="isFacebookLoading"
                  :disabled="isFacebookLoading"
                >
                  <img src="/assets/auth/facebook.svg" alt="Facebook" class="social-icon" />
                  <span>Facebook ile giriş yap</span>
                </v-btn>
                
                <v-btn 
                  block 
                  variant="outlined" 
                  class="social-btn apple-btn mb-3" 
                  @click="handleAppleLogin"
                  :loading="isAppleLoading"
                  :disabled="isAppleLoading"
                >
                  <img src="/assets/auth/apple.svg" alt="Apple" class="social-icon" />
                  <span>Apple ile giriş yap</span>
                </v-btn>
              </div>
              
              <div class="login-terms">
                Google veya Apple kimliğinizle bir sonraki adıma geçmeniz halinde 
                <a href="#" class="terms-link">Bireysel Hesap Sözleşmesi ve Eklerini</a> kabul etmiş sayılırsınız.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
const router = useRouter()
import { navigateTo } from 'nuxt/app'
import { useAuthApi } from "~/composables/api/useAuthApi"

// Auth store
const authStore = useAuthStore()
// Form referansı
const loginForm = ref()

// Loading durumları
const isLoading = computed(()=>authStore.isLoading)
const isGoogleLoading = ref(false)
const isFacebookLoading = ref(false)
const isAppleLoading = ref(false)

// Şifre görünürlük durumu
const showPassword = ref(false)

// Form verileri
const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

// Form validasyon kuralları
const emailRules = [
  (v: string) => !!v || 'E-posta adresi gerekli',
  (v: string) => /.+@.+\..+/.test(v) || 'Geçerli bir e-posta adresi girin'
]

const passwordRules = [
  (v: string) => !!v || 'Şifre gerekli',
  (v: string) => v.length >= 6 || 'Şifre en az 6 karakter olmalı'
]

// Şifre görünürlüğünü değiştir
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Login işlemi
const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  
  if (!valid) return

  authStore.setLoading(true)
  authStore.setError(null)
  
  try {
    const response = await useAuthApi().login(formData.value)

    // Auth store'u güncelle
    if (response.access_token) {
      authStore.setToken(response.access_token)

      console.log("user info al")
    }
    
    // Başarılı login sonrası yönlendirme
    await router.push('/')
  } catch (error) {
    console.error('Login error:', error)
    // Hata durumunda kullanıcıya bilgi ver
    authStore.setError('Giriş yapılırken hata oluştu')
  } finally {
    authStore.setLoading(false)
  }
}

// Google login işlemi
const handleGoogleLogin = async () => {
  isGoogleLoading.value = true
  
  try {
    // Google login API çağrısı burada yapılacak
    console.log('Google login attempt')
    
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Başarılı login sonrası yönlendirme
    await router.push('/')
  } catch (error) {
    console.error('Google login error:', error)
  } finally {
    isGoogleLoading.value = false
  }
}

// Facebook login işlemi
const handleFacebookLogin = async () => {
  isFacebookLoading.value = true
  
  try {
    // Facebook login API çağrısı burada yapılacak
    console.log('Facebook login attempt')
    
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Başarılı login sonrası yönlendirme
    await router.push('/')
  } catch (error) {
    console.error('Facebook login error:', error)
  } finally {
    isFacebookLoading.value = false
  }
}

// Apple login işlemi
const handleAppleLogin = async () => {
  isAppleLoading.value = true
  
  try {
    // Apple login API çağrısı burada yapılacak
    console.log('Apple login attempt')
    
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Başarılı login sonrası yönlendirme
    await router.push('/')
  } catch (error) {
    console.error('Apple login error:', error)
  } finally {
    isAppleLoading.value = false
  }
}

const handleClose = () => {
  router.push('/')
}
</script>

<style scoped src="./login.scss" />
