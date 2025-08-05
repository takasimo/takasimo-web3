<template>
  <div class="profile-content">
    <h2>Hesap Bilgileri</h2>
    
    <!-- E-Posta Kartı -->
    <v-card class="info-card">
      <v-card-text>
        <div class="info-item">
          <div class="info-details">
            <h3>E-Posta</h3>
            <p>oktay1125@gmail.com</p>
          </div>
          <v-btn variant="outlined" class="update-btn">Güncelle</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Sosyal Medya Bağlantıları Kartı -->
    <v-card class="info-card">
      <v-card-text>
        <div class="info-item">
          <div class="info-details">
            <h3>Sosyal Medya Bağlantıları</h3>
            <p>Google, Facebook, X (Twitter)</p>
          </div>
          <v-btn variant="outlined" class="update-btn">Güncelle</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <h2 class="section-title">Profiliniz</h2>
    
    <!-- İsminiz Kartı -->
    <v-card class="info-card">
      <v-card-text>
        <div class="info-item">
          <div class="info-details">
            <h3>İsminiz</h3>
            <p>Oktay tontaş</p>
          </div>
          <v-btn variant="outlined" class="update-btn">Güncelle</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Kullanıcı Adınız Kartı -->
    <v-card class="info-card">
      <v-card-text>
        <div class="info-item">
          <div class="info-details">
            <h3>Kullanıcı Adınız</h3>
            <p>GmEkn2LVQJfwjRFwVSQZhkSlBw32</p>
          </div>
          <v-btn variant="outlined" class="update-btn">Güncelle</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Profil Resminiz Kartı -->
    <v-card class="info-card">
      <v-card-text>
        <div class="info-item">
          <div class="info-details">
            <h3>Profil Resminiz</h3>
          </div>
          <v-btn variant="outlined" class="update-btn">Güncelle</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Genel Bilgileriniz Kartı -->
    <v-card class="info-card">
      <v-card-text>
        <div class="info-item">
          <div class="info-details">
            <h3>Genel Bilgileriniz</h3>
            <p>Invalid Date</p>
          </div>
          <v-btn variant="outlined" class="update-btn">Güncelle</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.profile-content {
  padding: 0;
  max-width: 800px;
}

.profile-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-title {
  margin: 2rem 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.info-card {
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.info-card .v-card-text {
  padding: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.info-details {
  flex: 1;
}

.info-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.info-details p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.update-btn {
  margin-left: 1rem;
  color: #333 !important;
  border-color: #d1d5db !important;
  background-color: white !important;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  text-transform: none;
}

.update-btn:hover {
  background-color: #f9fafb !important;
  border-color: #9ca3af !important;
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
  
  .info-card .v-card-text {
    padding: 1rem;
  }
}
</style>
