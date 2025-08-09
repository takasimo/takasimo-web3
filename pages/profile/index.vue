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
            <v-btn variant="outlined" class="update-btn" @click="updateEmail">Güncelle</v-btn>
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
            <v-btn variant="outlined" class="update-btn" @click="updateName">Güncelle</v-btn>
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
            <v-btn variant="outlined" class="update-btn" @click="viewAccountDetails">Detaylar</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div v-else class="no-data-state">
      <v-alert type="info"> Profil bilgileri yüklenemedi. Lütfen sayfayı yenileyin. </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '~/utils/getImageUrl'

const profileStore = useProfileStore()

// Reactive computed properties from store
const user = computed(() => profileStore.getUser)
const isLoading = computed(() => profileStore.isLoading)
const error = computed(() => profileStore.getError)

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

// Action functions
const updateEmail = () => {
  console.log('Update email clicked')
  // TODO: Open email update modal or navigate to email update page
}

const updatePhone = () => {
  console.log('Update phone clicked')
  // TODO: Open phone update modal or navigate to phone update page
}

const manageSocialAccounts = () => {
  console.log('Manage social accounts clicked')
  // TODO: Open social accounts management modal
}

const updateName = () => {
  console.log('Update name clicked')
  // TODO: Open name update modal or navigate to name update page
}

const updatePhoto = () => {
  console.log('Update photo clicked')
  // TODO: Open photo upload modal
}

const viewAccountDetails = () => {
  console.log('View account details clicked')
  // TODO: Open detailed account information modal
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
</style>
