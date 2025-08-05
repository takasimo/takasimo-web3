<template>
  <div class="iban-page">
    <h2>IBAN Bilgilerim</h2>
    
    <!-- Mevcut IBAN Bilgileri -->
    <div class="section">
      <h3>Kayıtlı IBAN Bilgileri</h3>
      
      <v-card class="iban-card" v-if="ibanList.length > 0">
        <v-card-text v-for="(iban, index) in ibanList" :key="index">
          <div class="iban-item">
            <div class="iban-info">
              <h4>{{ iban.bankName }}</h4>
              <p class="iban-number">{{ iban.iban }}</p>
              <p class="account-holder">{{ iban.accountHolder }}</p>
            </div>
            <div class="iban-actions">
              <v-btn variant="outlined" size="small" @click="editIban(index)">Düzenle</v-btn>
              <v-btn variant="outlined" color="error" size="small" @click="deleteIban(index)">Sil</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-alert v-else type="info" class="mb-4">
        Henüz kayıtlı IBAN bilginiz bulunmamaktadır.
      </v-alert>
    </div>

    <!-- Yeni IBAN Ekleme -->
    <div class="section">
      <h3>Yeni IBAN Ekle</h3>
      
      <v-card class="add-iban-card">
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newIban.bankName"
                  label="Banka Adı"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newIban.iban"
                  label="IBAN Numarası"
                  variant="outlined"
                  density="comfortable"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newIban.accountHolder"
                  label="Hesap Sahibi"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" @click="addIban" :disabled="!isFormValid">
                  IBAN Ekle
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
// IBAN verileri
const ibanList = ref([
  {
    bankName: 'Ziraat Bankası',
    iban: 'TR64 0001 0000 0000 0000 0000 01',
    accountHolder: 'Oktay Tontaş'
  }
])

const newIban = ref({
  bankName: '',
  iban: '',
  accountHolder: ''
})

// Form validation
const isFormValid = computed(() => {
  return newIban.value.bankName && 
         newIban.value.iban && 
         newIban.value.accountHolder
})

// IBAN ekleme
const addIban = () => {
  if (isFormValid.value) {
    ibanList.value.push({ ...newIban.value })
    // Form'u temizle
    newIban.value = {
      bankName: '',
      iban: '',
      accountHolder: ''
    }
  }
}

// IBAN düzenleme
const editIban = (index: number) => {
  console.log('IBAN düzenle:', index)
  // Düzenleme modal'ı açılacak
}

// IBAN silme
const deleteIban = (index: number) => {
  if (confirm('Bu IBAN bilgisini silmek istediğinizden emin misiniz?')) {
    ibanList.value.splice(index, 1)
  }
}
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

.iban-card, .add-iban-card {
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
}
</style>