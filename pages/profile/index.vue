<template>
  <div class="profile-content">
    <div v-if="isLoading" class="loading-state">
      <v-progress-circular indeterminate color="primary" />
      <p>Profil bilgileri yükleniyor...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <v-alert type="error" class="mb-4">
        {{ error }}
      </v-alert>
      <v-btn @click="loadProfile" color="primary">Tekrar Dene</v-btn>
    </div>

    <div v-else-if="user">
      <h2>Hesap Bilgileri</h2>

      <!-- E-Posta Kartı -->
      <v-card class="info-card">
        <v-card-text>
          <div class="info-item">
            <div class="info-details">
              <h3>E-Posta</h3>
              <p>{{ user.email }}</p>
              <div class="verification-status">
                <v-chip v-if="user.email_verified_at" color="success" size="x-small" prepend-icon="mdi-check-circle"> Doğrulanmış </v-chip>
                <v-chip v-else color="warning" size="x-small" prepend-icon="mdi-alert-circle"> Doğrulanmamış </v-chip>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Telefon Kartı -->
      <v-card class="info-card">
        <v-card-text>
          <div class="info-item">
            <div class="info-details">
              <h3>Telefon</h3>
              <p>{{ formatPhone(user.phone) }}</p>
              <div class="verification-status">
                <v-chip v-if="user.phone_verified_at" color="success" size="x-small" prepend-icon="mdi-check-circle"> Doğrulanmış </v-chip>
                <v-chip v-else color="warning" size="x-small" prepend-icon="mdi-alert-circle"> Doğrulanmamış </v-chip>
              </div>
            </div>
            <v-btn variant="outlined" class="update-btn" @click="updatePhone">Güncelle</v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Sosyal Medya Bağlantıları Kartı -->
      <v-card class="info-card">
        <v-card-text>
          <div class="info-item">
            <div class="info-details">
              <h3>Sosyal Medya Bağlantıları</h3>
              <div class="social-accounts">
                <v-chip v-if="user.google_id" color="primary" size="small" prepend-icon="mdi-google" class="mr-2 mb-1"> Google </v-chip>
                <span v-if="!user.google_id" class="no-social">Bağlı hesap yok</span>
              </div>
            </div>
            <v-btn variant="outlined" class="update-btn" @click="manageSocialAccounts">Yönet</v-btn>
          </div>
        </v-card-text>
      </v-card>

      <h2 class="section-title">Profiliniz</h2>

              <!-- İsminiz Kartı -->
        <v-card class="info-card">
          <v-card-text>
            <div class="info-item">
              <div class="info-details">
                <h3>İsminiz</h3>
                <p>{{ user.name }}</p>
              </div>
              <v-btn variant="outlined" class="update-btn" @click="openNameModal">Güncelle</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Şifre Kartı -->
        <v-card class="info-card">
          <v-card-text>
            <div class="info-item">
              <div class="info-details">
                <h3>Şifre</h3>
                <p>••••••••</p>
              </div>
              <v-btn variant="outlined" class="update-btn" @click="openPasswordModal">Güncelle</v-btn>
            </div>
          </v-card-text>
        </v-card>

      <!-- Profil Resminiz Kartı -->
      <v-card class="info-card">
        <v-card-text>
          <div class="info-item">
            <div class="info-details">
              <h3>Profil Resminiz</h3>
              <div class="profile-photo-section">
                <v-avatar v-if="user.photo" size="60" class="mb-2">
                  <img :src="getImageUrl({path:user.photo, provider:'cdn'})" :alt="user.name" />
                </v-avatar>
                <v-avatar v-else size="60" color="grey-lighten-2" class="mb-2">
                  <v-icon size="30">mdi-account</v-icon>
                </v-avatar>
                <p v-if="!user.photo" class="no-photo">Profil fotoğrafı yok</p>
              </div>
            </div>
            <v-btn variant="outlined" class="update-btn" @click="updatePhoto">
              {{ user.photo ? 'Değiştir' : 'Ekle' }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Hesap Bilgileri Kartı -->
      <v-card class="info-card">
        <v-card-text>
          <div class="info-item">
            <div class="info-details">
              <h3>Hesap Bilgileri</h3>
              <div class="account-details">
                <p><strong>Oluşturulma:</strong> {{ formatDate(user.created_at) }}</p>
                <p><strong>Son Güncelleme:</strong> {{ formatDate(user.updated_at) }}</p>
                <div class="account-status">
                  <v-chip
                    :color="user.is_deleted ? 'error' : 'success'"
                    size="small"
                    :prepend-icon="user.is_deleted ? 'mdi-account-cancel' : 'mdi-account-check'"
                  >
                    {{ user.is_deleted ? 'Silinmiş' : 'Aktif' }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div v-else class="no-data-state">
      <v-alert type="info"> Profil bilgileri yüklenemedi. Lütfen sayfayı yenileyin. </v-alert>
    </div>

    <!-- İsim Güncelleme Modalı -->
    <v-dialog v-model="nameModalOpen" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h5">İsim Güncelle</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nameForm.name"
                  label="Ad Soyad"
                  variant="outlined"
                  :rules="nameRules"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeNameModal">
            İptal
          </v-btn>
          <v-btn 
            color="primary" 
            :loading="isLoading"
            :disabled="!isNameFormValid || isLoading"
            @click="updateName"
          >
            Güncelle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Şifre Güncelleme Modalı -->
    <Teleport to="body">
      <v-dialog 
        v-model="passwordModalOpen" 
        max-width="500"
        persistent
        no-click-animation
        eager
        :z-index="9999"
      >
        <v-card class="password-modal-card">
        <v-card-title>
          <span class="text-h5">Mevcut Parola</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="passwordForm.current_password"
                  label="Lütfen mevcut parolanızı giriniz."
                  :type="showCurrentPassword ? 'text' : 'password'"
                  variant="outlined"
                  :rules="currentPasswordRules"
                  required
                  :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showCurrentPassword = !showCurrentPassword"
                />
              </v-col>
            </v-row>
            
            <div class="mt-4">
              <h3 class="text-h6 mb-3">Parola</h3>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="passwordForm.new_password"
                    label="••••••"
                    :type="showNewPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="newPasswordRules"
                    required
                    :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showNewPassword = !showNewPassword"
                  />
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="passwordForm.new_password_confirmation"
                    label="Yeni parola tekrar"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="confirmPasswordRules"
                    required
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  />
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closePasswordModal">
            İptal
          </v-btn>
          <v-btn 
            color="primary" 
            :loading="isLoading"
            :disabled="!isPasswordFormValid || isLoading"
            @click="updatePassword"
            class="update-password-btn"
          >
            Güncelle
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '~/utils/getImageUrl'

const profileStore = useProfileStore()

// Reactive computed properties from store
const user = computed(() => profileStore.getUser)
const isLoading = computed(() => profileStore.isLoading)
const error = computed(() => profileStore.getError)

// Modal states
const nameModalOpen = ref(false)
const passwordModalOpen = ref(false)

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const nameForm = ref({
  name: ''
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Ad soyad gereklidir',
  (v: string) => v?.length >= 2 || 'Ad soyad en az 2 karakter olmalıdır'
]

const currentPasswordRules = [
  (v: string) => !!v || 'Mevcut şifre gereklidir',
  (v: string) => v?.length >= 6 || 'Şifre en az 6 karakter olmalıdır'
]

const newPasswordRules = [
  (v: string) => !!v || 'Yeni şifre gereklidir',
  (v: string) => v?.length >= 6 || 'Şifre en az 6 karakter olmalıdır'
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Şifre tekrarı gereklidir',
  (v: string) => v === passwordForm.value.new_password || 'Şifreler eşleşmiyor'
]

// Form validation computed properties
const isNameFormValid = computed(() => {
  const name = nameForm.value.name?.trim()
  return name && name.length >= 2
})

const isPasswordFormValid = computed(() => {
  const current = passwordForm.value.current_password?.trim()
  const newPass = passwordForm.value.new_password?.trim()
  const confirm = passwordForm.value.new_password_confirmation?.trim()
  
  return current && 
         newPass && 
         confirm &&
         current.length >= 6 &&
         newPass.length >= 6 &&
         newPass === confirm
})

// Load profile on component mount
onMounted(async () => {
  if (!user.value) {
    await loadProfile()
  }
})

// Load profile function
const loadProfile = async () => {
  try {
    await profileStore.fetchUserProfile()
  } catch (err) {
    console.error('Profile load error:', err)
  }
}

// Format functions
const formatPhone = (phone: string) => {
  if (!phone) return 'Telefon numarası yok'
  // Format: +90 545 363 21 25
  if (phone.startsWith('90')) {
    phone = phone.substring(2)
  }
  if (phone.length === 10) {
    return `+90 ${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 8)} ${phone.substring(8)}`
  }
  return phone
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Bilinmiyor'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Geçersiz tarih'
  }
}

// Modal functions
const openNameModal = () => {
  nameForm.value.name = user.value?.name || ''
  nameModalOpen.value = true
}

const closeNameModal = () => {
  nameModalOpen.value = false
  nameForm.value.name = ''
}

const openPasswordModal = () => {
  console.log('Password modal açılıyor...')
  
  // Form'u temizle
  passwordForm.value = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }
  
  // Visibility state'lerini sıfırla
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  
  // Modal'ı aç
  passwordModalOpen.value = true
  
  // Debug bilgileri
  nextTick(() => {
    console.log('Password modal açıldı:', {
      modalOpen: passwordModalOpen.value,
      isPasswordFormValid: isPasswordFormValid.value,
      isLoading: isLoading.value,
      passwordForm: passwordForm.value,
      domElement: document.querySelector('.password-modal-card')
    })
  })
}

const closePasswordModal = () => {
  passwordModalOpen.value = false
  passwordForm.value = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }
}

