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
      <div v-if="currentIban" class="section">
        <h3>Kayıtlı IBAN Bilgim</h3>
        
        <v-card class="info-card">
          <v-card-text>
            <div class="info-item">
              <div class="info-details">
                <h3>IBAN Numarası</h3>
                <p class="iban-number">{{ currentIban.iban }}</p>
                <p class="account-holder">{{ currentIban.accountHolder }}</p>
                <div class="verification-status">
                  <v-chip 
                    :color="currentIban.is_verified ? 'success' : 'warning'"
                    size="x-small"
                    :prepend-icon="currentIban.is_verified ? 'mdi-check-circle' : 'mdi-clock'"
                  >
                    {{ currentIban.is_verified ? 'Doğrulanmış' : 'Doğrulama Bekliyor' }}
                  </v-chip>
                </div>
              </div>
              <v-btn 
                variant="outlined" 
                class="update-btn"
                @click="startEdit"
                :disabled="loading"
              >
                Düzenle
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- IBAN Ekleme/Güncelleme Formu -->
      <div class="section">
        <h3>{{ currentIban ? 'IBAN Güncelle' : 'IBAN Ekle' }}</h3>
        
        <v-card class="form-card">
          <v-card-text>
            <v-form @submit.prevent="saveIban">
              <div class="input-section">
                <v-text-field
                  v-model="formData.iban"
                  label="IBAN Numarası"
                  variant="outlined"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  required
                  hide-details
                />
              </div>
              
              <div class="input-section">
                <v-text-field
                  v-model="formData.fullName"
                  label="Hesap Sahibi"
                  variant="outlined"
                  required
                  hide-details
                />
              </div>
              
              <div class="form-actions">
                <v-btn 
                  type="submit"
                  color="primary" 
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
            </v-form>
          </v-card-text>
        </v-card>
      </div>

      <!-- IBAN Hakkında Bilgi -->
      <div class="section">
        <v-card class="info-card">
          <v-card-text>
            <div class="info-item">
              <div class="info-details">
                <h3>IBAN Hakkında</h3>
                <div class="info-content">
                  <p>• IBAN numaranız satış ödemeleriniz için kullanılacaktır</p>
                  <p>• IBAN numaranız sadece size ait olmalıdır</p>
                  <p>• IBAN bilginizi dilediğiniz zaman güncelleyebilirsiniz</p>
                </div>
              </div>
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

// Form validation rules - artık kullanılmıyor
// const ibanRules = [
//   (v: string) => !!v || 'IBAN numarası gereklidir',
//   (v: string) => /^TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/.test(v.replace(/\s/g, '')) || 'Geçerli bir IBAN numarası giriniz'
// ]

// const accountHolderRules = [
//   (v: string) => !!v || 'Hesap sahibi adı gereklidir',
//   (v: string) => v.length >= 2 || 'Hesap sahibi adı en az 2 karakter olmalıdır'
// ]

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
      isEditing.value = false
    } else {
      // Yeni ekle - POST /bank-accounts
      await createBankAccount(payload)
    }

    // Her save işleminden sonra fresh data yükle (token problem çözümü)
    await loadBankAccount()

    // Form'u temizle ve düzenleme modunu kapat
    formData.value = {
      iban: '',
      fullName: ''
    }
    isEditing.value = false
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

.info-card {
  margin-bottom: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f8fafc;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;
}

.info-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: #f1f5f9;
}

.info-card .v-card-text {
  padding: 0;
  position: relative;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  position: relative;
}

.info-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #8B2865;
  opacity: 0.3;
}

.info-details {
  flex: 1;
}

.info-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
  letter-spacing: -0.01em;
}

.info-details p {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 400;
}

.update-btn {
  margin-left: 1rem;
  color: #8B2865 !important;
  border: 1px solid #e5e7eb !important;
  background: #ffffff !important;
  padding: 0.6rem 1.2rem !important;
  font-size: 0.85rem !important;
  font-weight: 500 !important;
  text-transform: none !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  letter-spacing: 0 !important;
  box-shadow: none !important;
}

.update-btn:hover {
  background: #8B2865 !important;
  color: white !important;
  border-color: #8B2865 !important;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(139, 40, 101, 0.15) !important;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  margin-bottom: 1rem;
}

.input-section {
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.info-content {
  margin-top: 1rem;
}

.info-content p {
  margin: 0.5rem 0;
  color: #666;
  line-height: 1.5;
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
  margin-top: 0.75rem;
}

.verification-status :deep(.v-chip) {
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  border-radius: 6px !important;
  padding: 0 10px !important;
  font-size: 0.8rem !important;
}

/* Responsive */
@media (max-width: 768px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .update-btn {
    margin-left: 0;
    align-self: flex-end;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}
</style>