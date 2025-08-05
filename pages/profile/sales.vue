<template>
  <div class="sales-page">
    <h2>Satışlarım</h2>
    
    <!-- İstatistikler -->
    <div class="section">
      <div class="stats-grid">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="green">mdi-currency-usd</v-icon>
              <div class="stat-info">
                <h3>{{ totalEarnings }} TL</h3>
                <p>Toplam Kazanç</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="blue">mdi-shopping</v-icon>
              <div class="stat-info">
                <h3>{{ totalSales }}</h3>
                <p>Toplam Satış</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="orange">mdi-clock</v-icon>
              <div class="stat-info">
                <h3>{{ pendingSales }}</h3>
                <p>Bekleyen Satış</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="purple">mdi-star</v-icon>
              <div class="stat-info">
                <h3>{{ averageRating }}</h3>
                <p>Ortalama Puan</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Filtre ve Arama -->
    <div class="section">
      <v-card class="filter-card">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="Satış Durumu"
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
                label="Ürün/Alıcı Ara"
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

    <!-- Satış Listesi -->
    <div class="section">
      <div v-if="filteredSales.length > 0" class="sales-list">
        <v-card v-for="sale in filteredSales" :key="sale.id" class="sale-card">
          <v-card-text>
            <div class="sale-header">
              <div class="sale-info">
                <h4>Satış #{{ sale.id }}</h4>
                <p class="sale-date">{{ formatDate(sale.date) }}</p>
              </div>
              <div class="sale-status">
                <v-chip :color="getStatusColor(sale.status)" size="small">
                  {{ sale.status }}
                </v-chip>
              </div>
            </div>
            
            <div class="sale-product">
              <v-avatar size="80" class="product-image">
                <img :src="sale.product.image" :alt="sale.product.name">
              </v-avatar>
              <div class="product-details">
                <h5>{{ sale.product.name }}</h5>
                <p>Kategori: {{ sale.product.category }}</p>
                <p>Alıcı: {{ sale.buyer.name }}</p>
                <p>İletişim: {{ sale.buyer.phone }}</p>
              </div>
              <div class="sale-amount">
                <strong>{{ sale.amount }} TL</strong>
                <p class="commission">Komisyon: {{ sale.commission }} TL</p>
                <p class="net-amount">Net: {{ sale.netAmount }} TL</p>
              </div>
            </div>
            
            <div class="sale-footer">
              <div class="sale-actions">
                <v-btn variant="outlined" size="small" @click="viewSale(sale.id)">
                  Detaylar
                </v-btn>
                <v-btn 
                  v-if="sale.status === 'Beklemede'" 
                  variant="outlined" 
                  color="green"
                  size="small" 
                  @click="confirmSale(sale.id)"
                >
                  Onayla
                </v-btn>
                <v-btn 
                  v-if="sale.status === 'Beklemede'" 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  @click="cancelSale(sale.id)"
                >
                  İptal Et
                </v-btn>
                <v-btn 
                  v-if="sale.status === 'Tamamlandı' && !sale.hasReview" 
                  variant="outlined" 
                  size="small" 
                  @click="reviewBuyer(sale.id)"
                >
                  Alıcıyı Değerlendir
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-alert v-else type="info">
        {{ searchQuery ? 'Arama kriterlerinize uygun satış bulunamadı.' : 'Henüz satışınız bulunmamaktadır.' }}
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock satış verileri
const sales = ref([
  {
    id: 'S2024001',
    date: '2024-01-15',
    status: 'Tamamlandı',
    amount: 850,
    commission: 85,
    netAmount: 765,
    hasReview: false,
    product: {
      name: 'iPhone 13 Pro',
      category: 'Telefon',
      image: '/assets/images/products/baby_car.svg'
    },
    buyer: {
      name: 'Ahmet Yılmaz',
      phone: '0532 000 00 00'
    }
  },
  {
    id: 'S2024002',
    date: '2024-01-12',
    status: 'Kargoda',
    amount: 1200,
    commission: 120,
    netAmount: 1080,
    hasReview: false,
    product: {
      name: 'MacBook Air M2',
      category: 'Bilgisayar',
      image: '/assets/images/products/baby_car.svg'
    },
    buyer: {
      name: 'Ayşe Kaya',
      phone: '0533 111 11 11'
    }
  },
  {
    id: 'S2024003',
    date: '2024-01-10',
    status: 'Beklemede',
    amount: 450,
    commission: 45,
    netAmount: 405,
    hasReview: false,
    product: {
      name: 'Bluetooth Kulaklık',
      category: 'Elektronik',
      image: '/assets/images/products/baby_car.svg'
    },
    buyer: {
      name: 'Mehmet Demir',
      phone: '0534 222 22 22'
    }
  }
])

// İstatistikler
const totalEarnings = computed(() => {
  return sales.value
    .filter(sale => sale.status === 'Tamamlandı')
    .reduce((total, sale) => total + sale.netAmount, 0)
})

const totalSales = computed(() => sales.value.length)
const pendingSales = computed(() => sales.value.filter(sale => sale.status === 'Beklemede').length)
const averageRating = ref(4.8)

// Filtre seçenekleri
const statusOptions = ref([
  'Tüm Satışlar',
  'Beklemede',
  'Kargoda', 
  'Tamamlandı',
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
const selectedStatus = ref('Tüm Satışlar')
const selectedPeriod = ref('Son 30 Gün')
const searchQuery = ref('')

// Filtrelenmiş satışlar
const filteredSales = computed(() => {
  let filtered = sales.value

  // Durum filtresi
  if (selectedStatus.value && selectedStatus.value !== 'Tüm Satışlar') {
    filtered = filtered.filter(sale => sale.status === selectedStatus.value)
  }

  // Arama filtresi
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(sale => 
      sale.id.toLowerCase().includes(query) ||
      sale.product.name.toLowerCase().includes(query) ||
      sale.buyer.name.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Durum rengi
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Beklemede': return 'orange'
    case 'Kargoda': return 'blue'
    case 'Tamamlandı': return 'green'
    case 'İptal Edildi': return 'red'
    default: return 'grey'
  }
}

// Tarih formatlama
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

// Satış işlemleri
const viewSale = (saleId: string) => {
  console.log('Satış detayı:', saleId)
}

const confirmSale = (saleId: string) => {
  console.log('Satış onayla:', saleId)
}

const cancelSale = (saleId: string) => {
  if (confirm('Satışı iptal etmek istediğinizden emin misiniz?')) {
    console.log('Satış iptal et:', saleId)
  }
}

const reviewBuyer = (saleId: string) => {
  console.log('Alıcıyı değerlendir:', saleId)
}
</script>

<style scoped>
.sales-page {
  padding: 0;
  max-width: 1000px;
}

.sales-page h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.stat-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.filter-card, .sale-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  margin-bottom: 1rem;
}

.sale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.sale-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.sale-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.sale-product {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-details {
  flex: 1;
}

.product-details h5 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.product-details p {
  margin: 0.125rem 0;
  color: #666;
  font-size: 0.875rem;
}

.sale-amount {
  text-align: right;
}

.sale-amount strong {
  color: #333;
  font-size: 1.1rem;
}

.commission, .net-amount {
  margin: 0.25rem 0;
  font-size: 0.875rem;
}

.commission {
  color: #f59e0b;
}

.net-amount {
  color: #10b981;
  font-weight: 600;
}

.sale-footer {
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.sale-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .sale-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .sale-product {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .sale-amount {
    text-align: left;
    align-self: flex-end;
  }
  
  .sale-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>