<template>
  <div class="account-layout">
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <!-- Sidebar -->
        <v-col cols="12" md="3" lg="2" class="sidebar-col">
          <v-card class="sidebar-card" elevation="2" border>
            <v-card-text class="pa-0">
              <!-- Profil Bölümü -->
              <v-list class="sidebar-list">
                <v-list-group value="profile">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-account"
                      title="Profil"
                      class="sidebar-group-header"
                    />
                  </template>
                  
                  <v-list-item
                    to="/account/dashboard"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/dashboard' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-view-dashboard</v-icon>
                    </template>
                    <v-list-item-title>Genel Bakış</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    to="/account/profile"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/profile' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-account-edit</v-icon>
                    </template>
                    <v-list-item-title>Kişisel Bilgiler</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    to="/account/password"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/password' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-lock</v-icon>
                    </template>
                    <v-list-item-title>Şifre Değiştir</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    to="/account/security"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/security' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-shield</v-icon>
                    </template>
                    <v-list-item-title>Güvenlik</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list>

              <!-- Hesap Bölümü -->
              <v-list class="sidebar-list">
                <v-list-group value="account">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-cog"
                      title="Hesap"
                      class="sidebar-group-header"
                    />
                  </template>
                  
                  <v-list-item
                    to="/account/notifications"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/notifications' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-bell</v-icon>
                    </template>
                    <v-list-item-title>Bildirimler</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    to="/account/addresses"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/addresses' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-map-marker</v-icon>
                    </template>
                    <v-list-item-title>Kayıtlı Adreslerim</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    to="/account/products"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/products' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-format-list-bulleted</v-icon>
                    </template>
                    <v-list-item-title>İlanlarım</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    to="/account/favorites"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/favorites' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-heart</v-icon>
                    </template>
                    <v-list-item-title>Favorilerim</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    to="/account/settings"
                    class="sidebar-sub-item"
                    :class="{ 'active': $route.path === '/account/settings' }"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-cog</v-icon>
                    </template>
                    <v-list-item-title>Hesap Ayarları</v-list-item-title>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Content Area -->
        <v-col cols="12" md="9" lg="10" class="content-col">
          <v-card class="content-card" elevation="2" border>
            <v-card-text class="pa-6">
              <!-- Child Routes -->
              <NuxtPage />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()

// Auth kontrolü
onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
  }
})

// Default route'a yönlendir
onMounted(() => {
  const route = useRoute()
  if (route.path === '/account') {
    navigateTo('/account/dashboard')
  }
})
</script>

<style scoped>
.account-layout {
  min-height: 100vh;
  background: #f5f5f5;
}

.sidebar-col {
  background: white;
  border-right: 1px solid #e0e0e0;
}

.sidebar-card {
  border-radius: 0;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-list {
  padding: 0;
}

.sidebar-group-header {
  font-weight: 600;
  color: #1a1a1a;
  background: #f8f9fa;
}

.sidebar-sub-item {
  padding-left: 32px;
  min-height: 40px;
  border-radius: 0;
  transition: all 0.2s ease;
}

.sidebar-sub-item:hover {
  background: #f0f0f0;
}

.sidebar-sub-item.active {
  background: #e3f2fd;
  color: #1976d2;
  border-right: 3px solid #1976d2;
}

.content-col {
  padding: 24px;
}

.content-card {
  border-radius: 16px;
  background: white;
  min-height: calc(100vh - 48px);
}

/* Responsive Design */
@media (max-width: 960px) {
  .sidebar-col {
    position: fixed;
    top: 0;
    left: -100%;
    width: 280px;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
  }
  
  .sidebar-col.show {
    left: 0;
  }
  
  .content-col {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .content-col {
    padding: 8px;
  }
  
  .content-card {
    border-radius: 12px;
  }
}
</style> 