<template>
  <div class="addresses-page">
    <h2>Kayıtlı Adreslerim</h2>

    <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <v-progress-circular color="primary" indeterminate />
      <p>Adresler yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-section">
      <v-alert class="mb-4" type="error">
        {{ error }}
      </v-alert>
      <v-btn color="primary" @click="loadAddresses">Tekrar Dene</v-btn>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Adres Listesi -->
      <div class="addresses-list">
        <div v-for="(address, index) in addressList" :key="index" :class="{ 'default-address': address.isDefault }" class="address-item">
          <div class="address-header">
            <div class="address-type">
              <v-icon class="address-icon">mdi-home</v-icon>
              <span class="address-title">{{ address.title }}</span>
              <span v-if="address.isDefault" class="default-badge">Varsayılan</span>
            </div>
            <div class="address-actions">
              <v-btn
                v-if="!address.isDefault"
                color="primary"
                icon
                size="small"
                title="Varsayılan adres yap"
                variant="text"
                @click="setDefaultAddress(address.address_code)"
              >
                <v-icon>mdi-star-outline</v-icon>
              </v-btn>
              <v-btn color="primary" icon size="small" title="Düzenle" variant="text" @click="editAddress(index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" icon size="small" title="Sil" variant="text" @click="deleteAddressItem(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="address-content">
            <div class="address-info">
              <p class="recipient-info">
                <strong>{{ address.fullName }}</strong>
                <span class="phone">{{ address.phone }}</span>
              </p>
              <p class="address-details">{{ address.cityName }} / {{ address.districtName }} / {{ address.neighborhoodName }}</p>
              <p class="address-full">{{ address.address }}</p>
            </div>
          </div>
        </div>

        <!-- Boş durum -->
        <div v-if="addressList.length === 0" class="empty-state">
          <v-icon color="grey-lighten-2" size="48">mdi-map-marker-off</v-icon>
          <p>Henüz kayıtlı adresiniz bulunmamaktadır.</p>
        </div>
      </div>

      <!-- Yeni Adres Ekle Butonu -->
      <div class="add-address-section">
        <v-btn 
          block 
          class="add-address-btn" 
          color="primary" 
          size="large" 
          @click="showAddressForm = !showAddressForm"
          elevation="4"
          rounded="lg"
        >
          <v-icon left size="24">mdi-plus-circle</v-icon>
          <span class="btn-text">Yeni Adres Ekle</span>
        </v-btn>
      </div>

      <!-- Adres Ekleme/Düzenleme Formu -->
      <AddressModal v-model="showAddressForm" :address-data="editingAddressData" :is-editing="isEditing" @save="handleSaveAddress" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProfileApi } from '~/composables/api/useProfileApi'
import AddressModal from '~/pages/profile/components/addresses/AddressModal.vue'

const { getAddresses, createAddress, updateAddress, deleteAddress } = useProfileApi()

// State
const addressList = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showAddressForm = ref(false)
const isEditing = ref(false)
const editingIndex = ref(-1)
const editingAddressData = ref<any>(null)

const loadAddresses = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getAddresses()
    const addresses = response?.data || response || []

    addressList.value = addresses.map((addr: any) => ({
      address_code: addr.address_code,
      title: addr.title,
      fullName: addr.full_name,
      phone: addr.phone_number,
      address: addr.full_address,
      postalCode: addr.postal_code,
      cityCode: addr.city?.id || addr.city_code,
      districtCode: addr.district?.id || addr.district_code,
      localityCode: addr.locality?.id || addr.locality_code,
      isDefault: addr.is_default,
      is_deleted: addr.is_deleted,
      created_at: addr.created_at,
      updated_at: addr.updated_at,
      city: addr.city,
      district: addr.district,
      locality: addr.locality,
      cityName: addr.city?.name || '',
      districtName: addr.district?.name || '',
      neighborhoodName: addr.locality?.name || ''
    }))
  } catch (err) {
    console.error('Adres yükleme hatası:', err)
    error.value = 'Adresler yüklenirken hata oluştu'
    addressList.value = []
  } finally {
    loading.value = false
  }
}

const editAddress = (index: number) => {
  isEditing.value = true
  editingIndex.value = index
  const address = addressList.value[index]

  editingAddressData.value = {
    address_code: address.address_code,
    title: address.title,
    fullName: address.fullName,
    phone: address.phone,
    address: address.address,
    postalCode: address.postalCode,
    isDefault: address.isDefault,
    cityCode: address.cityCode,
    districtCode: address.districtCode,
    localityCode: address.localityCode,
    // API'den gelen orijinal objeleri doğrudan kullan
    city: address.city,
    district: address.district,
    locality: address.locality
  }

  showAddressForm.value = true
}

