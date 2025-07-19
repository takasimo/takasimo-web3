<script setup lang="ts">
import { useProfileStore } from '~/stores/profileStore'
import { useAuthStore } from '~/stores/authStore'
import { useAuthApi } from '~/composables/api'

const profileStore = useProfileStore()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref<string | null>(null)
const user = ref<any>(null)

// Edit dialog states
const editDialog = ref(false)
const editFieldType = ref('')
const editFieldLabel = ref('')
const editValue = ref('')
const confirmPassword = ref('')
const saving = ref(false)

// Delete dialog states
const deleteDialog = ref(false)
const deleteConfirmText = ref('')
const deleting = ref(false)

// Computed properties
const userDisplayName = computed(() => {
  if (!user.value) return 'Kullanıcı'
  
  const userData = user.value as any
  if (userData.name) return userData.name
  if (userData.full_name) return userData.full_name
  if (userData.first_name && userData.last_name) {
    return `${userData.first_name} ${userData.last_name}`
  }
  if (userData.first_name) return userData.first_name
  
  return 'Kullanıcı'
})

const isEditable = computed(() => {
  return authStore.isAuthenticated && user.value
})

const editFieldTitle = computed(() => {
  const titles: Record<string, string> = {
    name: 'İsim Düzenle',
    email: 'E-posta Düzenle',
    phone: 'Telefon Düzenle',
    password: 'Parola Değiştir'
  }
  return titles[editFieldType.value] || 'Düzenle'
})

// Methods
const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    if (!authStore.isAuthenticated) {
      throw new Error('Giriş yapmanız gerekiyor')
    }
    
    const userData = await profileStore.fetchUserProfile()
    user.value = userData.data
  } catch (err: any) {
    error.value = err.message || 'Profil yüklenirken bir hata oluştu'
    console.error('Profile load error:', err)
  } finally {
    loading.value = false
  }
}

const editField = (field: string) => {
  editFieldType.value = field
  const labels: Record<string, string> = {
    name: 'İsim',
    email: 'E-posta',
    phone: 'Telefon',
    password: 'Parola'
  }
  editFieldLabel.value = labels[field]
  
  editValue.value = user.value[field] || ''
  confirmPassword.value = ''
  editDialog.value = true
}

const saveField = async () => {
  if (!editValue.value) return
  
  if (editFieldType.value === 'password' && editValue.value !== confirmPassword.value) {
    return
  }
  
  saving.value = true
  
  try {
    // API call to update field
    console.log('Updating field:', editFieldType.value, editValue.value)
    
    // Update local user data
    user.value[editFieldType.value] = editValue.value
    
    // Refresh profile store
    await profileStore.fetchUserProfile()
    
    editDialog.value = false
    editValue.value = ''
    confirmPassword.value = ''
    
    // Show success message
    // You can add a toast notification here
  } catch (err) {
    console.error('Save field error:', err)
    error.value = 'Güncelleme sırasında bir hata oluştu'
  } finally {
    saving.value = false
  }
}

const editAvatar = () => {
  // Implement avatar upload functionality
  console.log('Edit avatar clicked')
}

const deleteAccount = () => {
  deleteDialog.value = true
  deleteConfirmText.value = ''
}

