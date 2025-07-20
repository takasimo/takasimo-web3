<template>
  <div class="account-dashboard">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Hesap Yönetimi</h1>
      <p class="text-grey text-body-1">
        Sol menüden yönetmek istediğiniz bölümü seçin
      </p>
    </div>

    <v-row>
      <!-- Hoş Geldin Kartı -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="welcome-card" elevation="2" border>
          <v-card-text class="pa-6">
            <div class="d-flex align-center mb-4">
              <v-avatar size="64" color="primary" class="mr-4">
                <v-icon size="32" color="white">mdi-account</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-semibold mb-1">
                  Hoş Geldiniz, {{ userDisplayName }}!
                </h3>
                <p class="text-body-2 text-grey">
                  Hesabınızı yönetmek için sol menüyü kullanın
                </p>
              </div>
            </div>
            
            <v-btn
              to="/account/profile"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-account-edit"
            >
              Profili Düzenle
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Hızlı İstatistikler -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="stats-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <h3 class="text-h6 font-weight-semibold">Hızlı İstatistikler</h3>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <v-row>
              <v-col cols="6">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-primary mb-2">
                    {{ stats.activeProducts }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Aktif İlan
                  </div>
                </div>
              </v-col>
              
              <v-col cols="6">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-primary mb-2">
                    {{ stats.favorites }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Favori
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Hızlı Erişim -->
      <v-col cols="12" class="mb-6">
        <v-card class="quick-access-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <h3 class="text-h6 font-weight-semibold">Hızlı Erişim</h3>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  to="/account/profile"
                  block
                  variant="outlined"
                  class="quick-btn mb-3"
                  prepend-icon="mdi-account"
                >
                  <div class="text-center">
                    <div class="text-body-2 font-weight-medium">Profil</div>
                    <div class="text-caption text-grey">Bilgileri düzenle</div>
                  </div>
                </v-btn>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  to="/account/products"
                  block
                  variant="outlined"
                  class="quick-btn mb-3"
                  prepend-icon="mdi-format-list-bulleted"
                >
                  <div class="text-center">
                    <div class="text-body-2 font-weight-medium">İlanlarım</div>
                    <div class="text-caption text-grey">İlanları yönet</div>
                  </div>
                </v-btn>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  to="/account/favorites"
                  block
                  variant="outlined"
                  class="quick-btn mb-3"
                  prepend-icon="mdi-heart"
                >
                  <div class="text-center">
                    <div class="text-body-2 font-weight-medium">Favorilerim</div>
                    <div class="text-caption text-grey">Favori ürünler</div>
                  </div>
                </v-btn>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  to="/account/security"
                  block
                  variant="outlined"
                  class="quick-btn mb-3"
                  prepend-icon="mdi-shield"
                >
                  <div class="text-center">
                    <div class="text-body-2 font-weight-medium">Güvenlik</div>
                    <div class="text-caption text-grey">Güvenlik ayarları</div>
                  </div>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Son Aktiviteler -->
      <v-col cols="12">
        <v-card class="activity-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <h3 class="text-h6 font-weight-semibold">Son Aktiviteler</h3>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div v-if="recentActivities.length > 0">
              <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item mb-3">
                <div class="d-flex align-center">
                  <v-icon :color="activity.color" size="20" class="mr-3">
                    {{ activity.icon }}
                  </v-icon>
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">{{ activity.title }}</div>
                    <div class="text-caption text-grey">{{ activity.time }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <v-icon size="48" color="grey" class="mb-4">mdi-information-outline</v-icon>
              <p class="text-grey text-body-1">Henüz aktivite bulunmuyor</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useProfileStore } from '~/stores/profileStore'

const profileStore = useProfileStore()

const userDisplayName = computed(() => {
  const user = profileStore.user
  if (!user) return 'Kullanıcı'
  
  return user.name || user.firstName || user.email || 'Kullanıcı'
})

const stats = ref({
  activeProducts: 3,
  favorites: 12
})

const recentActivities = ref([
  {
    title: 'Yeni ilan eklendi: "iPhone 13 Pro"',
    time: '2 saat önce',
    icon: 'mdi-plus-circle',
    color: 'success'
  },
  {
    title: 'Profil bilgileri güncellendi',
    time: '1 gün önce',
    icon: 'mdi-account-edit',
    color: 'info'
  },
  {
    title: 'Şifre değiştirildi',
    time: '3 gün önce',
    icon: 'mdi-lock-reset',
    color: 'warning'
  }
])
</script>

<style scoped>
.account-dashboard {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.welcome-card,
.stats-card,
.quick-access-card,
.activity-card {
  border-radius: 16px;
  background: white;
  height: 100%;
}

.quick-btn {
  height: 80px;
  border-radius: 12px;
}

.quick-btn .v-btn__content {
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-item {
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
}

.activity-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.activity-item:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .welcome-card,
  .stats-card,
  .quick-access-card,
  .activity-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .welcome-card .v-card-text,
  .stats-card .v-card-text,
  .quick-access-card .v-card-text,
  .activity-card .v-card-text {
    padding: 16px;
  }
  
  .welcome-card .v-card-title,
  .stats-card .v-card-title,
  .quick-access-card .v-card-title,
  .activity-card .v-card-title {
    padding: 16px;
  }
}
</style> 