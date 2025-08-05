<template>
  <div class="addresses-page">
    <h2>Kayıtlı Adreslerim</h2>
    
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
              @click="deleteAddress(index)"
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
    <v-dialog v-model="showAddressForm" max-width="600px">
      <v-card>
        <v-card-title class="form-title">
          <span class="text-h5">{{ isEditing ? 'Adres Düzenle' : 'Yeni Adres Ekle' }}</span>
        </v-card-title>
        
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.title"
                  label="Adres Başlığı"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Ev, İş, Diğer"
                  :rules="titleRules"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.fullName"
                  label="Ad Soyad"
                  variant="outlined"
                  density="comfortable"
                  :rules="nameRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.phone"
                  label="Telefon"
                  variant="outlined"
                  density="comfortable"
                  :rules="phoneRules"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.city"
                  :items="cities"
                  label="Şehir"
                  variant="outlined"
                  density="comfortable"
                  :rules="cityRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.district"
                  :items="districts"
                  label="İlçe"
                  variant="outlined"
                  density="comfortable"
                  :rules="districtRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.neighborhood"
                  :items="neighborhoods"
                  label="Mahalle"
                  variant="outlined"
                  density="comfortable"
                  :rules="neighborhoodRules"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.address"
                  label="Adres Detayı"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  :rules="addressRules"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="formData.isDefault"
                  label="Bu adresi varsayılan adres olarak ayarla"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeForm">İptal</v-btn>
          <v-btn 
            color="primary" 
            @click="saveAddress" 
            :disabled="!isFormValid"
          >
            {{ isEditing ? 'Güncelle' : 'Kaydet' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
// Adres verileri
const addressList = ref([
  {
    title: 'ev',
    fullName: 'Oktay Tontaş',
    phone: '545363215',
    address: 'Rauf denktaş caddesi , no:114 kat:3 daire:12 Kılınç apartmanı',
    district: 'Çivril',
    city: 'Denizli',
    neighborhood: 'Stadyum Mah.',
    postalCode: '20600',
    isDefault: true
  },
  {
    title: 'Ev 2',
    fullName: 'Mehmet Enes PAZAR',
    phone: '05384864895',
    address: '826 sokak',
    district: 'Bozdoğan',
    city: 'Aydın',
    neighborhood: 'Pınarlı Mah.',
    postalCode: '09760',
    isDefault: false
  }
])

// Form verileri
const formData = ref({
  title: '',
  fullName: '',
  phone: '',
  address: '',
  district: '',
  city: '',
  neighborhood: '',
  postalCode: '',
  isDefault: false
})

// Dialog ve düzenleme durumu
const showAddressForm = ref(false)
const isEditing = ref(false)
const editingIndex = ref(-1)

// Şehir, ilçe, mahalle listeleri
const cities = ref([
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep', 'Denizli', 'Aydın'
])

const districts = ref([
  'Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Çivril', 'Bozdoğan'
])

const neighborhoods = ref([
  'Stadyum Mah.', 'Pınarlı Mah.', 'Atatürk Mah.', 'Cumhuriyet Mah.'
])

// Validation rules
const titleRules = ref([
  (v: string) => !!v || 'Adres başlığı gereklidir',
])

const nameRules = ref([
  (v: string) => !!v || 'Ad soyad gereklidir',
  (v: string) => v.length >= 2 || 'Ad soyad en az 2 karakter olmalıdır'
])

const phoneRules = ref([
  (v: string) => !!v || 'Telefon numarası gereklidir',
  (v: string) => /^[0-9]{10,11}$/.test(v.replace(/\s/g, '')) || 'Geçerli bir telefon numarası giriniz'
])

const cityRules = ref([
  (v: string) => !!v || 'Şehir seçimi gereklidir'
])

const districtRules = ref([
  (v: string) => !!v || 'İlçe seçimi gereklidir'
])

const neighborhoodRules = ref([
  (v: string) => !!v || 'Mahalle seçimi gereklidir'
])

const addressRules = ref([
  (v: string) => !!v || 'Adres detayı gereklidir',
  (v: string) => v.length >= 10 || 'Adres detayı en az 10 karakter olmalıdır'
])

// Form validation
const isFormValid = computed(() => {
  return formData.value.title && 
         formData.value.fullName && 
         formData.value.phone &&
         formData.value.address &&
         formData.value.district &&
         formData.value.city &&
         formData.value.neighborhood
})

// Adres düzenleme
const editAddress = (index: number) => {
  isEditing.value = true
  editingIndex.value = index
  formData.value = { ...addressList.value[index] }
  showAddressForm.value = true
}

// Form kapama
const closeForm = () => {
  showAddressForm.value = false
  isEditing.value = false
  editingIndex.value = -1
  formData.value = {
    title: '',
    fullName: '',
    phone: '',
    address: '',
    district: '',
    city: '',
    neighborhood: '',
    postalCode: '',
    isDefault: false
  }
}

// Adres kaydetme (ekleme/güncelleme)
const saveAddress = () => {
  if (!isFormValid.value) return

  // Eğer varsayılan adres yapılacaksa, diğerlerini false yap
  if (formData.value.isDefault) {
    addressList.value.forEach(addr => addr.isDefault = false)
  }

  if (isEditing.value) {
    // Güncelleme
    addressList.value[editingIndex.value] = { ...formData.value }
    console.log('Adres güncellendi')
  } else {
    // Yeni ekleme
    addressList.value.push({ ...formData.value })
    console.log('Yeni adres eklendi')
  }

  closeForm()
}

// Adres silme
const deleteAddress = (index: number) => {
  if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
    addressList.value.splice(index, 1)
    console.log('Adres silindi')
  }
}
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

.form-title {
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
}

/* Responsive */
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