const closeForm = () => {
  showAddressForm.value = false
  isEditing.value = false
  editingIndex.value = -1
  editingAddressData.value = null
}

const handleSaveAddress = async (payload: any) => {
  try {
    // The modal has already handled the API call, just reload the addresses
    await loadAddresses()
    closeForm()
  } catch (err) {
    console.error('Adres yükleme hatası:', err)
    error.value = 'Adresler yüklenirken hata oluştu'
  }
}

const setDefaultAddress = async (addressCode: string) => {
  try {
    console.log('Varsayılan olarak ayarlanıyor:', addressCode)

    // ProfileApi'yi kullanarak API çağrısını yap
    const profileApi = useProfileApi()
    await profileApi.setDefaultAddress({ address_code: addressCode })

    // Başarılı olursa UI'ı hemen güncelle
    addressList.value = addressList.value.map((addr) => ({
      ...addr,
      isDefault: addr.address_code === addressCode
    }))

    // Tam senkronizasyon için adresleri tekrar yükle
    await loadAddresses()
  } catch (err: any) {
    console.error('Varsayılan adres ayarlanırken hata oluştu:', err)
    error.value = 'Varsayılan adres ayarlanırken bir hata oluştu'
  }
}

const deleteAddressItem = async (index: number) => {
  if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return

  loading.value = true
  error.value = null

  try {
    const address = addressList.value[index]
    await deleteAddress(address.address_code)

    await loadAddresses()
  } catch (err) {
    console.error('Adres silme hatası:', err)
    error.value = 'Adres silinirken hata oluştu'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(loadAddresses)
</script>

<style scoped>
.addresses-page {
  padding: 0;
  max-width: 800px;
}

.addresses-page h2 {
  margin-bottom: 2rem;
  color: #8b2865;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  position: relative;
}

.addresses-page h2::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #8b2865 0%, #6b1f4d 100%);
  border-radius: 2px;
}

.add-address-section {
  margin: 2rem 0;
  text-align: center;
}

.add-address-btn {
  background: linear-gradient(135deg, #8b2865 0%, #6b1f4d 100%) !important;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  min-height: 56px;
  position: relative;
  overflow: hidden;
}

.add-address-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.add-address-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.add-address-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(139, 40, 101, 0.4);
}

.btn-text {
  font-size: 1rem;
  font-weight: 600;
  margin-left: 4px;
}

.addresses-list {
  margin-bottom: 2rem;
}

.address-item {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e3e8ef;
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.address-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #e3e8ef 0%, #d1d9e6 100%);
  border-radius: 16px 16px 0 0;
}

.address-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(139, 40, 101, 0.15);
  border-color: #8b2865;
}

.default-address {
  border-color: #8b2865;
  border-width: 2px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f0f5 100%);
}

.default-address::before {
  background: linear-gradient(90deg, #8b2865 0%, #6b1f4d 100%);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.address-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.address-icon {
  color: #8b2865;
  background: rgba(139, 40, 101, 0.1);
  padding: 0.5rem;
  border-radius: 12px;
  font-size: 1.25rem;
}

.address-title {
  font-weight: 700;
  color: #8b2865;
  text-transform: capitalize;
  font-size: 1.1rem;
  letter-spacing: -0.025em;
}

.default-badge {
  background: linear-gradient(135deg, #8b2865 0%, #6b1f4d 100%);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  box-shadow: 0 2px 8px rgba(139, 40, 101, 0.3);
}

.address-actions {
  display: flex;
  gap: 0.5rem;
}

.address-actions .v-btn {
  background: rgba(139, 40, 101, 0.05);
  border: 1px solid rgba(139, 40, 101, 0.2);
  transition: all 0.2s ease;
}

.address-actions .v-btn:hover {
  background: rgba(139, 40, 101, 0.1);
  border-color: #8b2865;
  transform: scale(1.05);
}

.address-actions .v-btn.v-btn--color-error:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.address-actions .v-btn:first-child {
  color: #8b2865 !important;
}

.address-actions .v-btn:first-child:hover {
  background: rgba(139, 40, 101, 0.15) !important;
  border-color: #8b2865 !important;
}

.address-content {
  padding-left: 2rem;
}

.recipient-info {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.recipient-info strong {
  color: #333;
}

.phone {
  color: #666;
  font-size: 0.9rem;
}

.address-details {
  color: #8b2865;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.address-full {
  color: #374151;
  line-height: 1.4;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.add-address-section {
  margin-top: 2rem;
}

.add-address-btn {
  height: 56px !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-section p {
  margin-top: 1rem;
  color: #666;
}

.error-section {
  padding: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .address-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .address-actions {
    align-self: flex-end;
  }

  .address-content {
    padding-left: 0;
  }

  .recipient-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