const confirmDelete = async () => {
  if (deleteConfirmText.value !== 'SİL') return
  
  deleting.value = true
  
  try {
    // API call to delete account
    console.log('Deleting account...')
    
    // Clear stores
    authStore.clearAuth()
    profileStore.clearProfile()
    
    // Navigate to home
    await navigateTo('/')
  } catch (err) {
    console.error('Delete account error:', err)
    error.value = 'Hesap silinirken bir hata oluştu'
  } finally {
    deleting.value = false
    deleteDialog.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<template>
  <v-main class="profile-page">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-10">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-grey">Profil bilgileri yükleniyor...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-10">
            <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
            <h2 class="text-h5 mb-2">Hata Oluştu</h2>
            <p class="text-grey mb-6">{{ error }}</p>
            <v-btn color="primary" @click="loadProfile" prepend-icon="mdi-refresh">
              Tekrar Dene
            </v-btn>
          </div>

          <!-- Profile Content -->
          <div v-else-if="user" class="profile-content">
            <!-- Profile Header -->
            <v-card class="profile-header mb-6" elevation="2" border>
              <v-card-text class="pa-6">
                <div class="d-flex align-center">
                  <div class="avatar-container position-relative">
                    <v-avatar size="80" color="primary" class="mr-4">
                      <v-icon v-if="!user.avatar" size="48" color="white">mdi-account</v-icon>
                      <v-img v-else :src="user.avatar" />
                    </v-avatar>
                    <v-btn
                      icon
                      size="small"
                      color="primary"
                      class="edit-avatar-btn"
                      @click="editAvatar"
                    >
                      <v-icon size="16">mdi-pencil</v-icon>
                    </v-btn>
                  </div>
                  <div class="user-info">
                    <h1 class="text-h4 font-weight-bold mb-1">
                      {{ userDisplayName }}
                    </h1>
                    <p class="text-primary text-subtitle-1 font-weight-medium">
                      Takasimo Profili
                    </p>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Account Settings -->
            <v-card class="account-settings" elevation="2" border>
              <v-card-title class="pa-6 pb-4">
                <h2 class="text-h5 font-weight-bold">Hesap Ayarları</h2>
              </v-card-title>
              
              <v-card-text class="pa-0">
                <v-list>
                  <!-- Name -->
                  <v-list-item 
                    @click="editField('name')" 
                    class="setting-item"
                    :disabled="!isEditable"
                  >
                    <template v-slot:prepend>
                      <div class="icon-container name-icon">
                        <v-icon color="white" size="20">mdi-account</v-icon>
                      </div>
                    </template>
                    <v-list-item-title class="setting-label">İsim</v-list-item-title>
                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <span class="setting-value mr-2">{{ user.name || 'Belirtilmemiş' }}</span>
                        <v-icon size="20" color="grey">mdi-chevron-right</v-icon>
                      </div>
                    </template>
                  </v-list-item>

                  <v-divider></v-divider>

                  <!-- Email -->
                  <v-list-item 
                    @click="editField('email')" 
                    class="setting-item"
                    :disabled="!isEditable"
                  >
                    <template v-slot:prepend>
                      <div class="icon-container email-icon">
                        <v-icon color="white" size="20">mdi-email</v-icon>
                      </div>
                    </template>
                    <v-list-item-title class="setting-label">E-Posta</v-list-item-title>
                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <span class="setting-value mr-2">{{ user.email || 'Belirtilmemiş' }}</span>
                        <v-icon size="20" color="grey">mdi-chevron-right</v-icon>
                      </div>
                    </template>
                  </v-list-item>

                  <v-divider></v-divider>

                  <!-- Phone -->
                  <v-list-item 
                    @click="editField('phone')" 
                    class="setting-item"
                    :disabled="!isEditable"
                  >
                    <template v-slot:prepend>
                      <div class="icon-container phone-icon">
                        <v-icon color="white" size="20">mdi-phone</v-icon>
                      </div>
                    </template>
                    <v-list-item-title class="setting-label">Telefon</v-list-item-title>
                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <span class="setting-value mr-2">{{ user.phone || 'Belirtilmemiş' }}</span>
                        <v-icon size="20" color="grey">mdi-chevron-right</v-icon>
                      </div>
                    </template>
                  </v-list-item>

                  <v-divider></v-divider>

                  <!-- Password -->
                  <v-list-item 
                    @click="editField('password')" 
                    class="setting-item"
                    :disabled="!isEditable"
                  >
                    <template v-slot:prepend>
                      <div class="icon-container password-icon">
                        <v-icon color="white" size="20">mdi-lock</v-icon>
                      </div>
                    </template>
                    <v-list-item-title class="setting-label">Parola</v-list-item-title>
                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <span class="setting-value mr-2">••••••••</span>
                        <v-icon size="20" color="grey">mdi-chevron-right</v-icon>
                      </div>
                    </template>
                  </v-list-item>

                  <v-divider></v-divider>

                  <!-- Delete Account -->
                  <v-list-item 
                    @click="deleteAccount" 
                    class="setting-item delete-item"
                    :disabled="!isEditable"
                  >
                    <template v-slot:prepend>
                      <div class="icon-container delete-icon">
                        <v-icon color="white" size="20">mdi-delete</v-icon>
                      </div>
                    </template>
                    <div>
                      <v-list-item-title class="setting-label text-error">Hesabımı Sil</v-list-item-title>
                      <v-list-item-subtitle class="text-grey text-caption">
                        Hesabınızı kalıcı olarak silin
                      </v-list-item-subtitle>
                    </div>
                    <template v-slot:append>
                      <v-icon size="20" color="error">mdi-chevron-right</v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title class="pa-6 pb-4">
          <h3 class="text-h6 font-weight-semibold">{{ editFieldTitle }}</h3>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-form @submit.prevent="saveField">
            <v-text-field
              v-if="editFieldType !== 'password'"
              v-model="editValue"
              :label="editFieldLabel"
              :type="editFieldType === 'email' ? 'email' : 'text'"
              variant="outlined"
              required
              autofocus
            />
            
            <v-text-field
              v-if="editFieldType === 'password'"
              v-model="editValue"
              label="Yeni Parola"
              type="password"
              variant="outlined"
              required
              autofocus
            />
            
            <v-text-field
              v-if="editFieldType === 'password'"
              v-model="confirmPassword"
              label="Parolayı Tekrarla"
              type="password"
              variant="outlined"
              required
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="editDialog = false">İptal</v-btn>
          <v-btn 
            color="primary" 
            @click="saveField"
            :loading="saving"
            :disabled="!editValue || (editFieldType === 'password' && editValue !== confirmPassword)"
          >
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-6 pb-4 text-error">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Hesabı Sil
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <p class="text-body-1 mb-4">
            Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
          <v-text-field
            v-model="deleteConfirmText"
            label="'SİL' yazarak onaylayın"
            variant="outlined"
            required
          />
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">İptal</v-btn>
          <v-btn 
            color="error" 
            @click="confirmDelete"
            :disabled="deleteConfirmText !== 'SİL'"
            :loading="deleting"
          >
            Hesabı Sil
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<style scoped>
.profile-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.profile-header {
  border-radius: 16px;
  background: white;
}

.avatar-container {
  position: relative;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.account-settings {
  border-radius: 16px;
  background: white;
}

.setting-item {
  padding: 16px 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.setting-item:hover {
  background-color: #f8f9fa;
}

.setting-item:not(:disabled):hover {
  background-color: #f8f9fa;
}

.setting-label {
  font-weight: 600;
  color: #1a1a1a;
}

.setting-value {
  color: #666;
  font-weight: 500;
}

.icon-container {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.name-icon {
  background: linear-gradient(135deg, #8B2865, #7a1f54);
}

.email-icon {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.phone-icon {
  background: linear-gradient(135deg, #4CAF50, #388E3C);
}

.password-icon {
  background: linear-gradient(135deg, #FF9800, #F57C00);
}

.delete-icon {
  background: linear-gradient(135deg, #F44336, #D32F2F);
}

.delete-item:hover {
  background-color: #ffebee !important;
}

.delete-item .setting-label {
  color: #d32f2f;
}

/* Responsive Design */
@media (max-width: 960px) {
  .profile-header .v-card-text {
    padding: 20px;
  }
  
  .setting-item {
    padding: 12px 20px;
  }
  
  .user-info h1 {
    font-size: 1.75rem;
  }
}

@media (max-width: 600px) {
  .profile-header .v-card-text {
    padding: 16px;
  }
  
  .setting-item {
    padding: 10px 16px;
  }
  
  .user-info h1 {
    font-size: 1.5rem;
  }
  
  .icon-container {
    width: 36px;
    height: 36px;
  }
}
</style>