<template>
  <div class="addresses-page">
    <h2>Kayıtlı Adreslerim</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <v-progress-circular indeterminate color="primary" />
      <p>Adresler yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-section">
      <v-alert type="error" class="mb-4">
        {{ error }}
      </v-alert>
      <v-btn @click="loadAddresses" color="primary">Tekrar Dene</v-btn>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Adres Listesi -->
      <div class="addresses-list">
        <div 
          v-for="(address, index) in addressList" 
          :key="index"
          class="address-item"
          :class="{ 'default-address': address.isDefault }"
        >
          <div class="address-header">
            <div class="address-type">
              <v-icon class="address-icon">mdi-home</v-icon>
              <span class="address-title">{{ address.title }}</span>
              <span v-if="address.isDefault" class="default-badge">Varsayılan</span>
            </div>
            <div class="address-actions">
              <v-btn 
                icon 
                variant="text" 
                size="small" 
                color="primary"
                @click="editAddress(index)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn 
                icon 
                variant="text" 
                size="small" 
                color="error"
                @click="deleteAddressItem(index)"
              >
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
              <p class="address-details">{{ address.city }} / {{ address.district }} / {{ address.neighborhood || 'Stadyum Mah.' }}</p>
              <p class="address-full">{{ address.address }}</p>
            </div>
          </div>
        </div>

        <!-- Boş durum -->
        <div v-if="addressList.length === 0" class="empty-state">
          <v-icon size="48" color="grey-lighten-2">mdi-map-marker-off</v-icon>
          <p>Henüz kayıtlı adresiniz bulunmamaktadır.</p>
        </div>
      </div>

      <!-- Yeni Adres Ekle Butonu -->
      <div class="add-address-section">
        <v-btn 
          color="primary" 
          size="large" 
          block
          @click="showAddressForm = !showAddressForm"
          class="add-address-btn"
        >
          <v-icon left>mdi-plus</v-icon>
          Yeni Adres Ekle
        </v-btn>
      </div>

      <!-- Adres Ekleme/Düzenleme Formu -->
      <AddressModal
        v-model="showAddressForm"
        :is-editing="isEditing"
        :address-data="editingAddressData"
        @save="handleSaveAddress"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
    
    const addresses = response.data || response || []
    
    addressList.value = addresses.map((addr: any) => ({
      address_code: addr.address_code,
      title: addr.title,
      fullName: addr.full_name,
      phone: addr.phone_number,
      address: addr.full_address,
      district: addr.district?.name || '',
      city: addr.city?.name || '',
      neighborhood: addr.locality?.name || '',
      postalCode: addr.postal_code,
      cityCode: addr.city_code,
      districtCode: addr.district_code,
      localityCode: addr.locality_code,
      isDefault: addr.is_default,
      is_deleted: addr.is_deleted,
      created_at: addr.created_at,
      updated_at: addr.updated_at
    }))
    
    console.log('Adresler yüklendi:', addressList.value)
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
    city: address.city,
    district: address.district,
    neighborhood: address.neighborhood
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

const deleteAddressItem = async (index: number) => {
  if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return

  loading.value = true
  error.value = null

  try {
    const address = addressList.value[index]
    await deleteAddress(address.address_code)
    console.log('Adres silindi')
    
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
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.addresses-list {
  margin-bottom: 2rem;
}

.address-item {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.address-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.default-address {
  border-color: #1976d2;
  border-width: 2px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.address-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-icon {
  color: #666;
}

.address-title {
  font-weight: 600;
  color: #333;
  text-transform: capitalize;
}

.default-badge {
  background: #1976d2;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.address-actions {
  display: flex;
  gap: 0.25rem;
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
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.address-full {
  color: #444;
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