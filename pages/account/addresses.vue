<template>
  <div class="account-addresses">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Kayıtlı Adreslerim</h1>
      <p class="text-grey text-body-1">
        Teslimat ve fatura adreslerinizi yönetin
      </p>
    </div>

    <v-row>
      <!-- Adres İstatistikleri -->
      <v-col cols="12" class="mb-6">
        <v-card class="stats-card" elevation="2" border>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-primary mb-2">
                    {{ addresses.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Toplam Adres
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-success mb-2">
                    {{ defaultAddresses.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Varsayılan Adres
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-info mb-2">
                    {{ deliveryAddresses.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Teslimat Adresi
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-warning mb-2">
                    {{ billingAddresses.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Fatura Adresi
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Adres Listesi -->
      <v-col cols="12" class="mb-6">
        <v-card class="addresses-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="primary" size="24" class="mr-3">mdi-map-marker</v-icon>
                <h3 class="text-h6 font-weight-semibold">Kayıtlı Adresler</h3>
              </div>
              
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="showAddDialog = true"
              >
                Yeni Adres Ekle
              </v-btn>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div v-if="addresses.length > 0" class="address-grid">
              <div v-for="address in addresses" :key="address.id" class="address-item">
                <v-card class="address-card" variant="outlined" border>
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <div class="d-flex align-center">
                        <v-icon :color="getAddressTypeColor(address.type)" size="20" class="mr-2">
                          {{ getAddressTypeIcon(address.type) }}
                        </v-icon>
                        <span class="text-body-2 font-weight-medium text-uppercase">
                          {{ getAddressTypeLabel(address.type) }}
                        </span>
                      </div>
                      
                      <div class="d-flex gap-1">
                        <v-btn
                          v-if="address.isDefault"
                          color="success"
                          size="x-small"
                          variant="outlined"
                          disabled
                        >
                          Varsayılan
                        </v-btn>
                        
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-dots-vertical"
                              size="small"
                              variant="text"
                              v-bind="props"
                            />
                          </template>
                          
                          <v-list>
                            <v-list-item @click="editAddress(address)">
                              <template v-slot:prepend>
                                <v-icon size="small">mdi-pencil</v-icon>
                              </template>
                              <v-list-item-title>Düzenle</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item @click="setAsDefault(address)" v-if="!address.isDefault">
                              <template v-slot:prepend>
                                <v-icon size="small">mdi-star</v-icon>
                              </template>
                              <v-list-item-title>Varsayılan Yap</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item @click="deleteAddress(address)" class="text-error">
                              <template v-slot:prepend>
                                <v-icon size="small" color="error">mdi-delete</v-icon>
                              </template>
                              <v-list-item-title class="text-error">Sil</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </div>
                    
                    <div class="address-content">
                      <div class="text-body-1 font-weight-medium mb-2">{{ address.name }}</div>
                      <div class="text-body-2 text-grey mb-1">{{ address.street }}</div>
                      <div class="text-body-2 text-grey mb-1">{{ address.city }}, {{ address.state }} {{ address.zipCode }}</div>
                      <div class="text-body-2 text-grey mb-2">{{ address.country }}</div>
                      <div class="text-body-2 text-grey">{{ address.phone }}</div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <v-icon size="48" color="grey" class="mb-4">mdi-map-marker-off</v-icon>
              <p class="text-grey text-body-1 mb-4">Henüz kayıtlı adres bulunmuyor</p>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="showAddDialog = true"
              >
                İlk Adresinizi Ekleyin
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Adres Ekleme/Düzenleme Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px">
      <v-card>
        <v-card-title class="pa-6 pb-4">
          <h3 class="text-h6 font-weight-semibold">
            {{ editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle' }}
          </h3>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-form @submit.prevent="saveAddress" ref="addressFormRef">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.name"
                  label="Adres Adı"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-select
                  v-model="addressForm.type"
                  label="Adres Türü"
                  variant="outlined"
                  :items="addressTypes"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model="addressForm.street"
                  label="Sokak Adresi"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.city"
                  label="Şehir"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.state"
                  label="İl"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.zipCode"
                  label="Posta Kodu"
                  variant="outlined"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addressForm.phone"
                  label="Telefon"
                  variant="outlined"
                  :rules="[rules.required, rules.phone]"
                  required
                />
              </v-col>
              
              <v-col cols="12">
                <v-checkbox
                  v-model="addressForm.isDefault"
                  label="Bu adresi varsayılan olarak ayarla"
                  color="primary"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="cancelEdit"
          >
            İptal
          </v-btn>
          <v-btn
            color="primary"
            @click="saveAddress"
            :loading="saving"
          >
            {{ editingAddress ? 'Güncelle' : 'Kaydet' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Silme Onay Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="pa-6 pb-4">
          <h3 class="text-h6 font-weight-semibold">Adresi Sil</h3>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <p class="text-body-1">
            "{{ addressToDelete?.name }}" adresini silmek istediğinizden emin misiniz?
          </p>
          <p class="text-body-2 text-grey mt-2">
            Bu işlem geri alınamaz.
          </p>
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
            @click="confirmDelete"
            :loading="deleting"
          >
            Sil
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const addressFormRef = ref(null)
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const editingAddress = ref(null)
const addressToDelete = ref(null)
const saving = ref(false)
const deleting = ref(false)

const addressForm = ref({
  name: '',
  type: 'delivery',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  isDefault: false
})

const rules = {
  required: (value) => !!value || 'Bu alan zorunludur',
  phone: (value) => /^[0-9+\-\s()]+$/.test(value) || 'Geçerli bir telefon numarası girin'
}

const addressTypes = [
  { title: 'Teslimat Adresi', value: 'delivery' },
  { title: 'Fatura Adresi', value: 'billing' },
  { title: 'Ev Adresi', value: 'home' },
  { title: 'İş Adresi', value: 'work' }
]

const addresses = ref([
  {
    id: 1,
    name: 'Ev Adresim',
    type: 'home',
    street: 'Atatürk Caddesi No: 123',
    city: 'İstanbul',
    state: 'İstanbul',
    zipCode: '34000',
    country: 'Türkiye',
    phone: '+90 555 123 4567',
    isDefault: true
  },
  {
    id: 2,
    name: 'İş Adresim',
    type: 'work',
    street: 'İstiklal Caddesi No: 456',
    city: 'İstanbul',
    state: 'İstanbul',
    zipCode: '34100',
    country: 'Türkiye',
    phone: '+90 212 345 6789',
    isDefault: false
  }
])

const defaultAddresses = computed(() => addresses.value.filter(addr => addr.isDefault))
const deliveryAddresses = computed(() => addresses.value.filter(addr => addr.type === 'delivery'))
const billingAddresses = computed(() => addresses.value.filter(addr => addr.type === 'billing'))

const getAddressTypeColor = (type) => {
  const colors = {
    delivery: 'primary',
    billing: 'warning',
    home: 'success',
    work: 'info'
  }
  return colors[type] || 'grey'
}

const getAddressTypeIcon = (type) => {
  const icons = {
    delivery: 'mdi-truck-delivery',
    billing: 'mdi-receipt',
    home: 'mdi-home',
    work: 'mdi-briefcase'
  }
  return icons[type] || 'mdi-map-marker'
}

const getAddressTypeLabel = (type) => {
  const labels = {
    delivery: 'Teslimat',
    billing: 'Fatura',
    home: 'Ev',
    work: 'İş'
  }
  return labels[type] || 'Diğer'
}

const saveAddress = async () => {
  if (!addressFormRef.value?.validate()) return
  
  saving.value = true
  
  try {
    if (editingAddress.value) {
      // Update existing address
      const index = addresses.value.findIndex(addr => addr.id === editingAddress.value.id)
      if (index !== -1) {
        addresses.value[index] = { ...editingAddress.value, ...addressForm.value }
      }
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        ...addressForm.value,
        country: 'Türkiye'
      }
      addresses.value.push(newAddress)
    }
    
    // If this is set as default, unset others
    if (addressForm.value.isDefault) {
      addresses.value.forEach(addr => {
        if (addr.id !== (editingAddress.value?.id || Date.now())) {
          addr.isDefault = false
        }
      })
    }
    
    cancelEdit()
    
  } catch (error) {
    console.error('Error saving address:', error)
  } finally {
    saving.value = false
  }
}

const editAddress = (address) => {
  editingAddress.value = address
  addressForm.value = { ...address }
  showAddDialog.value = true
}

const deleteAddress = (address) => {
  addressToDelete.value = address
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  
  try {
    addresses.value = addresses.value.filter(addr => addr.id !== addressToDelete.value.id)
    showDeleteDialog.value = false
    addressToDelete.value = null
  } catch (error) {
    console.error('Error deleting address:', error)
  } finally {
    deleting.value = false
  }
}

const setAsDefault = (address) => {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === address.id
  })
}

const cancelEdit = () => {
  editingAddress.value = null
  addressForm.value = {
    name: '',
    type: 'delivery',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
  }
  showAddDialog.value = false
}
</script>

<style scoped>
.account-addresses {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.stats-card,
.addresses-card {
  border-radius: 16px;
  background: white;
}

.stat-item {
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.address-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.address-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.address-content {
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .address-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .stats-card .v-card-text,
  .addresses-card .v-card-text {
    padding: 16px;
  }
  
  .stats-card .v-card-title,
  .addresses-card .v-card-title {
    padding: 16px;
  }
}
</style> 