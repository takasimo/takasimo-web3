<script setup lang="ts">
import { useProfileStore } from '~/stores/profileStore'
import { useAuthStore } from '~/stores/authStore'

const profileStore = useProfileStore()
const authStore = useAuthStore()

// Current section state
const currentSection = ref('dashboard')

// Auth kontrolü
onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
  }
})

// Navigate to section function
const navigateToSection = (section: string) => {
  currentSection.value = section
  console.log('Navigating to section:', section)
}
</script>

<template>
  <v-main class="account-page">
    <v-container class="py-8">
      <v-row>
        <!-- Sol Sidebar -->
        <v-col cols="12" md="4" lg="3" class="sidebar-col">
          <v-card class="sidebar-card" elevation="2" border>
            <v-card-title class="pa-6 pb-4">
              <h2 class="text-h6 font-weight-bold">Takasimo Profilim</h2>
            </v-card-title>
            
            <v-card-text class="pa-0">
              <v-list class="sidebar-menu">
                <!-- Kişisel Bilgilerim -->
                <v-list-group value="personal">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-account"
                      title="Kişisel Bilgilerim"
                      class="sidebar-item"
                    />
                  </template>
                  
                  <v-list-item
                    @click="navigateToSection('profile')"
                    class="sidebar-sub-item"
                    :class="{ 'active': currentSection === 'profile' }"
                  >
                    <template v-slot:prepend>
                      <div class="sub-item-indicator"></div>
                    </template>
                    <v-list-item-title>Kişisel Bilgiler</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    @click="navigateToSection('password')"
                    class="sidebar-sub-item"
                    :class="{ 'active': currentSection === 'password' }"
                  >
                    <template v-slot:prepend>
                      <div class="sub-item-indicator"></div>
                    </template>
                    <v-list-item-title>Şifre</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item
                    @click="navigateToSection('security')"
                    class="sidebar-sub-item"
                    :class="{ 'active': currentSection === 'security' }"
                  >
                    <template v-slot:prepend>
                      <div class="sub-item-indicator"></div>
                    </template>
                    <v-list-item-title>Güvenlik</v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <v-divider class="my-2"></v-divider>

                <!-- Bildirimler -->
                <v-list-item
                  @click="navigateToSection('notifications')"
                  class="sidebar-item"
                  :class="{ 'active': currentSection === 'notifications' }"
                  prepend-icon="mdi-bell"
                  title="Bildirimler"
                />

                <v-divider class="my-2"></v-divider>

                <!-- Kayıtlı Adreslerim -->
                <v-list-item
                  @click="navigateToSection('addresses')"
                  class="sidebar-item"
                  :class="{ 'active': currentSection === 'addresses' }"
                  prepend-icon="mdi-map-marker"
                  title="Kayıtlı Adreslerim"
                />

                <v-divider class="my-2"></v-divider>

                <!-- İlanlarım -->
                <v-list-item
                  @click="navigateToSection('products')"
                  class="sidebar-item"
                  :class="{ 'active': currentSection === 'products' }"
                  prepend-icon="mdi-format-list-bulleted"
                  title="İlanlarım"
                />

                <v-divider class="my-2"></v-divider>

                <!-- Favorilerim -->
                <v-list-item
                  @click="navigateToSection('favorites')"
                  class="sidebar-item"
                  :class="{ 'active': currentSection === 'favorites' }"
                  prepend-icon="mdi-heart"
                  title="Favorilerim"
                />

                <v-divider class="my-2"></v-divider>

                <!-- Hesap Ayarları -->
                <v-list-item
                  @click="navigateToSection('settings')"
                  class="sidebar-item"
                  :class="{ 'active': currentSection === 'settings' }"
                  prepend-icon="mdi-cog"
                  title="Hesap Ayarları"
                />
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sağ Content Alanı -->
        <v-col cols="12" md="8" lg="9" class="content-col">
          <v-card class="content-card" elevation="2" border>
            <v-card-text class="pa-6">
              <!-- Dynamic Content Based on Section -->
              <div v-if="currentSection === 'dashboard'">
                <AccountDashboard @navigate="navigateToSection" />
              </div>
              
              <div v-else-if="currentSection === 'profile'">
                <AccountProfile />
              </div>
              
              <div v-else-if="currentSection === 'password'">
                <AccountPassword />
              </div>
              
              <div v-else-if="currentSection === 'security'">
                <AccountSecurity />
              </div>
              
              <div v-else-if="currentSection === 'notifications'">
                <AccountNotifications />
              </div>
              
              <div v-else-if="currentSection === 'addresses'">
                <AccountAddresses />
              </div>
              
              <div v-else-if="currentSection === 'products'">
                <AccountProducts />
              </div>
              
              <div v-else-if="currentSection === 'favorites'">
                <AccountFavorites />
              </div>
              
              <div v-else-if="currentSection === 'settings'">
                <AccountSettings />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.account-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.sidebar-card {
  border-radius: 16px;
  background: white;
  position: sticky;
  top: 24px;
}

.content-card {
  border-radius: 16px;
  background: white;
  min-height: 600px;
}

.sidebar-menu {
  padding: 0;
}

.sidebar-item {
  padding: 12px 24px;
  margin: 2px 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background-color: rgba(139, 40, 101, 0.05);
}

.sidebar-item.active {
  background-color: rgba(139, 40, 101, 0.1);
  color: #8B2865;
}

.sidebar-item.active .v-list-item-title {
  color: #8B2865;
  font-weight: 600;
}

.sidebar-sub-item {
  padding: 8px 24px 8px 48px;
  margin: 2px 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.sidebar-sub-item:hover {
  background-color: rgba(139, 40, 101, 0.05);
}

.sidebar-sub-item.active {
  background-color: rgba(139, 40, 101, 0.1);
  color: #8B2865;
}

.sidebar-sub-item.active .v-list-item-title {
  color: #8B2865;
  font-weight: 600;
}

.sub-item-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #8B2865;
  margin-right: 8px;
}

.sidebar-sub-item.active .sub-item-indicator {
  background-color: #8B2865;
}

/* Vuetify override for list group */
:deep(.v-list-group__items .v-list-item) {
  padding-left: 48px;
}

:deep(.v-list-group__header) {
  padding: 12px 24px;
  margin: 2px 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.v-list-group__header:hover) {
  background-color: rgba(139, 40, 101, 0.05);
}

:deep(.v-list-group--open .v-list-group__header) {
  background-color: rgba(139, 40, 101, 0.1);
  color: #8B2865;
}

:deep(.v-list-group--open .v-list-group__header .v-list-item-title) {
  color: #8B2865;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 960px) {
  .sidebar-col {
    margin-bottom: 24px;
  }
  
  .sidebar-card {
    position: static;
  }
  
  .sidebar-item,
  .sidebar-sub-item {
    padding: 10px 20px;
  }
  
  .sidebar-sub-item {
    padding-left: 40px;
  }
}

@media (max-width: 600px) {
  .sidebar-item,
  .sidebar-sub-item {
    padding: 8px 16px;
  }
  
  .sidebar-sub-item {
    padding-left: 32px;
  }
  
  .content-card .v-card-text {
    padding: 16px;
  }
}
</style>