// Update functions
const updateName = async () => {
  if (!isNameFormValid.value) return

  try {
    const result = await profileStore.updateUserProfile({
      name: nameForm.value.name.trim()
    })

    if (result.success) {
      closeNameModal()
      // Show success message
      console.log('İsim başarıyla güncellendi:', result.data)
      
      // Force refresh profile data to ensure UI is updated
      await nextTick()
    } else {
      console.error('İsim güncelleme hatası:', result.error)
    }
  } catch (error) {
    console.error('İsim güncelleme hatası:', error)
  }
}

const updatePassword = async () => {
  if (!isPasswordFormValid.value) return

  try {
    const result = await profileStore.updateUserPassword({
      current_password: passwordForm.value.current_password.trim(),
      new_password: passwordForm.value.new_password.trim(),
      new_password_confirmation: passwordForm.value.new_password_confirmation.trim()
    })

    if (result.success) {
      closePasswordModal()
      // Show success message
      console.log('Şifre başarıyla güncellendi')
    } else {
      console.error('Şifre güncelleme hatası:', result.error)
    }
  } catch (error) {
    console.error('Şifre güncelleme hatası:', error)
  }
}

const updatePhone = () => {
  console.log('Update phone clicked')
  // TODO: Open phone update modal or navigate to phone update page
}

