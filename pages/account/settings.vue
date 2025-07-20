<template>
  <div class="account-settings">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Hesap Ayarları</h1>
      <p class="text-grey text-body-1">
        Hesabınızın genel ayarlarını yapılandırın
      </p>
    </div>

    <v-row>
      <!-- Genel Ayarlar -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="settings-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-cog</v-icon>
              <h3 class="text-h6 font-weight-semibold">Genel Ayarlar</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div class="settings-list">
              <div v-for="setting in generalSettings" :key="setting.id" class="setting-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">{{ setting.title }}</div>
                    <div class="text-body-2 text-grey">{{ setting.description }}</div>
                  </div>
                  
                  <v-switch
                    v-model="setting.enabled"
                    :color="setting.color"
                    hide-details
                    density="compact"
                  />
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Görünüm Ayarları -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="settings-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-palette</v-icon>
              <h3 class="text-h6 font-weight-semibold">Görünüm</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div class="settings-list">
              <div class="setting-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">Karanlık Mod</div>
                    <div class="text-body-2 text-grey">Karanlık tema kullan</div>
                  </div>
                  
                  <v-switch
                    v-model="appearanceSettings.darkMode"
                    color="primary"
                    hide-details
                    density="compact"
                  />
                </div>
              </div>
              
              <div class="setting-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">Dil</div>
                    <div class="text-body-2 text-grey">Uygulama dili</div>
                  </div>
                  
                  <v-select
                    v-model="appearanceSettings.language"
                    :items="languageOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 120px"
                  />
                </div>
              </div>
              
              <div class="setting-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">Para Birimi</div>
                    <div class="text-body-2 text-grey">Fiyat para birimi</div>
                  </div>
                  
                  <v-select
                    v-model="appearanceSettings.currency"
                    :items="currencyOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 120px"
                  />
                </div>
              </div>
              
              <div class="setting-item">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">Saat Dilimi</div>
                    <div class="text-body-2 text-grey">Yerel saat dilimi</div>
                  </div>
                  
                  <v-select
                    v-model="appearanceSettings.timezone"
                    :items="timezoneOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="width: 150px"
                  />
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gizlilik Ayarları -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="settings-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-shield-account</v-icon>
              <h3 class="text-h6 font-weight-semibold">Gizlilik</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div class="settings-list">
              <div v-for="setting in privacySettings" :key="setting.id" class="setting-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">{{ setting.title }}</div>
                    <div class="text-body-2 text-grey">{{ setting.description }}</div>
                  </div>
                  
                  <v-switch
                    v-model="setting.enabled"
                    :color="setting.color"
                    hide-details
                    density="compact"
                  />
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Veri Yönetimi -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="settings-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-database</v-icon>
              <h3 class="text-h6 font-weight-semibold">Veri Yönetimi</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div class="data-management">
              <div class="data-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">Verilerimi İndir</div>
                    <div class="text-body-2 text-grey">Hesap verilerinizi JSON formatında indirin</div>
                  </div>
                  
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    @click="downloadData"
                  >
                    İndir
                  </v-btn>
                </div>
              </div>
              
              <div class="data-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">Arama Geçmişini Temizle</div>
                    <div class="text-body-2 text-grey">Tüm arama geçmişinizi silin</div>
                  </div>
                  
                  <v-btn
                    color="warning"
                    variant="outlined"
                    size="small"
                    @click="clearSearchHistory"
                  >
                    Temizle
                  </v-btn>
                </div>
              </div>
              
              <div class="data-item">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">Hesabı Sil</div>
                    <div class="text-body-2 text-grey">Hesabınızı ve tüm verilerinizi kalıcı olarak silin</div>
                  </div>
                  
                  <v-btn
                    color="error"
                    variant="outlined"
                    size="small"
                    @click="showDeleteAccountDialog = true"
                  >
                    Hesabı Sil
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Kaydet Butonu -->
      <v-col cols="12">
        <v-card class="save-card" elevation="2" border>
          <v-card-text class="pa-6">
            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                size="large"
                @click="saveSettings"
                :loading="saving"
                prepend-icon="mdi-content-save"
              >
                Ayarları Kaydet
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Hesap Silme Dialog -->
    <v-dialog v-model="showDeleteAccountDialog" max-width="500px">
      <v-card>
        <v-card-title class="pa-6 pb-4">
          <h3 class="text-h6 font-weight-semibold text-error">Hesabı Sil</h3>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-alert
            type="warning"
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
            @click="showDeleteAccountDialog = false"
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

