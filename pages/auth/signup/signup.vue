<template>
  <v-main class="signup-page">
    <v-card class="signup-modal-card">
      <v-btn icon class="close-btn" @click="handleClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-text>
        <div class="text-center mb-4">
          <div class="signup-title">Hesap Aç</div>
        </div>
        <v-form ref="formRef" autocomplete="off">
          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            autocomplete="email"
            class="mb-2"
            color="#8B2865"
            label="E-posta adresi"
            prepend-inner-icon="mdi-email"
            variant="underlined"
          />
          <v-text-field
            v-model="form.name"
            :rules="nameRules"
            autocomplete="name"
            class="mb-2"
            color="#8B2865"
            label="Ad Soyad"
            prepend-inner-icon="mdi-account"
            variant="underlined"
          />
          <v-text-field
            v-model="form.password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="mb-2"
            color="#8B2865"
            label="Parola"
            prepend-inner-icon="mdi-lock"
            variant="underlined"
            @click:append-inner="togglePasswordVisibility"
          />
          
          <!-- Şifre Uzunluk Göstergesi -->
          <div v-if="form.password" class="password-strength mb-3">
            <div class="strength-title">Şifre Gereksinimi:</div>
            <div class="strength-rules">
              <div :class="['rule-item', passwordValidation.minLength ? 'valid' : 'invalid']">
                <v-icon :color="passwordValidation.minLength ? 'green' : 'red'" size="16">
                  {{ passwordValidation.minLength ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
                <span>En az 8 karakter ({{ form.password.length }}/8)</span>
              </div>
            </div>
          </div>

          <v-text-field
            v-model="form.password_confirmation"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="password_confirmationRules"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="mb-2"
            color="#8B2865"
            label="Parola doğrula"
            prepend-inner-icon="mdi-lock"
            variant="underlined"
            @click:append-inner="togglePasswordVisibility"
          />
          <div class="mb-1 agreement-section">
            <v-checkbox
              v-model="form.acceptTerms"
              :rules="termsRules"
              class="agreement-checkbox"
              color="#8B2865"
              density="compact"
              hide-details
            />
            <label class="agreement-label" @click="form.acceptTerms = !form.acceptTerms">
               <a href="#" class="terms-link">Üyelik Sözleşmesi </a>ve <a href="#" class="terms-link">Eklerini</a> Kabul Ediyorum
            </label>
          </div>
          
          <div class="mb-4 marketing-section">
            <v-checkbox
              v-model="form.acceptMarketing"
              class="marketing-checkbox"
              color="#8B2865"
              density="compact"
              hide-details
            />
            <label class="marketing-label" @click="form.acceptMarketing = !form.acceptMarketing">
              İletişim bilgilerimi takasimo tarafından düzenlenen kampanyalar, özel teklifler, promosyonlar ve diğer pazarlama içerikleri hakkında bilgilendirilmek üzere kullanılmasına izin veriyorum
            </label>
          </div>
          <v-btn 
            :disabled="!isFormValid"
            :loading="loading"
            block 
            class="signup-btn mb-2" 
            color="#8B2865" 
            rounded="xl" 
            size="large" 
            @click="handleSignup"
          > 
            Hesap Aç
          </v-btn>
        </v-form>
        <div class="text-center mb-2" @click="navigateTo('login')">
          <span>Hesabın var mı? <a class="login-link" href="#" @click.prevent="navigateTo('/login')">Giriş Yap</a></span>
        </div>
        <div class="divider-row">
          <div class="divider"></div>
          <span class="divider-text">veya</span>
          <div class="divider"></div>
        </div>
        <v-btn block class="google-btn mb-2" color="#8B2865" variant="outlined">
          <v-avatar class="mr-2" color="#eee" size="24">
            <v-icon color="#8B2865">mdi-google</v-icon>
          </v-avatar>
        </v-btn>
        <div class="signup-terms mt-2">
          Google ile bir sonraki adıma geçmeniz halinde
          <a class="terms-link" href="#">Bireysel Hesap Sözleşmesi ve Ekleri</a>'ni kabul etmiş sayılırsınız.
        </div>
        <div class="signup-terms mt-2">
          Bir hesap oluşturarak veya giriş yaparak,
          <a class="terms-link" href="#">Kullanım Koşullarını</a> ve <a class="terms-link" href="#">Gizlilik Politikasını</a> kabul etmiş
          olursunuz.
        </div>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts" setup>
import { navigateTo } from 'nuxt/app'
import { useAuthApi } from "~/composables/api"

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const authStore = useAuthStore()
const profileStore = useProfileStore()

// Form verileri
const form = ref({
  email: '',
  name: '',
  password: '',
  password_confirmation: '',
  acceptTerms: false,
  acceptMarketing: false
})

// Tek şifre görünürlük durumu - her iki alan için ortak
const showPassword = ref(false)

// Şifre doğrulama kuralları (sadece uzunluk)
const passwordValidation = computed(() => {
  const password = form.value.password
  return {
    minLength: password.length >= 8
  }
})

// Form geçerliliği kontrolü
const isFormValid = computed(() => {
  const validation = passwordValidation.value
  return form.value.email && 
         form.value.name && 
         form.value.password && 
         form.value.password_confirmation &&
         form.value.password === form.value.password_confirmation &&
         validation.minLength &&
         form.value.acceptTerms
})

// Validasyon kuralları
const emailRules = [
  (v: string) => !!v || 'E-posta adresi gerekli',
  (v: string) => /.+@.+\..+/.test(v) || 'Geçerli bir e-posta adresi girin'
]

const nameRules = [
  (v: string) => !!v || 'Ad Soyad gerekli',
  (v: string) => v.length >= 2 || 'En az 2 karakter olmalı'
]

const passwordRules = [
  (v: string) => !!v || 'Parola gerekli',
  (v: string) => v.length >= 8 || 'En az 8 karakter olmalı'
]

const password_confirmationRules = [
  (v: string) => !!v || 'Parola doğrulaması gerekli',
  (v: string) => v === form.value.password || 'Parolalar eşleşmiyor'
]

const termsRules = [
  (v: boolean) => !!v || 'Üyelik sözleşmesini kabul etmelisiniz'
]

// Şifre görünürlüğünü toggle eden fonksiyon
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleClose = () => {
  router.push('/')
}

const handleSignup = async () => {
  loading.value = true
  
  try {
    // Form validasyonu
    const { valid } = await formRef.value.validate()
    
    if (!valid) {
      loading.value = false
      return
    }
    
    // API çağrısı burada yapılacak
    const response=useAuthApi().register(form.value)
    console.log("response register",response)
    // Auth store'u güncelle
    if (response.access_token) {
      authStore.setToken(response.access_token)

      // Kullanıcı bilgilerini profile store'a yükle
      try {
        await profileStore.fetchUserProfile()
        console.log("user info al", profileStore.getUser)
      } catch (profileError) {
        console.error('Profile info error:', profileError)
        // Profile bilgisi alınamazsa bile login başarılı sayılır
      }
    }

    console.log('Kayıt formu:', form.value)
    
    // Başarılı kayıt sonrası yönlendirme
    // navigateTo('/login')
    
  } catch (error) {
    console.error('Kayıt hatası:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped src="./signup.scss" />
<style scoped>
.password-strength {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e9ecef;
}

.strength-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
}

.strength-rules {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  transition: color 0.3s ease;
}

.rule-item.valid {
  color: #28a745;
}

.rule-item.invalid {
  color: #dc3545;
}

.signup-btn:disabled {
  opacity: 0.6 !important;
}

/* Checkbox ve Label Stilleri */
.agreement-section,
.marketing-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.agreement-checkbox,
.marketing-checkbox {
  flex-shrink: 0;
  margin-top: -4px;
}

.agreement-label,
.marketing-label {
  font-size: 12px;
  line-height: 1.4;
  color: #666;
  cursor: pointer;
  user-select: none;
}

.agreement-label:hover,
.marketing-label:hover {
  color: #333;
}

.terms-link {
  color: #8B2865;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}
</style>
