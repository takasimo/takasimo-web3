<template>
  <div class="iban-page">
    <h2>IBAN Bilgilerim</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <v-progress-circular indeterminate color="primary" />
      <p>IBAN bilgileri yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-section">
      <v-alert type="error" class="mb-4">
        {{ error }}
      </v-alert>
      <v-btn @click="loadBankAccount" color="primary">Tekrar Dene</v-btn>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Mevcut IBAN Bilgileri -->
      <div class="section" v-if="currentIban">
      <h3>Kayıtlı IBAN Bilgim</h3>
      
      <v-card class="iban-card">
        <v-card-text>
          <div class="iban-item">
            <div class="iban-info">
              <p class="iban-number">{{ currentIban.iban }}</p>
              <p class="account-holder">{{ currentIban.accountHolder }}</p>
              <div class="verification-status">
                <v-chip 
                  v-if="currentIban.is_verified" 
                  color="success" 
                  size="small"
                  prepend-icon="mdi-check-circle"
                >
                  Doğrulanmış
                </v-chip>
                <v-chip 
                  v-else 
                  color="warning" 
                  size="small"
                  prepend-icon="mdi-clock"
                >
                  Doğrulama Bekliyor
                </v-chip>
              </div>
            </div>
            <div class="iban-actions">
              <v-btn 
                variant="outlined" 
                size="small" 
                @click="startEdit"
                :disabled="loading"
              >
                Düzenle
              </v-btn>
              <v-btn 
                variant="outlined" 
                color="error" 
                size="small" 
                @click="deleteIban"
                :loading="loading"
                :disabled="loading"
              >
                Sil
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- IBAN Ekleme/Güncelleme Formu -->
    <div class="section">
      <h3>{{ currentIban ? 'IBAN Güncelle' : 'IBAN Ekle' }}</h3>
      
      <v-card class="form-card">
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.iban"
                  label="IBAN Numarası"
                  variant="outlined"
                  density="comfortable"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  required
                  :rules="ibanRules"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fullName"
                  label="Hesap Sahibi"
                  variant="outlined"
                  density="comfortable"
                  required
                  :rules="accountHolderRules"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <div class="form-actions">
                  <v-btn 
                    color="primary" 
                    @click="saveIban" 
                    :disabled="!isFormValid || loading"
                    :loading="loading"
                    size="large"
                  >
                    {{ currentIban ? 'IBAN Güncelle' : 'IBAN Ekle' }}
                  </v-btn>
                  
                  <v-btn 
                    v-if="isEditing" 
                    variant="outlined" 
                    @click="cancelEdit"
                    :disabled="loading"
                    size="large"
                  >
                    İptal
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- IBAN Hakkında Bilgi -->
    <div class="section">
      <v-card class="info-card">
        <v-card-text>
          <h3>IBAN Hakkında</h3>
          <div class="info-content">
            <p>• IBAN numaranız satış ödemeleriniz için kullanılacaktır</p>
            <p>• IBAN numaranız sadece size ait olmalıdır</p>
            <p>• IBAN bilginizi dilediğiniz zaman güncelleyebilirsiniz</p>
          </div>
        </v-card-text>
      </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileApi } from '~/composables/api/useProfileApi'

const { getBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } = useProfileApi()

// IBAN verileri - API'den gelecek
const currentIban = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Form verileri - API format'ına uygun
const formData = ref({
  iban: '',
  fullName: ''
})

// Düzenleme durumu
const isEditing = ref(false)

// Form validation rules
const ibanRules = ref([
  (v: string) => !!v || 'IBAN numarası gereklidir',
  (v: string) => /^TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/.test(v.replace(/\s/g, '')) || 'Geçerli bir IBAN numarası giriniz'
])

const accountHolderRules = ref([
  (v: string) => !!v || 'Hesap sahibi adı gereklidir',
  (v: string) => v.length >= 2 || 'Hesap sahibi adı en az 2 karakter olmalıdır'
])

// Form validation
const isFormValid = computed(() => {
  return formData.value.iban && 
         formData.value.fullName &&
         formData.value.iban.length >= 26 &&
         formData.value.fullName.length >= 2
})

