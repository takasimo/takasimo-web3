<template>
  <div class="account-notifications">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Bildirim Ayarları</h1>
      <p class="text-grey text-body-1">
        Hangi bildirimleri almak istediğinizi yönetin
      </p>
    </div>

    <v-row>
      <!-- Bildirim Ayarları -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="notifications-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-bell-cog</v-icon>
              <h3 class="text-h6 font-weight-semibold">Bildirim Tercihleri</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div class="notification-settings">
              <div v-for="setting in notificationSettings" :key="setting.id" class="setting-item mb-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1">{{ setting.title }}</div>
                    <div class="text-body-2 text-grey">{{ setting.description }}</div>
                  </div>
                  
                  <v-switch
                    v-model="setting.enabled"
                    :color="setting.color"
                    hide-details
                    density="compact"
                  />
                </div>
              </div>
            </div>
            
            <v-divider class="my-4"></v-divider>
            
            <v-btn
              color="primary"
              variant="outlined"
              @click="saveNotificationSettings"
              :loading="saving"
            >
              Ayarları Kaydet
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Bildirim Geçmişi -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="notifications-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="primary" size="24" class="mr-3">mdi-bell</v-icon>
                <h3 class="text-h6 font-weight-semibold">Bildirim Geçmişi</h3>
              </div>
              
              <v-btn
                color="primary"
                variant="text"
                size="small"
                @click="markAllAsRead"
              >
                Tümünü Okundu İşaretle
              </v-btn>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div class="notification-list">
              <div v-for="notification in notifications" :key="notification.id" class="notification-item mb-3">
                <div class="d-flex align-start">
                  <v-icon :color="notification.type" size="20" class="mr-3 mt-1">
                    {{ notification.icon }}
                  </v-icon>
                  
                  <div class="flex-grow-1">
                    <div class="d-flex align-center justify-space-between mb-1">
                      <div class="text-body-2 font-weight-medium">{{ notification.title }}</div>
                      <div class="text-caption text-grey">{{ notification.time }}</div>
                    </div>
                    
                    <div class="text-body-2 text-grey mb-2">{{ notification.message }}</div>
                    
                    <div class="d-flex gap-2">
                      <v-btn
                        v-if="!notification.read"
                        color="primary"
                        variant="text"
                        size="x-small"
                        @click="markAsRead(notification.id)"
                      >
                        Okundu İşaretle
                      </v-btn>
                      
                      <v-btn
                        color="error"
                        variant="text"
                        size="x-small"
                        @click="deleteNotification(notification.id)"
                      >
                        Sil
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="notifications.length === 0" class="text-center py-8">
              <v-icon size="48" color="grey" class="mb-4">mdi-bell-off</v-icon>
              <p class="text-grey text-body-1">Henüz bildirim bulunmuyor</p>
            </div>
            
            <v-btn
              v-if="notifications.length > 0"
              color="primary"
              variant="outlined"
              block
              @click="loadMoreNotifications"
              :loading="loadingMore"
              class="mt-4"
            >
              Daha Fazla Yükle
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- E-posta Bildirimleri -->
      <v-col cols="12">
        <v-card class="notifications-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-email</v-icon>
              <h3 class="text-h6 font-weight-semibold">E-posta Bildirimleri</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <v-row>
              <v-col cols="12" md="8" lg="6">
                <v-text-field
                  v-model="emailSettings.email"
                  label="E-posta Adresi"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  class="mb-4"
                />
                
                <div class="email-preferences">
                  <div v-for="preference in emailPreferences" :key="preference.id" class="preference-item mb-3">
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="text-body-1 font-weight-medium mb-1">{{ preference.title }}</div>
                        <div class="text-body-2 text-grey">{{ preference.description }}</div>
                      </div>
                      
                      <v-switch
                        v-model="preference.enabled"
                        color="primary"
                        hide-details
                        density="compact"
                      />
                    </div>
                  </div>
                </div>
                
                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="saveEmailSettings"
                  :loading="savingEmail"
                  class="mt-4"
                >
                  E-posta Ayarlarını Kaydet
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const saving = ref(false)
const savingEmail = ref(false)
const loadingMore = ref(false)

