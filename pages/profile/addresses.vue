<template>
  <div class="addresses-page">
    <h2>Kayıtlı Adreslerim</h2>
    
    <!-- Mevcut Adresler -->
    <div class="section">
      <h3>Adreslerim</h3>
      
      <div v-if="addressList.length > 0" class="addresses-grid">
        <v-card v-for="(address, index) in addressList" :key="index" class="address-card">
          <v-card-text>
            <div class="address-header">
              <h4>{{ address.title }}</h4>
              <v-chip v-if="address.isDefault" color="primary" size="small">Varsayılan</v-chip>
            </div>
            
            <div class="address-details">
              <p><strong>{{ address.fullName }}</strong></p>
              <p>{{ address.phone }}</p>
              <p>{{ address.address }}</p>
              <p>{{ address.district }} / {{ address.city }}</p>
              <p>{{ address.postalCode }}</p>
            </div>
            
            <div class="address-actions">
              <v-btn variant="outlined" size="small" @click="editAddress(index)">Düzenle</v-btn>
              <v-btn variant="outlined" size="small" @click="setDefault(index)" v-if="!address.isDefault">
                Varsayılan Yap
              </v-btn>
              <v-btn variant="outlined" color="error" size="small" @click="deleteAddress(index)">Sil</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-alert v-else type="info" class="mb-4">
        Henüz kayıtlı adresiniz bulunmamaktadır.
      </v-alert>
    </div>

    <!-- Yeni Adres Ekleme -->
    <div class="section">
      <h3>Yeni Adres Ekle</h3>
      
      <v-card class="add-address-card">
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAddress.title"
                  label="Adres Başlığı"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Ev, İş, vs."
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAddress.fullName"
                  label="Ad Soyad"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAddress.phone"
                  label="Telefon"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAddress.postalCode"
                  label="Posta Kodu"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newAddress.city"
                  :items="cities"
                  label="Şehir"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAddress.district"
                  label="İlçe"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="newAddress.address"
                  label="Açık Adres"
                  variant="outlined"
                  rows="3"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="newAddress.isDefault"
                  label="Bu adresi varsayılan adresim yap"
                  density="comfortable"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" @click="addAddress" :disabled="!isFormValid">
                  Adres Ekle
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Adres verileri
const addressList = ref([
  {
    title: 'Ev Adresim',
    fullName: 'Oktay Tontaş',
    phone: '0534 000 00 00',
    address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No:15/3',
    district: 'Kadıköy',
    city: 'İstanbul',
    postalCode: '34710',
    isDefault: true
  }
])

const newAddress = ref({
  title: '',
  fullName: '',
  phone: '',
  address: '',
  district: '',
  city: '',
  postalCode: '',
  isDefault: false
})

// Şehir listesi (örnek)
const cities = ref([
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep'
])

// Form validation
const isFormValid = computed(() => {
  return newAddress.value.title && 
         newAddress.value.fullName && 
         newAddress.value.phone &&
         newAddress.value.address &&
         newAddress.value.district &&
         newAddress.value.city
})

// Adres ekleme
const addAddress = () => {
  if (isFormValid.value) {
    // Eğer yeni adres varsayılan yapılacaksa, diğerlerini false yap
    if (newAddress.value.isDefault) {
      addressList.value.forEach(addr => addr.isDefault = false)
    }
    
    addressList.value.push({ ...newAddress.value })
    
    // Form'u temizle
    newAddress.value = {
      title: '',
      fullName: '',
      phone: '',
      address: '',
      district: '',
      city: '',
      postalCode: '',
      isDefault: false
    }
  }
}

// Adres düzenleme
const editAddress = (index: number) => {
  console.log('Adres düzenle:', index)
}

// Varsayılan adres yapma
const setDefault = (index: number) => {
  addressList.value.forEach((addr, i) => {
    addr.isDefault = i === index
  })
}

// Adres silme
const deleteAddress = (index: number) => {
  if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
    addressList.value.splice(index, 1)
  }
}
</script>

<style scoped>
.addresses-page {
  padding: 0;
  max-width: 1000px;
}

.addresses-page h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section {
  margin-bottom: 3rem;
}

.section h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.address-card, .add-address-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.address-header h4 {
  margin: 0;
  color: #333;
  font-weight: 600;
}

.address-details p {
  margin: 0.25rem 0;
  color: #666;
  line-height: 1.4;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .addresses-grid {
    grid-template-columns: 1fr;
  }
  
  .address-actions {
    justify-content: flex-start;
  }
}
</style>