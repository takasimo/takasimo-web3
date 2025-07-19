<template>
  <v-app-bar app color="white" elevation="1" height="80" class="px-4">
    <v-container class="pa-0" style="max-width: 1320px">
      <v-row align="center" no-gutters>
        <!-- Hamburger (Mobile) -->
        <v-col cols="auto" class="d-flex align-center">
          <v-btn icon v-if="isMobile" @click="drawer = true" aria-label="Menüyü Aç">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-col>

        <!-- Logo (Ortada mobilde, solda masaüstünde) -->
        <v-col cols="auto" class="logo-col ml-auto">
          <h1 @click="navigateTo('/')" class="logo-text">takasimo</h1>
        </v-col>

        <!-- Arama (Sadece masaüstü) -->
        <v-col v-if="!isMobile" class="search-col">
          <v-text-field
            variant="outlined"
            placeholder="marka, ürün adı, kategori arayın"
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            hide-details
            rounded="xl"
            class="search-field"
            style="max-width: 500px"
          />
        </v-col>

        <!-- Sağ Alan (Sadece masaüstü) -->
        <v-col v-if="!isMobile" cols="auto" class="d-flex align-center ga-4 right-col">
          <v-btn
            color="#8B2865"
            variant="flat"
            rounded="xl"
            size="large"
            prepend-icon="mdi-plus"
            class="text-white font-weight-medium px-6"
          >
            İlan Ver
          </v-btn>
          
          <!-- Giriş Yapmamış Kullanıcı -->
          <div v-if="!isAuthenticated" class="d-flex align-center ga-2 user-profile" @click="navigateTo('/login')">
            <v-avatar size="40" color="#8B2865">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div class="d-flex align-center">
              <span class="text-body-1 font-weight-medium mr-1">Giriş yapın</span>
            </div>
          </div>

          <!-- Giriş Yapmış Kullanıcı -->
          <div v-else class="d-flex align-center ga-2 user-profile">
            <v-menu
              v-model="userMenuOpen"
              :close-on-content-click="false"
              location="bottom end"
              offset="8"
            >
              <template v-slot:activator="{ props }">
                <div class="d-flex align-center ga-2 cursor-pointer" v-bind="props">
                  <v-avatar size="40" color="#8B2865">
                    <v-icon v-if="!currentUser?.avatar" color="white">mdi-account</v-icon>
                    <v-img v-else :src="currentUser.avatar" />
                  </v-avatar>
                  <div class="d-flex align-center">
                    <span class="text-body-1 font-weight-medium mr-1">
                      {{ userDisplayName }}
                    </span>
                    <v-icon size="20" color="#8B2865">mdi-chevron-down</v-icon>
                  </div>
                </div>
              </template>

              <v-card min-width="200" class="user-menu">
                <v-list>
                  <v-list-item @click="navigateTo('/profile')" prepend-icon="mdi-account">
                    <v-list-item-title>Profilim</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="navigateTo('/my-products')" prepend-icon="mdi-format-list-bulleted">
                    <v-list-item-title>İlanlarım</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="navigateTo('/favorites')" prepend-icon="mdi-heart">
                    <v-list-item-title>Favorilerim</v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="handleLogout" prepend-icon="mdi-logout" color="error">
                    <v-list-item-title class="text-error">Çıkış Yap</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>

  <!-- Drawer (Mobile) -->
  <v-navigation-drawer v-model="drawer" temporary left class="mobile-drawer" style="z-index: 2000">
    <div class="pa-4">
      <!-- User Profile -->
      <div class="d-flex align-center ga-2 mb-6">
        <v-avatar size="40" color="#8B2865">
          <v-icon v-if="!currentUser?.avatar" color="white">mdi-account</v-icon>
          <v-img v-else :src="currentUser.avatar" />
        </v-avatar>
        <div class="d-flex align-center">
          <span class="text-body-1 font-weight-medium mr-1">
            {{ isAuthenticated ? userDisplayName : 'Giriş yapın' }}
          </span>
          <v-icon v-if="isAuthenticated" size="20" color="#8B2865">mdi-chevron-down</v-icon>
        </div>
      </div>
      
      <!-- Menü Linkleri -->
      <v-list nav dense>
        <v-list-item link @click="navigateTo('/')">
          <template v-slot:prepend>
            <v-icon>mdi-home</v-icon>
          </template>
          <v-list-item-title>Ana Sayfa</v-list-item-title>
        </v-list-item>
        
        <v-list-item v-if="isAuthenticated" link @click="navigateTo('/profile')">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>Profilim</v-list-item-title>
        </v-list-item>
        
        <v-list-item v-if="isAuthenticated" link @click="navigateTo('/my-products')">
          <template v-slot:prepend>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </template>
          <v-list-item-title>İlanlarım</v-list-item-title>
        </v-list-item>
        
        <v-list-item v-if="isAuthenticated" link @click="navigateTo('/favorites')">
          <template v-slot:prepend>
            <v-icon>mdi-heart</v-icon>
          </template>
          <v-list-item-title>Favorilerim</v-list-item-title>
        </v-list-item>
        
        <v-list-item v-if="!isAuthenticated" link @click="navigateTo('/login')">
          <template v-slot:prepend>
            <v-icon>mdi-login</v-icon>
          </template>
          <v-list-item-title>Giriş Yap</v-list-item-title>
        </v-list-item>
        
        <v-list-item v-if="isAuthenticated" link @click="handleLogout">
          <template v-slot:prepend>
            <v-icon color="error">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-error">Çıkış Yap</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useProfileStore } from "~/stores/profileStore.js"