const manageSocialAccounts = () => {
  console.log('Manage social accounts clicked')
  // TODO: Open social accounts management modal
}

const updatePhoto = () => {
  console.log('Update photo clicked')
  // TODO: Open photo upload modal
}

</script>

<style scoped>
.profile-content {
  padding: 0;
  max-width: 800px;
}

.profile-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-title {
  margin: 2rem 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.info-card {
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.info-card .v-card-text {
  padding: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.info-details {
  flex: 1;
}

.info-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.info-details p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.update-btn {
  margin-left: 1rem;
  color: #333 !important;
  border-color: #d1d5db !important;
  background-color: white !important;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  text-transform: none;
}

.update-btn:hover {
  background-color: #f9fafb !important;
  border-color: #9ca3af !important;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-state p {
  margin-top: 1rem;
  color: #666;
}

/* Error state */
.error-state {
  padding: 2rem;
  text-align: center;
}

/* No data state */
.no-data-state {
  padding: 2rem;
}

/* Verification status */
.verification-status {
  margin-top: 0.5rem;
}

/* Social accounts */
.social-accounts {
  margin-top: 0.25rem;
}

.no-social {
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
}

/* User code styling */
.user-code {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  word-break: break-all;
}

/* Profile photo section */
.profile-photo-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.no-photo {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
}

/* Account details */
.account-details p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.account-status {
  margin-top: 0.5rem;
}

/* Button disabled state */
.update-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .update-btn {
    margin-left: 0;
    align-self: flex-end;
  }

  .info-card .v-card-text {
    padding: 1rem;
  }

  .profile-photo-section {
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .user-code {
    font-size: 0.75rem;
  }
}

/* Modal Styles */
.update-password-btn {
  background: linear-gradient(45deg, #9c27b0, #673ab7) !important;
  color: white !important;
  text-transform: none;
  font-weight: 500;
}

.update-password-btn:hover {
  box-shadow: 0 4px 8px rgba(156, 39, 176, 0.4) !important;
}

/* Modal override for consistent styling */
:deep(.v-dialog .v-card) {
  border-radius: 12px !important;
  position: relative !important;
  z-index: 10000 !important;
}

:deep(.v-dialog .v-card-title) {
  padding: 1.5rem 1.5rem 1rem 1.5rem !important;
  font-weight: 600 !important;
}

:deep(.v-dialog .v-card-text) {
  padding: 0 1.5rem 1rem 1.5rem !important;
}

:deep(.v-dialog .v-card-actions) {
  padding: 1rem 1.5rem 1.5rem 1.5rem !important;
}

/* Text field styling in modals */
:deep(.v-dialog .v-text-field) {
  margin-bottom: 1rem;
}

:deep(.v-dialog .v-text-field .v-field) {
  border-radius: 8px !important;
}

/* Password modal specific styling */
.password-modal-card {
  pointer-events: auto !important;
  position: relative !important;
  z-index: 10001 !important;
  opacity: 1 !important;
  transform: none !important;
  user-select: auto !important;
}

.password-modal-card * {
  pointer-events: auto !important;
}

/* Overlay fix */
:deep(.v-overlay) {
  z-index: 9998 !important;
}

:deep(.v-overlay__content) {
  z-index: 9999 !important;
  pointer-events: auto !important;
}

/* Dialog container fix */
:deep(.v-dialog) {
  z-index: 10000 !important;
  pointer-events: auto !important;
}

/* Ensure all interactive elements work */
:deep(.v-dialog .v-btn) {
  pointer-events: auto !important;
  z-index: 10002 !important;
}

:deep(.v-dialog .v-text-field) {
  pointer-events: auto !important;
}

:deep(.v-dialog .v-text-field .v-field__input) {
  pointer-events: auto !important;
}

:deep(.v-dialog .v-text-field .v-field__append-inner) {
  pointer-events: auto !important;
  z-index: 10003 !important;
}
</style>
