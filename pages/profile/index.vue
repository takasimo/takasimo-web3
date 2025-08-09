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
    <NameUpdateModal 
      v-model="nameModalOpen"
      :current-name="user?.name"
      @success="handleNameSuccess"
      @error="handleNameError"
    />

    <!-- Şifre Güncelleme Modalı -->
    <PasswordUpdateModal 
      v-model="passwordModalOpen"
      :loading="isLoading"
      @update="handlePasswordUpdate"
    />

    <!-- Telefon Güncelleme Modalı -->
    <PhoneUpdateModal 
      v-model="phoneModalOpen"
      :current-phone="user?.phone"
      @success="handlePhoneSuccess"
      @error="handlePhoneError"
    />

    <!-- Bildirim Snackbar -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      :timeout="4000"
      location="top"
      rounded
    >
      {{ notification.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="notification.show = false"
        >
          Kapat
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '~/utils/getImageUrl'
import { useProfileApi } from '~/composables/api/useProfileApi'
import NameUpdateModal from './components/index/NameUpdateModal.vue'
import PasswordUpdateModal from './components/index/PasswordUpdateModal.vue'
import PhoneUpdateModal from './components/index/PhoneUpdateModal.vue'

const profileStore = useProfileStore()

// Reactive computed properties from store
const user = computed(() => profileStore.getUser)
const isLoading = computed(() => profileStore.isLoading)
const error = computed(() => profileStore.getError)

// Modal states
const nameModalOpen = ref(false)
const passwordModalOpen = ref(false)
const phoneModalOpen = ref(false)

// Phone loading state is now handled inside the modal

// Notification state
const notification = ref({
  show: false,
  message: '',
  color: 'success'
})

// Notification helper function
const showNotification = (message: string, color: 'success' | 'error' | 'warning' = 'success') => {
  notification.value = {
    show: true,
    message,
    color
  }
}

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

// Modal handler functions
const openNameModal = () => {
  nameModalOpen.value = true
}

const openPasswordModal = () => {
  passwordModalOpen.value = true
}

const openPhoneModal = () => {
  phoneModalOpen.value = true
}

// Component event handlers
const handleNameSuccess = async () => {
  nameModalOpen.value = false
  showNotification('İsim başarıyla güncellendi', 'success')
  await profileStore.fetchUserProfile()
}

const handleNameError = (message: string) => {
  showNotification(message, 'error')
}

const handlePasswordUpdate = async (passwordData: {
  current_password: string
  new_password: string
  new_password_confirmation: string
}) => {
  try {
    const result = await profileStore.updateUserPassword(passwordData)

    if (result.success) {
      passwordModalOpen.value = false
      console.log('Şifre başarıyla güncellendi')
    } else {
      console.error('Şifre güncelleme hatası:', result.error)
    }
  } catch (error) {
    console.error('Şifre güncelleme hatası:', error)
  }
}

const handlePhoneSuccess = async (message: string) => {
  console.log('✅ Phone modal success:', message)
  showNotification(message, 'success')
  
  // User bilgilerini yenile
  try {
    await profileStore.fetchUserProfile()
    console.log('✅ User profile refreshed')
  } catch (error) {
    console.error('Profile refresh error:', error)
  }
}

const handlePhoneError = (message: string) => {
  console.error('❌ Phone modal error:', message)
  showNotification(message, 'error')
}

const updatePhone = () => {
  openPhoneModal()
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
  margin-bottom: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f8fafc;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;
}

.info-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: #f1f5f9;
}

.info-card .v-card-text {
  padding: 0;
  position: relative;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  position: relative;
}

.info-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #8B2865;
  opacity: 0.3;
}

.info-details {
  flex: 1;
}

.info-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
  letter-spacing: -0.01em;
}

.info-details p {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 400;
}

.update-btn {
  margin-left: 1rem;
  color: #8B2865 !important;
  border: 1px solid #e5e7eb !important;
  background: #ffffff !important;
  padding: 0.6rem 1.2rem !important;
  font-size: 0.85rem !important;
  font-weight: 500 !important;
  text-transform: none !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  letter-spacing: 0 !important;
  box-shadow: none !important;
}

.update-btn:hover {
  background: #8B2865 !important;
  color: white !important;
  border-color: #8B2865 !important;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(139, 40, 101, 0.15) !important;
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
  margin-top: 0.75rem;
}

.verification-status :deep(.v-chip) {
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  border-radius: 6px !important;
  padding: 0 10px !important;
  font-size: 0.8rem !important;
}

/* Social accounts */
.social-accounts {
  margin-top: 0.5rem;
}

.social-accounts :deep(.v-chip) {
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  border-radius: 6px !important;
  font-size: 0.85rem !important;
}

.no-social {
  color: #64748b;
  font-size: 0.95rem;
  font-style: italic;
  font-weight: 500;
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
  gap: 0.75rem;
}

.profile-photo-section :deep(.v-avatar) {
  border: 2px solid #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.profile-photo-section :deep(.v-avatar:hover) {
  border-color: #8B2865;
  box-shadow: 0 3px 12px rgba(139, 40, 101, 0.1);
}

.no-photo {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

/* Account details */
.account-details {
  margin-top: 0.5rem;
}

.account-details p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #475569;
  font-weight: 500;
}

.account-details strong {
  color: #1e293b;
  font-weight: 700;
}

.account-status {
  margin-top: 0.75rem;
}

.account-status :deep(.v-chip) {
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  border-radius: 6px !important;
  font-size: 0.85rem !important;
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

/* Modal component styles are now handled in separate components */
</style>
