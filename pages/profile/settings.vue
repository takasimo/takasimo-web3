<template>
  <div class="settings-page">
    <!-- Loading Overlay -->
    <v-overlay v-model="isLoading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="#8B2865"></v-progress-circular>
    </v-overlay>

    <!-- Settings Form Card -->
    <v-card class="settings-card" elevation="4">
      <v-card-title class="card-header">
        <v-icon color="#8B2865" class="mr-2">mdi-account-settings</v-icon>
        Genel Ayarlar
      </v-card-title>
      
      <v-card-text class="card-content">
        <v-form @submit.prevent="saveSettings">
          <!-- Konum Bilgileri Section -->
          <div class="form-section">
            <div class="section-header">
              <v-icon color="#8B2865" size="20" class="mr-2">mdi-map-marker</v-icon>
              <h3 class="section-title">Konum Bilgileri</h3>
            </div>
            <div class="form-group">
              <LocationSelection
                :key="`location-${formData.city_id}`"
                :initial-province-id="formData.city_id"
                :initial-district-id="formData.district_id"
                :initial-locality-id="formData.locality_id"
                @update:province-id="onProvinceChange"
                @update:district-id="onDistrictChange"
                @update:locality-id="onLocalityChange"
              />
            </div>
          </div>

          <!-- Adres Detayı Section -->
          <div class="form-section">
            <div class="section-header">
              <v-icon color="#8B2865" size="20" class="mr-2">mdi-home</v-icon>
              <h3 class="section-title">Adres Detayı</h3>
            </div>
            <div class="form-group">
              <label class="form-label">
                Detaylı Adres
                <span class="form-hint">(İzde işlemleri için kullanılacaktır)</span>
              </label>
              <v-textarea
                v-model="formData.full_address"
                class="form-field"
                density="comfortable"
                hide-details
                placeholder="Rauf Denktaş caddesi no:114 kat:4 daire 11"
                rows="3"
                variant="outlined"
                color="#8B2865"
              />
            </div>
          </div>

          <!-- Takas Teklifi Section -->
          <div class="form-section">
            <div class="section-header">
              <v-icon color="#8B2865" size="20" class="mr-2">mdi-swap-horizontal</v-icon>
              <h3 class="section-title">Takas Teklifi</h3>
            </div>
            <div class="form-group">
              <div class="toggle-group">
                <div class="toggle-info">
                  <label class="form-label">Takas tekliflerini kabul et</label>
                  <p class="toggle-description">Diğer kullanıcılardan gelen takas tekliflerini almak istiyor musunuz?</p>
                </div>
                <v-switch 
                  v-model="formData.swap" 
                  class="toggle-switch" 
                  color="#8B2865" 
                  hide-details 
                  inset
                />
              </div>
            </div>
          </div>

          <!-- İletişim Seçenekleri Section -->
          <div class="form-section">
            <div class="section-header">
              <v-icon color="#8B2865" size="20" class="mr-2">mdi-message-text</v-icon>
              <h3 class="section-title">İletişim Seçenekleri</h3>
            </div>
            <div class="form-group">
              <label class="form-label">
                Tercih Ettiğiniz İletişim Yöntemleri
                <span class="form-hint">(Birden fazla seçim yapabilirsiniz)</span>
              </label>
              <v-select
                v-model="formData.accepted_communication_types"
                :items="contactOptionsList"
                chips
                class="form-field"
                density="comfortable"
                hide-details
                item-title="text"
                item-value="value"
                multiple
                placeholder="İletişim yöntemlerini seçin"
                variant="outlined"
                color="#8B2865"
              />
            </div>
          </div>

          <!-- Ödeme Yöntemi Section -->
          <div class="form-section">
            <div class="section-header">
              <v-icon color="#8B2865" size="20" class="mr-2">mdi-credit-card</v-icon>
              <h3 class="section-title">Ödeme Yöntemi</h3>
            </div>
            <div class="form-group">
              <label class="form-label">
                Kabul Ettiğiniz Ödeme Yöntemleri
                <span class="form-hint">(Birden fazla seçim yapabilirsiniz)</span>
              </label>
              <v-select
                v-model="formData.accepted_payment_types"
                :items="paymentMethods"
                chips
                class="form-field"
                density="comfortable"
                hide-details
                item-title="text"
                item-value="value"
                multiple
                placeholder="Ödeme yöntemlerini seçin"
                variant="outlined"
                color="#8B2865"
              />
            </div>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Save Button Section -->
    <div class="save-section">
      <v-btn 
        :disabled="isLoading" 
        :loading="isLoading" 
        block 
        class="save-btn" 
        size="large" 
        @click="saveSettings"
        elevation="4"
      >
        <v-icon v-if="!isLoading" class="mr-2">mdi-content-save</v-icon>
        {{ isLoading ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
      </v-btn>
    </div>

    <!-- Bank Account Warning -->
    <v-alert
      v-if="showBankWarning"
      type="warning"
      variant="tonal"
      class="warning-alert"
      icon="mdi-alert-circle"
    >
      <div class="warning-content">
        <strong>Banka Hesabı Gerekli</strong>
        <p>Kredi kartı ile ödeme seçeneğini kullanabilmek için önce banka hesabı eklemelisiniz.</p>
        <v-btn 
          color="#8B2865" 
          variant="outlined" 
          size="small"
          @click="goToBankAccountPage"
          class="mt-2"
        >
          Banka Hesabı Ekle
        </v-btn>
      </div>
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
import LocationSelection from '~/components/LocationSelection.vue'
import { useApi } from '~/composables/api/useApi'
import { useToast } from '~/composables/useToast'
import { ref, onMounted, nextTick, watch } from 'vue'

// Composables
const { api } = useApi()
const toast = useToast()

// Types
type PaymentMethod = 'CARD' | 'TRANSFER' | 'PAYMENT_BY_HAND'
type CommunicationType = 'phone' | 'message'

// Form data
const formData = ref({
  city_id: null as number | null,
  district_id: null as number | null,
  locality_id: null as number | null,
  full_address: null as string | null,
  swap: true,
  accepted_communication_types: [] as CommunicationType[],
  accepted_payment_types: ['PAYMENT_BY_HAND'] as PaymentMethod[]
})

// State
const isLoading = ref(false)
const isDataLoaded = ref(false)
const hasBankAccount = ref(false)
const showBankWarning = ref(false)

// Seçenek listeleri
const contactOptionsList = ref([
  { text: 'Mesaj', value: 'message' },
  { text: 'Telefon', value: 'phone' },
  { text: 'Hiçbiri', value: '' }
])

const paymentMethods = ref([
  { text: 'Banka / Kredi Kartı', value: 'CARD' },
  { text: 'Havale / EFT', value: 'TRANSFER' },
  { text: 'Kapıda Ödeme', value: 'PAYMENT_BY_HAND' }
])

// Konum değişiklik event handler'ları
const onProvinceChange = (provinceId: number | null) => {
  formData.value.city_id = provinceId
  formData.value.district_id = null
  formData.value.locality_id = null
}

const onDistrictChange = (districtId: number | null) => {
  formData.value.district_id = districtId
  formData.value.locality_id = null
}

const onLocalityChange = (localityId: number | null) => {
  formData.value.locality_id = localityId
}

// Banka hesabı kontrolü
const checkBankAccount = async () => {
  try {
    const response = await api.get('/bank-accounts')
    const accountData = response?.data
    console.log('accountData', accountData)
    hasBankAccount.value = !!(accountData && Object.keys(accountData).length > 0)
    showBankWarning.value = !hasBankAccount.value

    // Banka hesabı kontrolünden sonra ödeme yöntemlerini kontrol et
    if (formData.value.accepted_payment_types.includes('CARD') && !hasBankAccount.value) {
      formData.value.accepted_payment_types = formData.value.accepted_payment_types.filter((type) => type !== 'CARD')
      // goToBankAccountPage() // Bu fonksiyon tanımlanmadı, gerekirse eklenebilir
      toast.info('Banka ile ödeme seçeneğini kullanabilmek için önce banka hesabı eklemelisiniz.')
    }
  } catch (e) {
    hasBankAccount.value = false
    showBankWarning.value = true
  }
}

// Ayarları yükleme
const loadSettings = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/user-settings')
    const settings = response?.data

    // Convert uppercase communication types to lowercase
    const communicationTypes = Array.isArray(settings?.accepted_communication_types)
      ? settings.accepted_communication_types.map((type: string) => type.toLowerCase() as CommunicationType)
      : []

    // API'den gelen verileri formData'ya atama
    formData.value = {
      city_id: settings?.city_id || null,
      district_id: settings?.district_id || null,
      locality_id: settings?.locality_id || null,
      full_address: settings?.full_address || null,
      swap: settings?.swap ?? true,
      accepted_communication_types: communicationTypes,
      accepted_payment_types: settings?.accepted_payment_types || ['PAYMENT_BY_HAND']
    }

    await nextTick()
    isDataLoaded.value = true
    // forceComponentUpdate() // Bu fonksiyon tanımlanmadı, gerekirse eklenebilir

    console.log('Loaded settings:', formData.value)
  } catch (error) {
    console.error('Ayarlar yüklenirken hata oluştu:', error)
    toast.error('Ayarlar yüklenirken bir hata oluştu')
  } finally {
    isLoading.value = false
  }
}

