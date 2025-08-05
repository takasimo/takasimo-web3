<template>
  <div class="listings-page">
    <h2>İlanlarım</h2>
    
    <!-- İstatistikler -->
    <div class="section">
      <div class="stats-grid">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="blue">mdi-view-list</v-icon>
              <div class="stat-info">
                <h3>{{ totalListings }}</h3>
                <p>Toplam İlan</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="green">mdi-check-circle</v-icon>
              <div class="stat-info">
                <h3>{{ activeListings }}</h3>
                <p>Aktif İlan</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="orange">mdi-clock</v-icon>
              <div class="stat-info">
                <h3>{{ pendingListings }}</h3>
                <p>Bekleyen İlan</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-content">
              <v-icon class="stat-icon" color="purple">mdi-eye</v-icon>
              <div class="stat-info">
                <h3>{{ totalViews }}</h3>
                <p>Toplam Görüntülenme</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Yeni İlan Ekle -->
    <div class="section">
      <v-btn color="primary" size="large" @click="createListing" prepend-icon="mdi-plus">
        Yeni İlan Ekle
      </v-btn>
    </div>

    <!-- Filtre -->
    <div class="section">
      <v-card class="filter-card">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="İlan Durumu"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedCategory"
                :items="categoryOptions"
                label="Kategori"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="İlan Ara"
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

    <!-- İlan Listesi -->
    <div class="section">
      <div v-if="filteredListings.length > 0" class="listings-list">
        <v-card v-for="listing in filteredListings" :key="listing.id" class="listing-card">
          <v-card-text>
            <div class="listing-header">
              <div class="listing-info">
                <h4>{{ listing.title }}</h4>
                <p class="listing-date">{{ formatDate(listing.createdAt) }}</p>
              </div>
              <div class="listing-status">
                <v-chip :color="getStatusColor(listing.status)" size="small">
                  {{ listing.status }}
                </v-chip>
              </div>
            </div>
            
            <div class="listing-content">
              <v-avatar size="100" class="listing-image">
                <img :src="listing.image" :alt="listing.title">
              </v-avatar>
              <div class="listing-details">
                <p><strong>Kategori:</strong> {{ listing.category }}</p>
                <p><strong>Fiyat:</strong> {{ listing.price }} TL</p>
                <p><strong>Görüntülenme:</strong> {{ listing.views }}</p>
                <p><strong>Favoriye Eklenme:</strong> {{ listing.favorites }}</p>
                <p class="listing-description">{{ listing.description }}</p>
              </div>
            </div>
            
            <div class="listing-footer">
              <div class="listing-actions">
                <v-btn variant="outlined" size="small" @click="viewListing(listing.id)">
                  Görüntüle
                </v-btn>
                <v-btn variant="outlined" size="small" @click="editListing(listing.id)">
                  Düzenle
                </v-btn>
                <v-btn 
                  v-if="listing.status === 'Aktif'" 
                  variant="outlined" 
                  color="orange"
                  size="small" 
                  @click="pauseListing(listing.id)"
                >
                  Durdur
                </v-btn>
                <v-btn 
                  v-if="listing.status === 'Durduruldu'" 
                  variant="outlined" 
                  color="green"
                  size="small" 
                  @click="activateListing(listing.id)"
                >
                  Aktifleştir
                </v-btn>
                <v-btn 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  @click="deleteListing(listing.id)"
                >
                  Sil
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-alert v-else type="info">
        {{ searchQuery ? 'Arama kriterlerinize uygun ilan bulunamadı.' : 'Henüz ilanınız bulunmamaktadır.' }}
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock ilan verileri
const listings = ref([
  {
    id: 'L2024001',
    title: 'iPhone 13 Pro - Temiz',
    category: 'Telefon',
    price: 850,
    status: 'Aktif',
    views: 125,
    favorites: 8,
    createdAt: '2024-01-15',
    description: 'Çok temiz, kutusunda ve aksesuarlarıyla birlikte satılık iPhone 13 Pro.',
    image: '/assets/images/products/baby_car.svg'
  },
  {
    id: 'L2024002',
    title: 'MacBook Air M2 2022',
    category: 'Bilgisayar',
    price: 1200,
    status: 'Beklemede',
    views: 89,
    favorites: 12,
    createdAt: '2024-01-12',
    description: 'Az kullanılmış MacBook Air M2, 8GB RAM 256GB SSD.',
    image: '/assets/images/products/baby_car.svg'
  },
  {
    id: 'L2024003',
    title: 'Bluetooth Kulaklık',
    category: 'Elektronik',
    price: 450,
    status: 'Durduruldu',
    views: 45,
    favorites: 3,
    createdAt: '2024-01-10',
    description: 'Noise cancelling özellikli bluetooth kulaklık.',
    image: '/assets/images/products/baby_car.svg'
  }
])

// İstatistikler
const totalListings = computed(() => listings.value.length)
const activeListings = computed(() => listings.value.filter(l => l.status === 'Aktif').length)
const pendingListings = computed(() => listings.value.filter(l => l.status === 'Beklemede').length)
const totalViews = computed(() => listings.value.reduce((total, l) => total + l.views, 0))

// Filtre seçenekleri
const statusOptions = ref([
  'Tüm İlanlar',
  'Aktif',
  'Beklemede',
  'Durduruldu',
  'Reddedildi'
])

const categoryOptions = ref([
  'Telefon',
  'Bilgisayar',
  'Elektronik',
  'Ev & Yaşam',
  'Giyim',
  'Spor'
])

// Filtre state'leri
const selectedStatus = ref('Tüm İlanlar')
const selectedCategory = ref('')
const searchQuery = ref('')

// Filtrelenmiş ilanlar
const filteredListings = computed(() => {
  let filtered = listings.value

  // Durum filtresi
  if (selectedStatus.value && selectedStatus.value !== 'Tüm İlanlar') {
    filtered = filtered.filter(listing => listing.status === selectedStatus.value)
  }

  // Kategori filtresi
  if (selectedCategory.value) {
    filtered = filtered.filter(listing => listing.category === selectedCategory.value)
  }

  // Arama filtresi
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(listing => 
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Durum rengi
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aktif': return 'green'
    case 'Beklemede': return 'orange'
    case 'Durduruldu': return 'grey'
    case 'Reddedildi': return 'red'
    default: return 'grey'
  }
}

// Tarih formatlama
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

// İlan işlemleri
const createListing = () => {
  console.log('Yeni ilan oluştur')
  // navigateTo('/products/product-create')
}

const viewListing = (listingId: string) => {
  console.log('İlan görüntüle:', listingId)
}

const editListing = (listingId: string) => {
  console.log('İlan düzenle:', listingId)
}

const pauseListing = (listingId: string) => {
  console.log('İlan durdur:', listingId)
}

const activateListing = (listingId: string) => {
  console.log('İlan aktifleştir:', listingId)
}

const deleteListing = (listingId: string) => {
  if (confirm('İlanı silmek istediğinizden emin misiniz?')) {
    console.log('İlan sil:', listingId)
  }
}
</script>

<style scoped>
.listings-page {
  padding: 0;
  max-width: 1000px;
}

.listings-page h2 {
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

.filter-card, .listing-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  margin-bottom: 1rem;
}

.listing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.listing-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.listing-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.listing-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.listing-details {
  flex: 1;
}

.listing-details p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.listing-description {
  margin-top: 0.5rem;
  color: #555 !important;
  line-height: 1.4;
}

.listing-footer {
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.listing-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .listing-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .listing-content {
    flex-direction: column;
  }
  
  .listing-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>