import { useAuthStore } from "~/stores/authStore.js"
import { useAuthApi } from "~/composables/api/index.js"

const drawer = ref(false)
const isMobile = ref(false)
const userMenuOpen = ref(false)
const { router } = useRouter()

// Store'ları kullan
const authStore = useAuthStore()
const profileStore = useProfileStore()

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => profileStore.getUser)

const userDisplayName = computed(() => {
  if (profileStore.isLoading) return 'Yükleniyor...'
  
  const user = profileStore.getUser
  if (user) {
    // Farklı alanları kontrol et
    if (user.name) return user.name
    if (user.full_name) return user.full_name
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`
    if (user.first_name) return user.first_name
  }
  
  return 'Kullanıcı'
})

// Watch kullanıcı durumu değişikliklerini
watch(
  () => authStore.isAuthenticated,
  async (newValue, oldValue) => {
    console.log('Auth durumu değişti:', { oldValue, newValue })
    
    if (newValue && !oldValue) {
      // Kullanıcı giriş yaptı
      console.log('Kullanıcı giriş yaptı, profil yükleniyor...')
      try {
        await profileStore.fetchUserProfile()
        console.log('Profil yüklendi:', profileStore.getUser)
      } catch (error) {
        console.error('Profil yüklenirken hata:', error)
      }
    } else if (!newValue && oldValue) {
      // Kullanıcı çıkış yaptı
      console.log('Kullanıcı çıkış yaptı')
      profileStore.clearProfile()
    }
  },
  { immediate: true }
)

// Watch profil store değişikliklerini
watch(
  () => profileStore.getUser,
  (newUser, oldUser) => {
    console.log('Profil değişti:', { oldUser, newUser })
  },
  { deep: true }
)

const checkMobile = () => {
  if (process.client) {
    isMobile.value = window.innerWidth < 960
  }
}

const handleLogout = async () => {
  try {
    await useAuthApi().logout()
    authStore.clearAuth()
    profileStore.clearProfile()
    userMenuOpen.value = false
    drawer.value = false
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  checkMobile()
  if (process.client) {
    window.addEventListener('resize', checkMobile)
  }
  
  // Sayfa yüklendiğinde kullanıcı giriş yapmışsa profil yükle
  if (authStore.isAuthenticated && !profileStore.getUser) {
    console.log('Sayfa yüklendi, profil yükleniyor...')
    profileStore.fetchUserProfile()
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', checkMobile)
  }
})
</script>

<style scoped>
.logo-text {
  font-family: Roboto, sans-serif;
  letter-spacing: -0.5px;
  color: #8b2865;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-align: left;
}

.logo-col {
  display: flex;
  align-items: center;
}

@media (width <= 960px) {
  .logo-col {
    justify-content: flex-end !important;
    text-align: right !important;
    margin-right: 0 !important;
    margin-left: auto !important;
  }

  .search-col,
  .right-col {
    display: none !important;
  }
}

.search-field :deep(.v-field) {
  background-color: #f5f5f5;
}

.search-field :deep(.v-field__input) {
  padding: 12px 16px;
}

.mobile-drawer {
  height: 100% !important;
  max-height: 100vh !important;
  top: 0 !important;
}

.user-profile {
  cursor: pointer;
}

.cursor-pointer {
  cursor: pointer;
}

.user-menu {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
