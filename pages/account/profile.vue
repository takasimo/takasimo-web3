<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { useProfileStore } from '~/stores/profileStore'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const profileFormRef = ref(null)
const fileInput = ref(null)
const showDeleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const deleteConfirmation = ref('')
const profileImage = ref('')

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  bio: ''
})

const rules = {
  required: (value) => !!value || 'Bu alan zorunludur',
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Geçerli bir e-posta adresi girin'
  },
  phone: (value) => {
    const pattern = /^[0-9+\-\s()]+$/
    return pattern.test(value) || 'Geçerli bir telefon numarası girin'
  },
  deleteConfirmation: (value) => value === 'HESABIMI SİL' || 'Onay metnini doğru yazın'
}

// Load profile data
onMounted(() => {
  loadProfileData()
})

const loadProfileData = () => {
  // Load from store or API
  const user = profileStore.user
  if (user) {
    profileForm.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      birthDate: user.birthDate || '',
      bio: user.bio || ''
    }
    profileImage.value = user.profileImage || ''
  }
}

const saveProfile = async () => {
  if (!profileFormRef.value?.validate()) return
  
  saving.value = true
  
  try {
    // API call to save profile
    console.log('Saving profile...', profileForm.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update store
    profileStore.updateProfile(profileForm.value)
    
    console.log('Profile saved successfully')
    
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  loadProfileData()
  if (profileFormRef.value) {
    profileFormRef.value.reset()
  }
}

const selectImage = () => {
  fileInput.value?.click()
}

const onImageSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır.')
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Upload to server
    uploadImage(file)
  }
}

const uploadImage = async (file) => {
  try {
    console.log('Uploading image...', file.name)
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Image uploaded successfully')
    
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

const logout = () => {
  authStore.logout()
  navigateTo('/login')
}

const deleteAccount = async () => {
  if (deleteConfirmation.value !== 'HESABIMI SİL') return
  
  deleting.value = true
  
  try {
    console.log('Deleting account...')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Logout and redirect
    authStore.logout()
    navigateTo('/')
    
  } catch (error) {
    console.error('Error deleting account:', error)
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
  }
}
</script>

<template>
  <div class="account-profile">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Kişisel Bilgiler</h1>
      <p class="text-grey text-body-1">
        Profil bilgilerinizi güncelleyin ve yönetin
      </p>
    </div>

    <v-row>
      <!-- Profil Bilgileri -->
      <v-col cols="12" md="8" class="mb-6">
        <v-card class="profile-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-account-edit</v-icon>
              <h3 class="text-h6 font-weight-semibold">Profil Bilgileri</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <v-form @submit.prevent="saveProfile" ref="profileFormRef">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profileForm.firstName"
                    label="Ad"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profileForm.lastName"
                    label="Soyad"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model="profileForm.email"
                    label="E-posta"
                    variant="outlined"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    required
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profileForm.phone"
                    label="Telefon"
                    variant="outlined"
                    :rules="[rules.required, rules.phone]"
                    required
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profileForm.birthDate"
                    label="Doğum Tarihi"
                    variant="outlined"
                    type="date"
                  />
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="profileForm.bio"
                    label="Hakkımda"
                    variant="outlined"
                    rows="3"
                    placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                  />
                </v-col>
              </v-row>
              
              <v-divider class="my-6"></v-divider>
              
              <div class="d-flex gap-4">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  :loading="saving"
                  prepend-icon="mdi-content-save"
                >
                  Değişiklikleri Kaydet
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="large"
                  @click="resetForm"
                  :disabled="saving"
                >
                  Sıfırla
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Profil Fotoğrafı -->
      <v-col cols="12" md="4" class="mb-6">
        <v-card class="photo-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-camera</v-icon>
              <h3 class="text-h6 font-weight-semibold">Profil Fotoğrafı</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div class="text-center">
              <v-avatar
                :image="profileImage"
                size="150"
                class="mb-4"
              >
                <v-icon size="64" color="grey">mdi-account</v-icon>
              </v-avatar>
              
              <div class="mb-4">
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-camera"
                  @click="selectImage"
                >
                  Fotoğraf Seç
                </v-btn>
              </div>
              
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onImageSelected"
              />
              
              <p class="text-body-2 text-grey">
                JPG, PNG veya GIF formatında, maksimum 5MB
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Hesap Silme -->
      <v-col cols="12">
        <v-card class="danger-card" elevation="2" border color="error">
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="error" size="24" class="mr-3">mdi-alert-circle</v-icon>
              <h3 class="text-h6 font-weight-semibold text-error">Tehlikeli Bölge</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <v-alert
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              Bu işlemler geri alınamaz! Dikkatli olun.
            </v-alert>
            
            <div class="d-flex gap-4">
              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-delete"
                @click="showDeleteDialog = true"
              >
                Hesabı Sil
              </v-btn>
              
              <v-btn
                color="warning"
                variant="outlined"
                prepend-icon="mdi-logout"
                @click="logout"
              >
                Çıkış Yap
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Hesap Silme Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="pa-6 pb-4">
          <h3 class="text-h6 font-weight-semibold text-error">Hesabı Sil</h3>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-alert
            type="error"
            variant="tonal"
            class="mb-4"
          >
            Bu işlem geri alınamaz! Tüm verileriniz kalıcı olarak silinecektir.
          </v-alert>
          
          <p class="text-body-1 mb-4">
            Hesabınızı silmek için aşağıdaki metni yazın:
          </p>
          
          <div class="text-body-2 font-weight-medium text-grey mb-4">
            "HESABIMI SİL"
          </div>
          
          <v-text-field
            v-model="deleteConfirmation"
            label="Onay metni"
            variant="outlined"
            placeholder="HESABIMI SİL"
            :rules="[rules.deleteConfirmation]"
          />
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="showDeleteDialog = false"
          >
            İptal
          </v-btn>
          <v-btn
            color="error"
            @click="deleteAccount"
            :disabled="deleteConfirmation !== 'HESABIMI SİL'"
            :loading="deleting"
          >
            Hesabı Kalıcı Olarak Sil
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.account-profile {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.profile-card,
.photo-card,
.danger-card {
  border-radius: 16px;
  background: white;
}

.danger-card {
  border-color: #f44336;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .profile-card,
  .photo-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .profile-card .v-card-text,
  .photo-card .v-card-text,
  .danger-card .v-card-text {
    padding: 16px;
  }
  
  .profile-card .v-card-title,
  .photo-card .v-card-title,
  .danger-card .v-card-title {
    padding: 16px;
  }
}
</style>