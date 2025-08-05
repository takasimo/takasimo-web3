
<template>
  <v-main>
    <v-container class="profile-layout">
      <!-- Sol Sidebar -->
      <aside class="menu">
        <!-- Profil Header -->
        <div class="profile-header">
          <v-avatar size="40" class="profile-avatar">
            <img src="/assets/images/logo/logo.svg" alt="Profile">
          </v-avatar>
          <div class="profile-info">
            <h3 class="profile-name">Oktay tontaş</h3>
            <p class="profile-email">oktay1125@gmail.com</p>
          </div>
        </div>

        <!-- Menü -->
        <div class="menu-items">
          <!-- Profil Bilgilerim -->
          <NuxtLink to="/profile" class="menu-item">
            <v-icon class="menu-icon">mdi-account</v-icon>
            <span class="menu-text">Profil Bilgilerim</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Iban Bilgilerim -->
          <NuxtLink to="/profile/iban" class="menu-item">
            <v-icon class="menu-icon">mdi-bank</v-icon>
            <span class="menu-text">Iban Bilgilerim</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Kayıtlı Adreslerim -->
          <NuxtLink to="/profile/addresses" class="menu-item">
            <v-icon class="menu-icon">mdi-map-marker</v-icon>
            <span class="menu-text">Kayıtlı Adreslerim</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Hesap Ayarları -->
          <NuxtLink to="/profile/settings" class="menu-item">
            <v-icon class="menu-icon">mdi-cog</v-icon>
            <span class="menu-text">Hesap Ayarları</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Siparişlerim -->
          <NuxtLink to="/profile/orders" class="menu-item">
            <v-icon class="menu-icon">mdi-shopping</v-icon>
            <span class="menu-text">Siparişlerim</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Satışlarım -->
          <NuxtLink to="/profile/sales" class="menu-item">
            <v-icon class="menu-icon">mdi-currency-usd</v-icon>
            <span class="menu-text">Satışlarım</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- İlanlarım -->
          <NuxtLink to="/profile/listings" class="menu-item">
            <v-icon class="menu-icon">mdi-view-list</v-icon>
            <span class="menu-text">İlanlarım</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Favorilerim -->
          <NuxtLink to="/profile/favorites" class="menu-item">
            <v-icon class="menu-icon">mdi-heart</v-icon>
            <span class="menu-text">Favorilerim</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Nasıl Çalışır -->
          <NuxtLink to="/profile/help" class="menu-item">
            <v-icon class="menu-icon">mdi-help-circle</v-icon>
            <span class="menu-text">Nasıl Çalışır</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Takasimo Destek -->
          <NuxtLink to="/profile/support" class="menu-item">
            <v-icon class="menu-icon">mdi-headset</v-icon>
            <span class="menu-text">Takasimo Destek</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </NuxtLink>

          <!-- Çıkış -->
          <div class="menu-item logout-item" @click="logout">
            <v-icon class="menu-icon logout-icon">mdi-logout</v-icon>
            <span class="menu-text logout-text">Çıkış</span>
            <v-icon class="menu-arrow">mdi-chevron-right</v-icon>
          </div>


        </div>
      </aside>

      <!-- Sağ İçerik Alanı -->
      <main class="content">
        <NuxtPage />
      </main>
    </v-container>
  </v-main>

</template>

<script setup lang="ts">
// Logout fonksiyonu
const logout = () => {
  // Logout işlemi burada yapılacak
  console.log('Çıkış yapılıyor...')
  // Örnek: Auth store'dan logout çağır
  // await authStore.logout()
  // navigateTo('/auth/login')
}
</script>


<style scoped>
/* Vuetify Override */
:deep(.v-main) {
  padding: 0 !important;
}

:deep(.v-container) {
  max-width: 100% !important;
  padding: 0 !important;
}

.profile-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  width: 100%;
}

/* Sol Menü */
.menu {
  width: 300px;
  background-color: white;
  border-radius: 12px;
  margin: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

/* Profil Header */
.profile-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  gap: 0.75rem;
}

.profile-info {
  flex: 1;
}

.profile-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.profile-email {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #666;
}

/* Menü Items */
.menu-items {
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  color: #333;
  position: relative;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item.router-link-active {
  background-color: #f0f9ff;
}

.menu-item.highlighted {
  position: relative;
}

.menu-icon {
  margin-right: 0.75rem;
  color: #666;
  font-size: 1.25rem;
}

.menu-text {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.menu-arrow {
  color: #999;
  font-size: 1.125rem;
}

/* Kırmızı İndikatör */
.red-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #dc2626;
  border-radius: 0 4px 4px 0;
}

/* Sağ İçerik Alanı */
.content {
  flex: 1;
  padding: 1rem;
  background-color: #f5f5f5;
}

/* Logout Özel Stili */
.logout-item {
  border-top: 1px solid #e5e5e5;
  margin-top: 0.5rem;
}

.logout-item:hover {
  background-color: #fef2f2 !important;
}

.logout-icon {
  color: #dc2626 !important;
}

.logout-text {
  color: #dc2626 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }
  
  .menu {
    width: 100%;
    margin: 0.5rem;
    border-radius: 8px;
  }
  
  .profile-header {
    padding: 1rem;
  }
  
  .menu-item {
    padding: 0.75rem 1rem;
  }
  
  .content {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .menu {
    margin: 0.25rem;
  }
  
  .content {
    padding: 0.25rem;
  }
}
</style>