const notificationSettings = ref([
  {
    id: 1,
    title: 'Yeni Mesajlar',
    description: 'Gelen mesajlar hakkında bildirim al',
    enabled: true,
    color: 'primary'
  },
  {
    id: 2,
    title: 'İlan Güncellemeleri',
    description: 'İlanlarınızdaki değişiklikler hakkında bildirim al',
    enabled: true,
    color: 'info'
  },
  {
    id: 3,
    title: 'Favori Ürünler',
    description: 'Favori ürünlerinizdeki değişiklikler hakkında bildirim al',
    enabled: false,
    color: 'warning'
  },
  {
    id: 4,
    title: 'Güvenlik Uyarıları',
    description: 'Hesap güvenliği ile ilgili önemli bildirimler',
    enabled: true,
    color: 'error'
  },
  {
    id: 5,
    title: 'Promosyonlar',
    description: 'Özel teklifler ve kampanyalar hakkında bildirim al',
    enabled: false,
    color: 'success'
  }
])

const notifications = ref([
  {
    id: 1,
    title: 'Yeni Mesaj',
    message: 'iPhone 13 Pro ilanınız için yeni bir mesaj geldi.',
    type: 'primary',
    icon: 'mdi-message',
    time: '5 dakika önce',
    read: false
  },
  {
    id: 2,
    title: 'İlan Güncellendi',
    message: 'MacBook Pro ilanınız başarıyla güncellendi.',
    type: 'info',
    icon: 'mdi-update',
    time: '1 saat önce',
    read: true
  },
  {
    id: 3,
    title: 'Favori Ürün',
    message: 'Favori listenizdeki bir ürünün fiyatı düştü.',
    type: 'warning',
    icon: 'mdi-heart',
    time: '2 saat önce',
    read: false
  },
  {
    id: 4,
    title: 'Güvenlik Uyarısı',
    message: 'Hesabınıza yeni bir cihazdan giriş yapıldı.',
    type: 'error',
    icon: 'mdi-shield-alert',
    time: '1 gün önce',
    read: true
  }
])

const emailSettings = ref({
  email: 'user@example.com'
})

const emailPreferences = ref([
  {
    id: 1,
    title: 'Haftalık Özet',
    description: 'Haftalık aktivite özetinizi e-posta ile alın',
    enabled: true
  },
  {
    id: 2,
    title: 'Yeni Mesajlar',
    description: 'Gelen mesajlar için e-posta bildirimi alın',
    enabled: true
  },
  {
    id: 3,
    title: 'İlan Durumu',
    description: 'İlanlarınızın durumu hakkında e-posta alın',
    enabled: false
  },
  {
    id: 4,
    title: 'Promosyonlar',
    description: 'Özel teklifler ve kampanyalar için e-posta alın',
    enabled: false
  }
])

const saveNotificationSettings = async () => {
  saving.value = true
  
  try {
    // API call to save notification settings
    console.log('Saving notification settings...', notificationSettings.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Notification settings saved successfully')
    
  } catch (error) {
    console.error('Error saving notification settings:', error)
  } finally {
    saving.value = false
  }
}

const saveEmailSettings = async () => {
  savingEmail.value = true
  
  try {
    // API call to save email settings
    console.log('Saving email settings...', {
      email: emailSettings.value.email,
      preferences: emailPreferences.value
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Email settings saved successfully')
    
  } catch (error) {
    console.error('Error saving email settings:', error)
  } finally {
    savingEmail.value = false
  }
}

const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const deleteNotification = (notificationId) => {
  notifications.value = notifications.value.filter(n => n.id !== notificationId)
}

const loadMoreNotifications = async () => {
  loadingMore.value = true
  
  try {
    // API call to load more notifications
    console.log('Loading more notifications...')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add more notifications (simulated)
    const newNotifications = [
      {
        id: notifications.value.length + 1,
        title: 'Yeni Bildirim',
        message: 'Bu bir test bildirimidir.',
        type: 'info',
        icon: 'mdi-information',
        time: '3 saat önce',
        read: false
      }
    ]
    
    notifications.value.push(...newNotifications)
    
  } catch (error) {
    console.error('Error loading more notifications:', error)
  } finally {
    loadingMore.value = false
  }
}
</script>

<style scoped>
.account-notifications {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.notifications-card {
  border-radius: 16px;
  background: white;
  height: 100%;
}

.setting-item,
.preference-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.setting-item:last-child,
.preference-item:last-child {
  margin-bottom: 0;
}

.notification-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.notification-item:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .notifications-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .notifications-card .v-card-text {
    padding: 16px;
  }
  
  .notifications-card .v-card-title {
    padding: 16px;
  }
}
</style> 