<template>
  <div class="account-security">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Güvenlik Ayarları</h1>
      <p class="text-grey text-body-1">
        Hesabınızın güvenliğini artırmak için ayarları yapılandırın
      </p>
    </div>

    <v-row>
      <!-- İki Faktörlü Doğrulama -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="security-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-two-factor-authentication</v-icon>
              <h3 class="text-h6 font-weight-semibold">İki Faktörlü Doğrulama</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <p class="text-body-2 text-grey mb-4">
              Hesabınıza ek güvenlik katmanı eklemek için iki faktörlü doğrulamayı etkinleştirin.
            </p>
            
            <v-switch
              v-model="securitySettings.twoFactorEnabled"
              label="İki Faktörlü Doğrulama"
              color="primary"
              hide-details
              class="mb-4"
            />
            
            <v-btn
              v-if="!securitySettings.twoFactorEnabled"
              color="primary"
              variant="outlined"
              size="small"
              @click="setupTwoFactor"
            >
              Kurulum Yap
            </v-btn>
            
            <v-btn
              v-else
              color="error"
              variant="outlined"
              size="small"
              @click="disableTwoFactor"
            >
              Devre Dışı Bırak
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Oturum Yönetimi -->
      <v-col cols="12" md="6" class="mb-6">
        <v-card class="security-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-monitor-cellphone</v-icon>
              <h3 class="text-h6 font-weight-semibold">Oturum Yönetimi</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <p class="text-body-2 text-grey mb-4">
              Aktif oturumlarınızı görüntüleyin ve güvenlik için kapatın.
            </p>
            
            <div class="session-list">
              <div v-for="session in activeSessions" :key="session.id" class="session-item mb-3">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon :color="session.deviceType === 'mobile' ? 'primary' : 'secondary'" size="20" class="mr-3">
                      {{ session.deviceType === 'mobile' ? 'mdi-cellphone' : 'mdi-desktop-classic' }}
                    </v-icon>
                    <div>
                      <div class="text-body-2 font-weight-medium">{{ session.deviceName }}</div>
                      <div class="text-caption text-grey">{{ session.location }} • {{ session.lastActivity }}</div>
                    </div>
                  </div>
                  
                  <v-btn
                    v-if="!session.current"
                    color="error"
                    variant="text"
                    size="small"
                    @click="terminateSession(session.id)"
                  >
                    Kapat
                  </v-btn>
                  
                  <v-chip v-else color="success" size="small" variant="outlined">
                    Mevcut
                  </v-chip>
                </div>
              </div>
            </div>
            
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              @click="terminateAllSessions"
              class="mt-3"
            >
              Tüm Oturumları Kapat
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Giriş Geçmişi -->
      <v-col cols="12" class="mb-6">
        <v-card class="security-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-3">mdi-history</v-icon>
              <h3 class="text-h6 font-weight-semibold">Giriş Geçmişi</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <v-data-table
              :headers="loginHistoryHeaders"
              :items="loginHistory"
              :items-per-page="5"
              class="elevation-0"
            >
              <template v-slot:item.device="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="item.device.type === 'mobile' ? 'primary' : 'secondary'" size="16" class="mr-2">
                    {{ item.device.type === 'mobile' ? 'mdi-cellphone' : 'mdi-desktop-classic' }}
                  </v-icon>
                  {{ item.device.name }}
                </div>
              </template>
              
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'success' ? 'success' : 'error'"
                  size="small"
                  variant="outlined"
                >
                  {{ item.status === 'success' ? 'Başarılı' : 'Başarısız' }}
                </v-chip>
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  @click="reportSuspiciousActivity(item)"
                >
                  Şüpheli
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Güvenlik Uyarıları -->
      <v-col cols="12">
        <v-card class="security-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon color="warning" size="24" class="mr-3">mdi-alert-circle</v-icon>
              <h3 class="text-h6 font-weight-semibold">Güvenlik Uyarıları</h3>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div v-if="securityAlerts.length > 0">
              <div v-for="alert in securityAlerts" :key="alert.id" class="alert-item mb-3">
                <v-alert
                  :type="alert.type"
                  :title="alert.title"
                  :text="alert.message"
                  variant="tonal"
                  class="mb-0"
                >
                  <template v-slot:append>
                    <v-btn
                      color="primary"
                      variant="text"
                      size="small"
                      @click="dismissAlert(alert.id)"
                    >
                      Kapat
                    </v-btn>
                  </template>
                </v-alert>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <v-icon size="48" color="success" class="mb-4">mdi-shield-check</v-icon>
              <p class="text-grey text-body-1">Güvenlik uyarısı bulunmuyor</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const securitySettings = ref({
  twoFactorEnabled: false
})

