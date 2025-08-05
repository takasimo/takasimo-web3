<template>
  <div class="settings-page">
    <h2>Hesap Ayarları</h2>
    
    <!-- Gizlilik Ayarları -->
    <div class="section">
      <h3>Gizlilik Ayarları</h3>
      
      <v-card class="settings-card">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.profileVisible"
                label="Profilimi herkese göster"
                color="primary"
                density="comfortable"
              />
              <p class="switch-description">Profiliniz diğer kullanıcılar tarafından görülebilir</p>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.showPhone"
                label="Telefon numaram gösterilsin"
                color="primary"
                density="comfortable"
              />
              <p class="switch-description">İlan sahipleri telefon numaranızı görebilir</p>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.showEmail"
                label="E-posta adresim gösterilsin"
                color="primary"
                density="comfortable"
              />
              <p class="switch-description">İlan sahipleri e-posta adresinizi görebilir</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Bildirim Ayarları -->
    <div class="section">
      <h3>Bildirim Ayarları</h3>
      
      <v-card class="settings-card">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.emailNotifications"
                label="E-posta bildirimleri"
                color="primary"
                density="comfortable"
              />
              <p class="switch-description">Yeni mesajlar ve güncellemeler için e-posta alın</p>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.smsNotifications"
                label="SMS bildirimleri"
                color="primary"
                density="comfortable"
              />
              <p class="switch-description">Önemli güncellemeler için SMS alın</p>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.pushNotifications"
                label="Anlık bildirimler"
                color="primary"
                density="comfortable"
              />
              <p class="switch-description">Tarayıcı bildirimleri alın</p>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="settings.marketingEmails"
                label="Pazarlama e-postaları"
                color="primary"
                density="comfortable"
              />
              <p class="switch-description">Kampanya ve özel teklifler hakkında bilgi alın</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Hesap Güvenliği -->
    <div class="section">
      <h3>Hesap Güvenliği</h3>
      
      <v-card class="settings-card">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div class="security-item">
                <div class="security-info">
                  <h4>Şifre Değiştir</h4>
                  <p>Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin</p>
                </div>
                <v-btn variant="outlined" @click="changePassword">Şifre Değiştir</v-btn>
              </div>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <div class="security-item">
                <div class="security-info">
                  <h4>İki Faktörlü Doğrulama</h4>
                  <p>Hesabınıza ek güvenlik katmanı ekleyin</p>
                </div>
                <v-btn variant="outlined" @click="setupTwoFactor">Kurulum</v-btn>
              </div>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <div class="security-item">
                <div class="security-info">
                  <h4>Aktif Oturumlar</h4>
                  <p>Diğer cihazlardaki oturumlarınızı yönetin</p>
                </div>
                <v-btn variant="outlined" @click="manageSessions">Oturumları Gör</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Hesap Silme -->
    <div class="section">
      <h3>Tehlikeli Alan</h3>
      
      <v-card class="settings-card danger-card">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div class="security-item">
                <div class="security-info">
                  <h4 class="danger-text">Hesabı Sil</h4>
                  <p>Hesabınızı kalıcı olarak silmek istiyorsanız. Bu işlem geri alınamaz!</p>
                </div>
                <v-btn color="error" variant="outlined" @click="deleteAccount">Hesabı Sil</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Kaydet Butonu -->
    <div class="section">
      <v-btn color="primary" size="large" @click="saveSettings">
        Ayarları Kaydet
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ayar verileri
const settings = ref({
  profileVisible: true,
  showPhone: true,
  showEmail: false,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: false
})

// Ayarları kaydetme
const saveSettings = () => {
  console.log('Ayarlar kaydediliyor:', settings.value)
  // API çağrısı yapılacak
}

// Şifre değiştirme
const changePassword = () => {
  console.log('Şifre değiştirme sayfasına yönlendir')
  navigateTo('/profile/password')
}

// İki faktörlü doğrulama
const setupTwoFactor = () => {
  console.log('İki faktörlü doğrulama kurulumu')
}

// Oturum yönetimi
const manageSessions = () => {
  console.log('Aktif oturumları göster')
}

// Hesap silme
const deleteAccount = () => {
  if (confirm('Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
    console.log('Hesap silme işlemi')
  }
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

.section {
  margin-bottom: 3rem;
}

.section h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.settings-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.switch-description {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-weight: 600;
}

.security-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.danger-card {
  border-color: #fee2e2 !important;
  background-color: #fef2f2 !important;
}

.danger-text {
  color: #dc2626 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>