// Ayarları kaydetme
const saveSettings = async () => {
  try {
    isLoading.value = true
    console.log('Ayarlar kaydediliyor:', formData.value)

    // API çağrısı yapılacak
    const response = await api.put('/user-settings', formData.value)
    console.log('Settings saved:', response)

    toast.success('Ayarlar başarıyla kaydedildi')
  } catch (error) {
    console.error('Ayarlar kaydedilirken hata oluştu:', error)
    toast.error('Ayarlar kaydedilirken bir hata oluştu')
  } finally {
    isLoading.value = false
  }
}

// Component mount olduğunda ayarları yükle
onMounted(async () => {
  await loadSettings()
  await checkBankAccount()
})

// Form data değiştiğinde LocationSelection'ı yeniden render et (sadece debug için)
watch(formData, (newData) => {
  console.log('Form data changed:', newData)
}, { deep: true })
</script>

<style scoped>
.settings-page {
  max-width: 900px;
  margin: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.header-icon {
  background: linear-gradient(135deg, #8B2865, #a0526d);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.3);
}

.page-title {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0;
}

/* Settings Card */
.settings-card {
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: none;
  margin-bottom: 2rem;
  overflow: hidden;
  background: white;
}

.card-header {
  background: linear-gradient(135deg, #8B2865, #a0526d);
  color: white;
  padding: 1.5rem 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  text-align: left;
}

.card-content {
  padding: 2rem;
}

/* Form Sections */
.form-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  border-left: 4px solid #8B2865;
  transition: all 0.3s ease;
}

.form-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.form-hint {
  color: #6c757d;
  font-weight: 400;
  font-size: 0.85rem;
  font-style: italic;
}

.form-field {
  width: 100%;
}

/* Toggle Group */
.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.toggle-info {
  flex: 1;
}

.toggle-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

.toggle-switch {
  flex-shrink: 0;
  margin-left: 1rem;
}

/* Save Section */
.save-section {
  margin-top: 3rem;
  text-align: center;
}

.save-btn {
  height: 60px !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  text-transform: none !important;
  background: linear-gradient(135deg, #8B2865, #a0526d) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.3) !important;
  transition: all 0.3s ease !important;
  color: white !important;
}

.save-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 35px rgba(139, 40, 101, 0.4) !important;
}

.save-btn:disabled {
  background: #6c757d !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Warning Alert */
.warning-alert {
  margin-top: 2rem;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(255, 193, 7, 0.2);
}

.warning-content strong {
  color: #856404;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.5rem;
}

.warning-content p {
  color: #856404;
  margin: 0.5rem 0;
}

/* Vuetify Component Overrides */
:deep(.v-textarea .v-field) {
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

:deep(.v-textarea .v-field:hover) {
  border-color: #8B2865;
  border-width: 1px;
}

:deep(.v-textarea .v-field--focused) {
  border-color: #8B2865;
  border-width: 1px;
  box-shadow: 0 0 0 2px rgba(139, 40, 101, 0.1);
}

:deep(.v-select .v-field) {
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

:deep(.v-select .v-field:hover) {
  border-color: #8B2865;
  border-width: 1px;
}

:deep(.v-select .v-field--focused) {
  border-color: #8B2865;
  border-width: 1px;
  box-shadow: 0 0 0 2px rgba(139, 40, 101, 0.1);
}

/* Switch Styles - Aggressive Override */
:deep(.v-switch) {
  --v-switch-track-color: #e9ecef !important;
  --v-switch-thumb-color: #6c757d !important;
}

:deep(.v-switch.v-switch--selected) {
  --v-switch-track-color: #8B2865 !important;
  --v-switch-thumb-color: white !important;
}

/* Direct element targeting */
:deep(.v-switch .v-switch__track) {
  background-color: var(--v-switch-track-color) !important;
  border-color: var(--v-switch-track-color) !important;
}

:deep(.v-switch .v-switch__thumb) {
  background-color: var(--v-switch-thumb-color) !important;
  color: var(--v-switch-thumb-color) !important;
}

/* Force override all possible states */
:deep(.v-switch .v-selection-control) {
  min-height: auto;
}

:deep(.v-switch .v-selection-control .v-switch__track) {
  background-color: #e9ecef !important;
  border-color: #e9ecef !important;
}

:deep(.v-switch .v-selection-control .v-switch__thumb) {
  background-color: #6c757d !important;
  color: #6c757d !important;
}

:deep(.v-switch.v-switch--selected .v-selection-control .v-switch__track) {
  background-color: #8B2865 !important;
  border-color: #8B2865 !important;
}

:deep(.v-switch.v-switch--selected .v-selection-control .v-switch__thumb) {
  background-color: white !important;
  color: white !important;
}

/* Additional specificity */
:deep(.v-switch .v-selection-control .v-switch__track::before) {
  background-color: inherit !important;
}

:deep(.v-switch .v-selection-control .v-switch__thumb::before) {
  background-color: inherit !important;
}

/* Loading Overlay */
:deep(.v-overlay) {
  z-index: 9999;
}

:deep(.v-progress-circular) {
  color: #8B2865;
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .toggle-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .toggle-switch {
    align-self: flex-end;
    margin-left: 0;
  }
  
  .header-icon {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .card-header {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
}
</style>
