<template>
  <div class="settings-page">
    <h2>Hesap Ayarları</h2>
    
    <!-- Ayarlar Formu -->
    <v-card class="settings-card">
      <v-card-text>
        <v-form>
          <!-- İl -->
          <div class="form-group">
            <label class="form-label">İl</label>
            <v-select
              v-model="settings.province"
              :items="provinces"
              variant="outlined"
              density="comfortable"
              placeholder="Bitlis"
              hide-details
              class="form-field"
            />
          </div>

          <!-- İlçe -->
          <div class="form-group">
            <label class="form-label">İlçe</label>
            <v-select
              v-model="settings.district"
              :items="districts"
              variant="outlined"
              density="comfortable"
              placeholder="Merkez"
              hide-details
              class="form-field"
            />
          </div>

          <!-- Mahalle -->
          <div class="form-group">
            <label class="form-label">Mahalle</label>
            <v-select
              v-model="settings.neighborhood"
              :items="neighborhoods"
              variant="outlined"
              density="comfortable"
              placeholder="Beş Minare Mah."
              hide-details
              class="form-field"
            />
          </div>

          <!-- Adres Detayı -->
          <div class="form-group">
            <label class="form-label">
              Adres Detayı 
              <span class="form-hint">(Bu alan izde işlemleri için kullanılacaktır)</span>
            </label>
            <v-textarea
              v-model="settings.addressDetail"
              variant="outlined"
              density="comfortable"
              rows="3"
              placeholder="Rauf Denktaş caddesi no:114 kat:4 daire 11"
              hide-details
              class="form-field"
            />
          </div>

          <!-- Takas Teklifi -->
          <div class="form-group">
            <div class="toggle-group">
              <label class="form-label">Takas Teklifi</label>
              <v-switch
                v-model="settings.exchangeOffer"
                color="primary"
                hide-details
                class="toggle-switch"
              />
            </div>
          </div>

          <!-- İletişim Seçenekleri -->
          <div class="form-group">
            <label class="form-label">İletişim Seçenekleri</label>
            <v-select
              v-model="settings.contactOptions"
              :items="contactOptionsList"
              variant="outlined"
              density="comfortable"
              placeholder="Mesaj"
              hide-details
              class="form-field"
            />
          </div>

          <!-- Ödeme Yöntemi -->
          <div class="form-group">
            <label class="form-label">Ödeme Yöntemi</label>
            <v-select
              v-model="settings.paymentMethod"
              :items="paymentMethods"
              variant="outlined"
              density="comfortable"
              placeholder="Banka / Kredi Kartı"
              hide-details
              class="form-field"
            />
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Ayarları Kaydet Butonu -->
    <div class="save-section">
      <v-btn 
        color="primary" 
        size="large" 
        block
        @click="saveSettings"
        class="save-btn"
      >
        Ayarları Kaydet
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ayar verileri
const settings = ref({
  province: 'Bitlis',
  district: 'Merkez',
  neighborhood: 'Beş Minare Mah.',
  addressDetail: 'Rauf Denktaş caddesi no:114 kat:4 daire 11',
  exchangeOffer: false,
  contactOptions: 'Mesaj',
  paymentMethod: 'Banka / Kredi Kartı'
})

// Seçenek listeleri
const provinces = ref([
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta',
  'İçel', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
  'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop',
  'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van',
  'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak',
  'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
])

const districts = ref([
  'Merkez', 'Ahlat', 'Adilcevaz', 'Güroymak', 'Hizan', 'Mutki', 'Tatvan'
])

const neighborhoods = ref([
  'Beş Minare Mah.', 'Çarşı Mah.', 'Atatürk Mah.', 'Cumhuriyet Mah.', 'Yeni Mah.', 'Merkez Mah.'
])

const contactOptionsList = ref([
  'Mesaj', 'Telefon', 'E-posta', 'WhatsApp', 'Hepsi'
])

const paymentMethods = ref([
  'Banka / Kredi Kartı', 'Nakit', 'Havale / EFT', 'Kapıda Ödeme', 'Kripto Para'
])

// Ayarları kaydetme
const saveSettings = () => {
  console.log('Ayarlar kaydediliyor:', settings.value)
  // API çağrısı yapılacak
  // Başarılı mesajı göster
}
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

/* Vuetify Select Override */
:deep(.v-select .v-field) {
  border-radius: 8px;
}

:deep(.v-textarea .v-field) {
  border-radius: 8px;
}

:deep(.v-switch .v-selection-control) {
  min-height: auto;
}

:deep(.v-switch .v-switch__thumb) {
  color: #fff;
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