<script setup>
const saving = ref(false)
const deleting = ref(false)
const showDeleteAccountDialog = ref(false)
const deleteConfirmation = ref('')

const rules = {
  deleteConfirmation: (value) => value === 'HESABIMI SİL' || 'Onay metnini doğru yazın'
}

const generalSettings = ref([
  {
    id: 1,
    title: 'E-posta Bildirimleri',
    description: 'Önemli güncellemeler için e-posta al',
    enabled: true,
    color: 'primary'
  },
  {
    id: 2,
    title: 'SMS Bildirimleri',
    description: 'Önemli güncellemeler için SMS al',
    enabled: false,
    color: 'info'
  },
  {
    id: 3,
    title: 'Push Bildirimleri',
    description: 'Anlık bildirimler al',
    enabled: true,
    color: 'success'
  },
  {
    id: 4,
    title: 'Otomatik Giriş',
    description: 'Tarayıcıyı kapattığınızda otomatik giriş yap',
    enabled: true,
    color: 'warning'
  }
])

const appearanceSettings = ref({
  darkMode: false,
  language: 'tr',
  currency: 'TRY',
  timezone: 'Europe/Istanbul'
})

const privacySettings = ref([
  {
    id: 1,
    title: 'Profil Görünürlüğü',
    description: 'Profilinizi herkese açık yap',
    enabled: true,
    color: 'primary'
  },
  {
    id: 2,
    title: 'Arama Geçmişi',
    description: 'Arama geçmişinizi kaydet',
    enabled: false,
    color: 'warning'
  },
  {
    id: 3,
    title: 'Konum Paylaşımı',
    description: 'Konum bilgilerinizi paylaş',
    enabled: false,
    color: 'info'
  }
])

const languageOptions = [
  { title: 'Türkçe', value: 'tr' },
  { title: 'English', value: 'en' },
  { title: 'Deutsch', value: 'de' }
]

const currencyOptions = [
  { title: 'TL (₺)', value: 'TRY' },
  { title: 'USD ($)', value: 'USD' },
  { title: 'EUR (€)', value: 'EUR' }
]

const timezoneOptions = [
  { title: 'İstanbul (UTC+3)', value: 'Europe/Istanbul' },
  { title: 'Londra (UTC+0)', value: 'Europe/London' },
  { title: 'New York (UTC-5)', value: 'America/New_York' }
]

const saveSettings = async () => {
  saving.value = true
  
  try {
    // API call to save settings
    console.log('Saving settings...', {
      general: generalSettings.value,
      appearance: appearanceSettings.value,
      privacy: privacySettings.value
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Settings saved successfully')
    
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    saving.value = false
  }
}

const downloadData = async () => {
  console.log('Downloading user data...')
  // Implementation for downloading user data
}

const clearSearchHistory = async () => {
  if (confirm('Arama geçmişinizi temizlemek istediğinizden emin misiniz?')) {
    console.log('Clearing search history...')
    // Implementation for clearing search history
  }
}

const deleteAccount = async () => {
  if (deleteConfirmation.value !== 'HESABIMI SİL') return
  
  deleting.value = true
  
  try {
    console.log('Deleting account...')
    // Implementation for deleting account
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to home page
    navigateTo('/')
    
  } catch (error) {
    console.error('Error deleting account:', error)
  } finally {
    deleting.value = false
    showDeleteAccountDialog.value = false
  }
}
</script>

<style scoped>
.account-settings {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.settings-card,
.save-card {
  border-radius: 16px;
  background: white;
  height: 100%;
}

.setting-item,
.data-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.setting-item:last-child,
.data-item:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .settings-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .settings-card .v-card-text,
  .save-card .v-card-text {
    padding: 16px;
  }
  
  .settings-card .v-card-title,
  .save-card .v-card-title {
    padding: 16px;
  }
}
</style> 