const activeSessions = ref([
  {
    id: 1,
    deviceName: 'iPhone 13 Pro',
    deviceType: 'mobile',
    location: 'İstanbul, Türkiye',
    lastActivity: 'Şu anda aktif',
    current: true
  },
  {
    id: 2,
    deviceName: 'MacBook Pro',
    deviceType: 'desktop',
    location: 'İstanbul, Türkiye',
    lastActivity: '2 saat önce',
    current: false
  },
  {
    id: 3,
    deviceName: 'Windows PC',
    deviceType: 'desktop',
    location: 'Ankara, Türkiye',
    lastActivity: '1 gün önce',
    current: false
  }
])

const loginHistoryHeaders = [
  { title: 'Tarih', key: 'date', sortable: true },
  { title: 'Cihaz', key: 'device', sortable: false },
  { title: 'IP Adresi', key: 'ipAddress', sortable: true },
  { title: 'Konum', key: 'location', sortable: true },
  { title: 'Durum', key: 'status', sortable: true },
  { title: 'İşlemler', key: 'actions', sortable: false }
]

const loginHistory = ref([
  {
    id: 1,
    date: '2024-01-15 14:30',
    device: { name: 'iPhone 13 Pro', type: 'mobile' },
    ipAddress: '192.168.1.100',
    location: 'İstanbul, Türkiye',
    status: 'success'
  },
  {
    id: 2,
    date: '2024-01-15 10:15',
    device: { name: 'MacBook Pro', type: 'desktop' },
    ipAddress: '192.168.1.101',
    location: 'İstanbul, Türkiye',
    status: 'success'
  },
  {
    id: 3,
    date: '2024-01-14 18:45',
    device: { name: 'Windows PC', type: 'desktop' },
    ipAddress: '192.168.1.102',
    location: 'Ankara, Türkiye',
    status: 'failed'
  }
])

const securityAlerts = ref([
  {
    id: 1,
    type: 'warning',
    title: 'Şüpheli Giriş Denemesi',
    message: 'Bilinmeyen bir cihazdan giriş denemesi tespit edildi.'
  },
  {
    id: 2,
    type: 'info',
    title: 'Şifre Değişikliği',
    message: 'Şifreniz başarıyla güncellendi.'
  }
])

const setupTwoFactor = () => {
  console.log('Setting up two-factor authentication...')
  // Implementation for 2FA setup
}

const disableTwoFactor = () => {
  console.log('Disabling two-factor authentication...')
  securitySettings.value.twoFactorEnabled = false
}

const terminateSession = (sessionId) => {
  console.log('Terminating session:', sessionId)
  activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId)
}

const terminateAllSessions = () => {
  console.log('Terminating all sessions...')
  activeSessions.value = activeSessions.value.filter(session => session.current)
}

const reportSuspiciousActivity = (item) => {
  console.log('Reporting suspicious activity:', item)
}

const dismissAlert = (alertId) => {
  console.log('Dismissing alert:', alertId)
  securityAlerts.value = securityAlerts.value.filter(alert => alert.id !== alertId)
}
</script>

<style scoped>
.account-security {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.security-card {
  border-radius: 16px;
  background: white;
  height: 100%;
}

.session-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.session-item:last-child {
  margin-bottom: 0;
}

.alert-item:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .security-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .security-card .v-card-text {
    padding: 16px;
  }
  
  .security-card .v-card-title {
    padding: 16px;
  }
}
</style> 