<template>
  <v-main class="login-page">
    <v-card class="login-modal-card">
      <v-btn icon class="close-btn" @click="handleClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-text>
        <div class="text-center mb-2">
          <span class="login-logo">takasimo</span>
          <div class="login-title">Giriş Yap</div>
        </div>
        <v-form>
          <v-text-field
            label="E-Mail"
            prepend-inner-icon="mdi-email"
            variant="underlined"
            class="mb-2"
            color="#8B2865"
            autocomplete="off"
          />
          <v-text-field
            label="Şifre"
            type="password"
            prepend-inner-icon="mdi-lock"
            append-inner-icon="mdi-eye-off"
            variant="underlined"
            class="mb-1"
            color="#8B2865"
            autocomplete="off"
          />
          <div class="d-flex justify-space-between align-center mb-2">
            <v-checkbox label="Beni hatırla" hide-details density="compact" class="remember-checkbox" color="#8B2865" />
            <a href="#" class="forgot-link">Şifremi unuttum</a>
          </div>
          <v-btn block color="#8B2865" class="login-btn mb-2" size="large" rounded="xl"> Giriş yap </v-btn>
        </v-form>
        <div class="text-center mb-2">
          <span>Hesabın yok mu? <a href="#" class="register-link" @click.prevent="navigateTo('/signup')">Hesap oluştur</a></span>
        </div>
        <div class="divider-row">
          <div class="divider"></div>
          <span class="divider-text">veya</span>
          <div class="divider"></div>
        </div>
        <v-btn block variant="outlined" class="google-btn mb-2" color="#8B2865">
          <v-avatar size="24" class="mr-2" color="#eee">
            <v-icon color="#8B2865">mdi-account</v-icon>
          </v-avatar>
          <span>Continue as oktay</span>
          <v-icon class="ml-2" color="#8B2865">mdi-google</v-icon>
        </v-btn>
        <div class="login-terms mt-2">
          Bir hesap oluşturarak veya giriş yaparak,
          <a href="#" class="terms-link">Kullanım Koşullarını</a> ve <a href="#" class="terms-link">Gizlilik Politikasını</a> kabul etmiş
          olursunuz.
        </div>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script setup lang="ts">
const router = useRouter()
import { navigateTo } from 'nuxt/app'

const handleClose = () => {
  router.push('/')
}
</script>

<style scoped src="./login.scss" />