// IBAN düzenlemeye başla
const startEdit = () => {
  isEditing.value = true
  formData.value = {
    iban: currentIban.value.iban,
    fullName: currentIban.value.accountHolder
  }
}

// Düzenlemeyi iptal et
const cancelEdit = () => {
  isEditing.value = false
  formData.value = {
    iban: '',
    fullName: ''
  }
}

// IBAN verilerini yükle
const loadBankAccount = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getBankAccounts()
    // API'den gelen veri array veya single object olabilir
    const bankAccount = Array.isArray(response) ? response[0] : response
    
    if (bankAccount) {
      currentIban.value = {
        bank_account_code: bankAccount.bank_account_code,
        iban: formatIban(bankAccount.iban),
        accountHolder: bankAccount.account_holder_name,
        is_verified: bankAccount.is_verified,
        verified_at: bankAccount.verified_at,
        created_at: bankAccount.created_at,
        updated_at: bankAccount.updated_at
      }
    } else {
      currentIban.value = null
    }
  } catch (err) {
    console.error('IBAN yükleme hatası:', err)
    error.value = 'IBAN bilgileri yüklenirken hata oluştu'
    currentIban.value = null
  } finally {
    loading.value = false
  }
}

// IBAN formatlama (TR840020500000779470100002 -> TR84 0020 5000 0077 9470 1000 02)
const formatIban = (iban: string) => {
  if (!iban) return ''
  const cleanIban = iban.replace(/\s/g, '')
  return cleanIban.replace(/(.{4})/g, '$1 ').trim()
}

// IBAN temizleme (TR84 0020 5000... -> TR840020500000...)
const cleanIban = (iban: string) => {
  return iban.replace(/\s/g, '')
}

// IBAN kaydet (ekle veya güncelle)
const saveIban = async () => {
  if (!isFormValid.value) return

  loading.value = true
  error.value = null

  try {
    // API beklenen format
    const payload = {
      account_holder_name: formData.value.fullName,
      iban: formData.value.iban.replace(/\s/g, '') // Boşlukları temizle
    }

    if (currentIban.value) {
      // Güncelle - PUT /bank-accounts/{bank_account_code}
      await updateBankAccount(currentIban.value.bank_account_code, payload)
      console.log('IBAN güncellendi')
      isEditing.value = false
    } else {
      // Yeni ekle - POST /bank-accounts
      await createBankAccount(payload)
      console.log('IBAN eklendi')
    }

    // Her save işleminden sonra fresh data yükle (token problem çözümü)
    await loadBankAccount()

    // Form'u temizle
    formData.value = {
      iban: '',
      fullName: ''
    }
  } catch (err) {
    console.error('IBAN kaydetme hatası:', err)
    error.value = 'IBAN kaydedilirken hata oluştu'
  } finally {
    loading.value = false
  }
}

// IBAN sil
const deleteIban = async () => {
  if (!confirm('IBAN bilginizi silmek istediğinizden emin misiniz?')) return

  loading.value = true
  error.value = null

  try {
    await deleteBankAccount(currentIban.value.bank_account_code)
    currentIban.value = null
    isEditing.value = false
    formData.value = {
      iban: '',
      fullName: ''
    }
    console.log('IBAN silindi')
  } catch (err) {
    console.error('IBAN silme hatası:', err)
    error.value = 'IBAN silinirken hata oluştu'
  } finally {
    loading.value = false
  }
}

// Sayfa yüklendiğinde
onMounted(async () => {
  await loadBankAccount()
})
</script>

<style scoped>
.iban-page {
  padding: 0;
  max-width: 800px;
}

.iban-page h2 {
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

.iban-card, .form-card, .info-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  margin-bottom: 1rem;
}

.iban-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.iban-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.iban-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-weight: 600;
}

.iban-number {
  font-family: monospace;
  font-size: 1rem;
  color: #666;
  margin: 0.25rem 0;
}

.account-holder {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

.iban-actions {
  display: flex;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.info-content {
  margin-top: 1rem;
}

.info-content p {
  margin: 0.5rem 0;
  color: #666;
  line-height: 1.5;
}

/* Loading state */
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

/* Error state */
.error-section {
  padding: 2rem;
  text-align: center;
}

/* Verification status */
.verification-status {
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .iban-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .iban-actions {
    align-self: flex-end;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}
</style>