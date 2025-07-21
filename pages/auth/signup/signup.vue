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
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="E-posta adresi"
            prepend-inner-icon="mdi-email"
            variant="underlined"
          />
          <v-text-field
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="Ad Soyad"
            prepend-inner-icon="mdi-account"
            variant="underlined"
          />
          <v-text-field
            append-inner-icon="mdi-eye-off"
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="Parola"
            prepend-inner-icon="mdi-lock"
            type="password"
            variant="underlined"
          />
          <v-text-field
            append-inner-icon="mdi-eye-off"
            autocomplete="off"
            class="mb-2"
            color="#8B2865"
            label="Parola doğrula"
            prepend-inner-icon="mdi-lock"
            type="password"
            variant="underlined"
          />
          <v-checkbox
            class="mb-1 agreement-checkbox"
            color="#8B2865"
            density="compact"
            hide-details
            label='Üyelik Sözleşmesi ve <a href="#" class="terms-link">Eklerini</a> Kabul Ediyorum'
            required
          />
          <v-checkbox
            class="mb-4"
            color="#8B2865"
            density="compact"
            hide-details
            label="İletişim bilgilerimi takasimo tarafından düzenlenen kampanyalar, özel teklifler, promosyonlar ve diğer pazarlama içerikleri hakkında bilgilendirilmek üzere kullanılmasına izin veriyorum"
          />
          <v-btn block class="signup-btn mb-2" color="#8B2865" rounded="xl" size="large"> Hesap Aç</v-btn>
        </v-form>
        <div class="text-center mb-2" @click="navigateTo('login')">
          <span>Hesabın var mı? <a class="login-link" href="#" @click.prevent="navigateTo('/login')">Giriş Yap ff</a></span>
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
// Sadece görsel amaçlı, işlevsellik eklenmedi
import { navigateTo } from 'nuxt/app'

const router = useRouter()

const handleClose = () => {
  router.push('/')
}
</script>

<style scoped src="./signup.scss" />
