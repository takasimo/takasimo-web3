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
        <v-form>
          <v-text-field
            v-model="form.email"
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="E-posta adresi"
            prepend-inner-icon="mdi-email"
            variant="underlined"
          />
          <v-text-field
            v-model="form.fullName"
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="Ad Soyad"
            prepend-inner-icon="mdi-account"
            variant="underlined"
          />
          <v-text-field
            v-model="form.password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="Parola"
            prepend-inner-icon="mdi-lock"
            variant="underlined"
            @click:append-inner="togglePasswordVisibility"
          />
          <v-text-field
            v-model="form.confirmPassword"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="Parola doğrula"
            prepend-inner-icon="mdi-lock"
            variant="underlined"
            @click:append-inner="togglePasswordVisibility"
          />
          <v-checkbox
            v-model="form.acceptTerms"
            class="mb-1 agreement-checkbox"
            color="#8B2865"
            density="compact"
            hide-details
            label='Üyelik Sözleşmesi ve <a href="#" class="terms-link">Eklerini</a> Kabul Ediyorum'
            required
          />
          <v-checkbox
            v-model="form.acceptMarketing"
            class="mb-4"
            color="#8B2865"
            density="compact"
            hide-details
            label="İletişim bilgilerimi takasimo tarafından düzenlenen kampanyalar, özel teklifler, promosyonlar ve diğer pazarlama içerikleri hakkında bilgilendirilmek üzere kullanılmasına izin veriyorum"
          />
          <v-btn block class="signup-btn mb-2" color="#8B2865" rounded="xl" size="large" @click="handleSignup"> Hesap Aç</v-btn>
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

const router = useRouter()

// Form verileri
const form = ref({
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  acceptMarketing: false
})

// Tek şifre görünürlük durumu - her iki alan için ortak
const showPassword = ref(false)

// Şifre görünürlüğünü toggle eden fonksiyon
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleClose = () => {
  router.push('/')
}

const handleSignup = () => {
  // Form validasyonu
  if (!form.value.email || !form.value.fullName || !form.value.password || !form.value.confirmPassword) {
    alert('Lütfen tüm alanları doldurunuz.')
    return
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    alert('Şifreler eşleşmiyor!')
    return
  }
  
  if (!form.value.acceptTerms) {
    alert('Lütfen üyelik sözleşmesini kabul ediniz.')
    return
  }
  
  // API çağrısı burada yapılacak
  console.log('Kayıt formu:', form.value)
}
</script>

<style scoped src="./signup.scss" />
