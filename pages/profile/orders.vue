<template>
  <div class="orders-page">
    <h2>Siparişlerim</h2>
    
    <!-- Filtre ve Arama -->
    <div class="section">
      <v-card class="filter-card">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="Sipariş Durumu"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedPeriod"
                :items="periodOptions"
                label="Zaman Aralığı"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Ürün/Sipariş Ara"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-magnify"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Sipariş Listesi -->
    <div class="section">
      <div v-if="filteredOrders.length > 0" class="orders-list">
        <v-card v-for="order in filteredOrders" :key="order.id" class="order-card">
          <v-card-text>
            <div class="order-header">
              <div class="order-info">
                <h4>Sipariş #{{ order.id }}</h4>
                <p class="order-date">{{ formatDate(order.date) }}</p>
              </div>
              <div class="order-status">
                <v-chip :color="getStatusColor(order.status)" size="small">
                  {{ order.status }}
                </v-chip>
              </div>
            </div>
            
            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <v-avatar size="60" class="item-image">
                  <img :src="item.image" :alt="item.name">
                </v-avatar>
                <div class="item-details">
                  <h5>{{ item.name }}</h5>
                  <p>Satıcı: {{ item.seller }}</p>
                  <p>Adet: {{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  <strong>{{ item.price }} TL</strong>
                </div>
              </div>
            </div>
            
            <div class="order-footer">
              <div class="order-total">
                <strong>Toplam: {{ order.total }} TL</strong>
              </div>
              <div class="order-actions">
                <v-btn variant="outlined" size="small" @click="viewOrder(order.id)">
                  Detaylar
                </v-btn>
                <v-btn 
                  v-if="order.status === 'Teslim Edildi'" 
                  variant="outlined" 
                  size="small" 
                  @click="reviewOrder(order.id)"
                >
                  Değerlendir
                </v-btn>
                <v-btn 
                  v-if="order.status === 'Hazırlanıyor'" 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  @click="cancelOrder(order.id)"
                >
                  İptal Et
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-alert v-else type="info">
        {{ searchQuery ? 'Arama kriterlerinize uygun sipariş bulunamadı.' : 'Henüz siparişiniz bulunmamaktadır.' }}
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock sipariş verileri
const orders = ref([
  {
    id: '2024001',
    date: '2024-01-15',
    status: 'Teslim Edildi',
    total: 850,
    items: [
      {
        id: 1,
        name: 'iPhone 13 Pro',
        seller: 'TechStore',
        quantity: 1,
        price: 850,
        image: '/assets/images/products/baby_car.svg'
      }
    ]
  },
  {
    id: '2024002',
    date: '2024-01-10',
    status: 'Kargoda',
    total: 1200,
    items: [
      {
        id: 2,
        name: 'MacBook Air M2',
        seller: 'AppleStore',
        quantity: 1,
        price: 1200,
        image: '/assets/images/products/baby_car.svg'
      }
    ]
  },
  {
    id: '2024003',
    date: '2024-01-08',
    status: 'Hazırlanıyor',
    total: 450,
    items: [
      {
        id: 3,
        name: 'Bluetooth Kulaklık',
        seller: 'AudioWorld',
        quantity: 1,
        price: 450,
        image: '/assets/images/products/baby_car.svg'
      }
    ]
  }
])

// Filtre seçenekleri
const statusOptions = ref([
  'Tüm Siparişler',
  'Hazırlanıyor',
  'Kargoda', 
  'Teslim Edildi',
  'İptal Edildi'
])

const periodOptions = ref([
  'Son 30 Gün',
  'Son 3 Ay',
  'Son 6 Ay',
  'Son 1 Yıl',
  'Tüm Zamanlar'
])

// Filtre state'leri
const selectedStatus = ref('Tüm Siparişler')
const selectedPeriod = ref('Son 30 Gün')
const searchQuery = ref('')

// Filtrelenmiş siparişler
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Durum filtresi
  if (selectedStatus.value && selectedStatus.value !== 'Tüm Siparişler') {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  // Arama filtresi
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(query) ||
        item.seller.toLowerCase().includes(query)
      )
    )
  }

  return filtered
})

// Durum rengi
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hazırlanıyor': return 'orange'
    case 'Kargoda': return 'blue'
    case 'Teslim Edildi': return 'green'
    case 'İptal Edildi': return 'red'
    default: return 'grey'
  }
}

// Tarih formatlama
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

// Sipariş detayları
const viewOrder = (orderId: string) => {
  console.log('Sipariş detayı:', orderId)
}

// Sipariş değerlendirme
const reviewOrder = (orderId: string) => {
  console.log('Sipariş değerlendir:', orderId)
}

// Sipariş iptal etme
const cancelOrder = (orderId: string) => {
  if (confirm('Siparişi iptal etmek istediğinizden emin misiniz?')) {
    console.log('Sipariş iptal et:', orderId)
  }
}
</script>

<style scoped>
.orders-page {
  padding: 0;
  max-width: 1000px;
}

.orders-page h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section {
  margin-bottom: 2rem;
}

.filter-card, .order-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  margin-bottom: 1rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.order-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.order-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f8f8;
}

.order-item:last-child {
  border-bottom: none;
}

.item-details {
  flex: 1;
}

.item-details h5 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.item-details p {
  margin: 0.125rem 0;
  color: #666;
  font-size: 0.875rem;
}

.item-price {
  color: #333;
  font-weight: 600;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.order-total {
  font-size: 1.1rem;
  color: #333;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .order-actions {
    align-self: flex-end;
  }
}
</style>