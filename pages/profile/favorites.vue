<template>
  <div class="favorites-page">
    <h2>Favorilerim</h2>
    
    <!-- Filtre -->
    <div class="section">
      <v-card class="filter-card">
        <v-card-text>
          <v-row>
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
              <v-select
                v-model="priceRange"
                :items="priceRangeOptions"
                label="Fiyat Aralığı"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Ürün Ara"
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

    <!-- Favori Ürünler -->
    <div class="section">
      <div v-if="filteredFavorites.length > 0" class="favorites-grid">
        <v-card v-for="favorite in filteredFavorites" :key="favorite.id" class="favorite-card">
          <div class="favorite-image-container">
            <v-img
              :src="favorite.image"
              :alt="favorite.title"
              height="200"
              cover
            />
            <v-btn
              icon
              class="favorite-btn active"
              @click="removeFromFavorites(favorite.id)"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </div>
          
          <v-card-text>
            <h4 class="favorite-title">{{ favorite.title }}</h4>
            <p class="favorite-category">{{ favorite.category }}</p>
            <p class="favorite-price">{{ favorite.price }} TL</p>
            <p class="favorite-location">📍 {{ favorite.location }}</p>
            <p class="favorite-date">{{ formatDate(favorite.addedAt) }} tarihinde eklendi</p>
          </v-card-text>
          
          <v-card-actions>
            <v-btn variant="outlined" block @click="viewProduct(favorite.id)">
              Ürünü Görüntüle
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <v-alert v-else type="info" class="empty-state">
        <div class="empty-content">
          <v-icon size="64" color="grey">mdi-heart-outline</v-icon>
          <h3>{{ searchQuery ? 'Arama kriterlerinize uygun favori ürün bulunamadı.' : 'Henüz favori ürününüz bulunmamaktadır.' }}</h3>
          <p>{{ searchQuery ? 'Farklı arama terimleri deneyebilirsiniz.' : 'Beğendiğiniz ürünleri favorilere ekleyerek burada görebilirsiniz.' }}</p>
          <v-btn v-if="!searchQuery" color="primary" @click="browseProducts">
            Ürünlere Göz At
          </v-btn>
        </div>
      </v-alert>
    </div>

    <!-- Favori İstatistikleri -->
    <div class="section" v-if="favorites.length > 0">
      <v-card class="stats-card">
        <v-card-text>
          <h3>Favori İstatistiklerim</h3>
          <div class="stats-content">
            <div class="stat-item">
              <span class="stat-label">Toplam Favori:</span>
              <span class="stat-value">{{ favorites.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">En Çok Favorilenen Kategori:</span>
              <span class="stat-value">{{ topCategory }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Ortalama Ürün Fiyatı:</span>
              <span class="stat-value">{{ averagePrice }} TL</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock favori verileri
const favorites = ref([
  {
    id: 'F2024001',
    title: 'iPhone 13 Pro - Temiz',
    category: 'Telefon',
    price: 850,
    location: 'İstanbul, Kadıköy',
    addedAt: '2024-01-15',
    image: '/assets/images/products/baby_car.svg'
  },
  {
    id: 'F2024002',
    title: 'MacBook Air M2 2022',
    category: 'Bilgisayar',
    price: 1200,
    location: 'Ankara, Çankaya',
    addedAt: '2024-01-12',
    image: '/assets/images/products/baby_car.svg'
  },
  {
    id: 'F2024003',
    title: 'Bluetooth Kulaklık',
    category: 'Elektronik',
    price: 450,
    location: 'İzmir, Konak',
    addedAt: '2024-01-10',
    image: '/assets/images/products/baby_car.svg'
  },
  {
    id: 'F2024004',
    title: 'Gaming Mouse',
    category: 'Bilgisayar',
    price: 200,
    location: 'Bursa, Nilüfer',
    addedAt: '2024-01-08',
    image: '/assets/images/products/baby_car.svg'
  }
])

// Filtre seçenekleri
const categoryOptions = ref([
  'Telefon',
  'Bilgisayar',
  'Elektronik',
  'Ev & Yaşam',
  'Giyim',
  'Spor'
])

const priceRangeOptions = ref([
  '0 - 100 TL',
  '100 - 500 TL',
  '500 - 1000 TL',
  '1000+ TL'
])

// Filtre state'leri
const selectedCategory = ref('')
const priceRange = ref('')
const searchQuery = ref('')

// Filtrelenmiş favoriler
const filteredFavorites = computed(() => {
  let filtered = favorites.value

  // Kategori filtresi
  if (selectedCategory.value) {
    filtered = filtered.filter(fav => fav.category === selectedCategory.value)
  }

  // Fiyat aralığı filtresi
  if (priceRange.value) {
    const [min, max] = getPriceRange(priceRange.value)
    filtered = filtered.filter(fav => {
      return fav.price >= min && (max === Infinity || fav.price <= max)
    })
  }

  // Arama filtresi
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(fav => 
      fav.title.toLowerCase().includes(query) ||
      fav.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

// İstatistikler
const topCategory = computed(() => {
  const categoryCount = favorites.value.reduce((acc, fav) => {
    acc[fav.category] = (acc[fav.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.keys(categoryCount).reduce((a, b) => 
    categoryCount[a] > categoryCount[b] ? a : b
  ) || 'Yok'
})

const averagePrice = computed(() => {
  if (favorites.value.length === 0) return 0
  const total = favorites.value.reduce((sum, fav) => sum + fav.price, 0)
  return Math.round(total / favorites.value.length)
})

// Yardımcı fonksiyonlar
const getPriceRange = (range: string): [number, number] => {
  switch (range) {
    case '0 - 100 TL': return [0, 100]
    case '100 - 500 TL': return [100, 500]
    case '500 - 1000 TL': return [500, 1000]
    case '1000+ TL': return [1000, Infinity]
    default: return [0, Infinity]
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

// İşlemler
const removeFromFavorites = (favoriteId: string) => {
  if (confirm('Bu ürünü favorilerden çıkarmak istediğinizden emin misiniz?')) {
    const index = favorites.value.findIndex(fav => fav.id === favoriteId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }
}

const viewProduct = (favoriteId: string) => {
  console.log('Ürün görüntüle:', favoriteId)
  // navigateTo(`/products/${favoriteId}`)
}

const browseProducts = () => {
  console.log('Ürünlere göz at')
  // navigateTo('/products')
}
</script>

<style scoped>
.favorites-page {
  padding: 0;
  max-width: 1200px;
}

.favorites-page h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section {
  margin-bottom: 2rem;
}

.filter-card, .stats-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.favorite-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  transition: transform 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-2px);
}

.favorite-image-container {
  position: relative;
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.favorite-btn.active {
  color: #e91e63 !important;
}

.favorite-title {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

.favorite-category {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.875rem;
}

.favorite-price {
  margin: 0.25rem 0;
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.favorite-location {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.875rem;
}

.favorite-date {
  margin: 0.5rem 0 0 0;
  color: #888;
  font-size: 0.75rem;
}

.empty-state {
  border: none !important;
  background: transparent !important;
}

.empty-content {
  text-align: center;
  padding: 2rem;
}

.empty-content h3 {
  margin: 1rem 0 0.5rem 0;
  color: #666;
}

.empty-content p {
  margin-bottom: 1.5rem;
  color: #888;
}

.stats-content {
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
}

.stat-value {
  color: #333;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>