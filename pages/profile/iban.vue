<template>
  <div class="iban-page">
    <h2>IBAN Bilgilerim</h2>
    
    <!-- Mevcut IBAN Bilgileri -->
    <div class="section" v-if="currentIban">
      <h3>Kayıtlı IBAN Bilgim</h3>
      
      <v-card class="iban-card">
        <v-card-text>
          <div class="iban-item">
            <div class="iban-info">
              <p class="iban-number">{{ currentIban.iban }}</p>
              <p class="account-holder">{{ currentIban.accountHolder }}</p>
            </div>
            <div class="iban-actions">
              <v-btn variant="outlined" size="small" @click="startEdit">Düzenle</v-btn>
              <v-btn variant="outlined" color="error" size="small" @click="deleteIban">Sil</v-btn>
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
                  v-model="formData.accountHolder"
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
                    :disabled="!isFormValid"
                    size="large"
                  >
                    {{ currentIban ? 'IBAN Güncelle' : 'IBAN Ekle' }}
                  </v-btn>
                  
                  <v-btn 
                    v-if="isEditing" 
                    variant="outlined" 
                    @click="cancelEdit"
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
            <p>• Ödemeler 1-2 iş günü içinde hesabınıza geçecektir</p>
            <p>• IBAN bilginizi dilediğiniz zaman güncelleyebilirsiniz</p>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// IBAN verileri - sadece tek IBAN
// Test için null yapabilirsiniz: const currentIban = ref(null)
const currentIban = ref({
  iban: 'TR64 0001 0000 0000 0000 0000 01',
  accountHolder: 'Oktay Tontaş'
})

// Form verileri
const formData = ref({
  iban: '',
  accountHolder: ''
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
         formData.value.accountHolder &&
         formData.value.iban.length >= 26 &&
         formData.value.accountHolder.length >= 2
})

// IBAN düzenlemeye başla
const startEdit = () => {
  isEditing.value = true
  formData.value = {
    iban: currentIban.value.iban,
    accountHolder: currentIban.value.accountHolder
  }
}

// Düzenlemeyi iptal et
const cancelEdit = () => {
  isEditing.value = false
  formData.value = {
    iban: '',
    accountHolder: ''
  }
}

// IBAN kaydet (ekle veya güncelle)
const saveIban = () => {
  if (!isFormValid.value) return

  if (currentIban.value) {
    // Güncelle
    currentIban.value = { ...formData.value }
    isEditing.value = false
    console.log('IBAN güncellendi')
  } else {
    // Yeni ekle
    currentIban.value = { ...formData.value }
    console.log('IBAN eklendi')
  }

  // Form'u temizle
  formData.value = {
    iban: '',
    accountHolder: ''
  }
}

// IBAN sil
const deleteIban = () => {
  if (confirm('IBAN bilginizi silmek istediğinizden emin misiniz?')) {
    currentIban.value = null
    isEditing.value = false
    formData.value = {
      iban: '',
      accountHolder: ''
    }
    console.log('IBAN silindi')
  }
}

// Sayfa yüklendiğinde
onMounted(() => {
  // Eğer IBAN yoksa form alanlarını boş bırak
  if (!currentIban.value) {
    formData.value = {
      iban: '',
      accountHolder: ''
    }
  }
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