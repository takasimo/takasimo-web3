<template>
  <div class="settings-page">
    <v-overlay v-model="isLoading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <h2>Hesap Ayarları</h2>

    <!-- Ayarlar Formu -->
    <v-card class="settings-card">
      <v-card-text>
        <v-form>
          <!-- Konum Bilgileri -->
          <div class="form-group">
            <label class="form-label">Konum Bilgileri</label>
            <LocationSelection
              :initial-district-id="formData.district_id"
              :initial-locality-id="formData.locality_id"
              :initial-province-id="formData.city_id"
              @update:province-id="onProvinceChange"
              @update:district-id="onDistrictChange"
              @update:locality-id="onLocalityChange"
            />
          </div>

          <!-- Adres Detayı -->
          <div class="form-group">
            <label class="form-label">
              Adres Detayı
              <span class="form-hint">(Bu alan izde işlemleri için kullanılacaktır)</span>
            </label>
            <v-textarea
              v-model="formData.full_address"
              class="form-field"
              density="comfortable"
              hide-details
              placeholder="Rauf Denktaş caddesi no:114 kat:4 daire 11"
              rows="3"
              variant="outlined"
            />
          </div>

          <!-- Takas Teklifi -->
          <div class="form-group">
            <div class="toggle-group">
              <label class="form-label">Takas Teklifi</label>
              <v-switch v-model="formData.swap" class="toggle-switch" color="primary" hide-details />
            </div>
          </div>

          <!-- İletişim Seçenekleri -->
          <div class="form-group">
            <label class="form-label">İletişim Seçenekleri</label>
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
              placeholder="Mesaj"
              variant="outlined"
            />
          </div>

          <!-- Ödeme Yöntemi -->
          <div class="form-group">
            <label class="form-label">Ödeme Yöntemi</label>
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
              placeholder="Banka / Kredi Kartı"
              variant="outlined"
            />
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Ayarları Kaydet Butonu -->
    <div class="save-section">
      <v-btn :disabled="isLoading" :loading="isLoading" block class="save-btn" color="primary" size="large" @click="saveSettings">
        {{ isLoading ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LocationSelection from '~/components/LocationSelection.vue'
import { useApi } from '~/composables/api/useApi'
import { useToast } from '~/composables/useToast'

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
</script>

<style scoped>
.settings-page {
  padding: 0;
  max-width: 800px;
}

.settings-page h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.settings-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-hint {
  color: #888;
  font-weight: 400;
  font-size: 0.8rem;
}

.form-field {
  width: 100%;
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.toggle-switch {
  flex-shrink: 0;
}

.save-section {
  margin-top: 2rem;
}

.save-btn {
  height: 56px !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  background: linear-gradient(135deg, #8e2de2, #4a00e0) !important;
}

/* Vuetify Textarea Override */
:deep(.v-textarea .v-field) {
  border-radius: 8px;
}

:deep(.v-switch .v-selection-control) {
  min-height: auto;
}

:deep(.v-switch .v-switch__thumb) {
  color: #fff;
}

/* Loading Overlay */
:deep(.v-overlay) {
  z-index: 9999;
}

:deep(.v-progress-circular) {
  color: #8b2865;
}

/* Responsive */
@media (max-width: 768px) {
  .toggle-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .toggle-switch {
    align-self: flex-end;
  }
}
</style>
