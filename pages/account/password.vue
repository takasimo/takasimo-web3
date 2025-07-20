<template>
  <div class="account-password">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Şifre Değiştir</h1>
      <p class="text-grey text-body-1">
        Hesabınızın güvenliği için güçlü bir şifre kullanın
      </p>
    </div>

    <v-card class="password-form-card" elevation="2" border>
      <v-card-text class="pa-6">
        <v-form @submit.prevent="changePassword" ref="passwordForm">
          <v-row>
            <v-col cols="12" md="8" lg="6">
              <!-- Mevcut Şifre -->
              <v-text-field
                v-model="form.currentPassword"
                label="Mevcut Şifre"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :rules="[rules.required]"
                required
                class="mb-4"
              />

              <!-- Yeni Şifre -->
              <v-text-field
                v-model="form.newPassword"
                label="Yeni Şifre"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-plus"
                :rules="[rules.required, rules.minLength]"
                required
                class="mb-4"
              />

              <!-- Şifre Tekrarı -->
              <v-text-field
                v-model="form.confirmPassword"
                label="Yeni Şifre Tekrarı"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-check"
                :rules="[rules.required, rules.passwordMatch]"
                required
                class="mb-6"
              />

              <!-- Şifre Güvenlik İpuçları -->
              <v-card class="security-tips" variant="outlined" color="info">
                <v-card-text class="pa-4">
                  <h3 class="text-h6 font-weight-semibold mb-3">
                    <v-icon color="info" class="mr-2">mdi-shield-check</v-icon>
                    Güçlü Şifre İpuçları
                  </h3>
                  <ul class="text-body-2">
                    <li>En az 8 karakter uzunluğunda olmalı</li>
                    <li>Büyük ve küçük harfler içermeli</li>
                    <li>Rakam ve özel karakterler ekleyin</li>
                    <li>Kişisel bilgilerinizi kullanmayın</li>
                    <li>Farklı hesaplar için farklı şifreler kullanın</li>
                  </ul>
                </v-card-text>
              </v-card>

              <!-- Butonlar -->
              <div class="d-flex gap-4 mt-6">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  :loading="loading"
                  :disabled="!isFormValid"
                  prepend-icon="mdi-check"
                >
                  Şifreyi Değiştir
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="large"
                  @click="resetForm"
                  :disabled="loading"
                >
                  Sıfırla
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
const passwordForm = ref(null)
const loading = ref(false)

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  required: (value) => !!value || 'Bu alan zorunludur',
  minLength: (value) => value.length >= 8 || 'Şifre en az 8 karakter olmalıdır',
  passwordMatch: (value) => value === form.value.newPassword || 'Şifreler eşleşmiyor'
}

const isFormValid = computed(() => {
  return form.value.currentPassword && 
         form.value.newPassword && 
         form.value.confirmPassword &&
         form.value.newPassword === form.value.confirmPassword &&
         form.value.newPassword.length >= 8
})

const changePassword = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  
  try {
    // API call to change password
    console.log('Changing password...', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Success message
    console.log('Password changed successfully')
    
    // Reset form
    resetForm()
    
  } catch (error) {
    console.error('Password change error:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  if (passwordForm.value) {
    passwordForm.value.reset()
  }
}
</script>

<style scoped>
.account-password {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.password-form-card {
  border-radius: 16px;
  background: white;
}

.security-tips {
  border-radius: 12px;
  border-color: #e3f2fd;
}

.security-tips ul {
  margin: 0;
  padding-left: 20px;
}

.security-tips li {
  margin-bottom: 8px;
  color: #424242;
}

.security-tips li:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .password-form-card .v-card-text {
    padding: 16px;
  }
}
</style> 