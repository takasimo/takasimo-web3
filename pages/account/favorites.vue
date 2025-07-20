<template>
  <div class="account-favorites">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Favorilerim</h1>
      <p class="text-grey text-body-1">
        Beğendiğiniz ürünleri takip edin ve kolayca erişin
      </p>
    </div>

    <v-row>
      <!-- Favori İstatistikleri -->
      <v-col cols="12" class="mb-6">
        <v-card class="stats-card" elevation="2" border>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-primary mb-2">
                    {{ favorites.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Toplam Favori
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-success mb-2">
                    {{ activeFavorites.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Aktif İlan
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-warning mb-2">
                    {{ priceDrops.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Fiyat Düşüşü
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-info mb-2">
                    {{ totalValue }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Toplam Değer (TL)
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Filtreler -->
      <v-col cols="12" class="mb-6">
        <v-card class="filters-card" elevation="2" border>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="Favori Ara"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="categoryFilter"
                  label="Kategori"
                  variant="outlined"
                  :items="categoryOptions"
                  clearable
                />
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="priceFilter"
                  label="Fiyat Aralığı"
                  variant="outlined"
                  :items="priceOptions"
                  clearable
                />
              </v-col>
              
              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  block
                  @click="clearFilters"
                >
                  Filtreleri Temizle
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Favori Listesi -->
      <v-col cols="12">
        <v-card class="favorites-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="primary" size="24" class="mr-3">mdi-heart</v-icon>
                <h3 class="text-h6 font-weight-semibold">Favori Ürünlerim</h3>
              </div>
              
              <div class="d-flex gap-2">
                <v-btn
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-bell"
                  @click="enableNotifications"
                >
                  Bildirimleri Aç
                </v-btn>
                
                <v-btn
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  @click="showClearDialog = true"
                >
                  Tümünü Temizle
                </v-btn>
              </div>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div v-if="filteredFavorites.length > 0" class="favorites-grid">
              <div v-for="favorite in filteredFavorites" :key="favorite.id" class="favorite-item">
                <v-card class="favorite-card" variant="outlined" border>
                  <v-img
                    :src="favorite.image"
                    height="200"
                    cover
                    class="favorite-image"
                  />
                  
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <v-chip
                        :color="getStatusColor(favorite.status)"
                        size="small"
                        variant="outlined"
                      >
                        {{ getStatusLabel(favorite.status) }}
                      </v-chip>
                      
                      <div class="d-flex gap-1">
                        <v-btn
                          v-if="favorite.hasPriceDrop"
                          color="warning"
                          size="x-small"
                          variant="outlined"
                        >
                          Fiyat Düştü!
                        </v-btn>
                        
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-dots-vertical"
                              size="small"
                              variant="text"
                              v-bind="props"
                            />
                          </template>
                          
                          <v-list>
                            <v-list-item @click="viewProduct(favorite)">
                              <template v-slot:prepend>
                                <v-icon size="small">mdi-eye</v-icon>
                              </template>
                              <v-list-item-title>Görüntüle</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item @click="contactSeller(favorite)">
                              <template v-slot:prepend>
                                <v-icon size="small">mdi-message</v-icon>
                              </template>
                              <v-list-item-title>Satıcıyla İletişim</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item @click="removeFromFavorites(favorite)" class="text-error">
                              <template v-slot:prepend>
                                <v-icon size="small" color="error">mdi-heart-off</v-icon>
                              </template>
                              <v-list-item-title class="text-error">Favorilerden Çıkar</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </div>
                    
                    <h4 class="text-h6 font-weight-semibold mb-2">{{ favorite.title }}</h4>
                    <p class="text-body-2 text-grey mb-3">{{ favorite.description }}</p>
                    
                    <div class="favorite-details">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-body-2 text-grey">Fiyat:</span>
                        <div class="text-right">
                          <div v-if="favorite.hasPriceDrop" class="text-body-2 text-grey text-decoration-line-through">
                            {{ favorite.originalPrice }} TL
                          </div>
                          <div class="text-body-1 font-weight-medium text-primary">
                            {{ favorite.price }} TL
                          </div>
                        </div>
                      </div>
                      
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-body-2 text-grey">Satıcı:</span>
                        <span class="text-body-2">{{ favorite.seller }}</span>
                      </div>
                      
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-body-2 text-grey">Kategori:</span>
                        <span class="text-body-2">{{ favorite.category }}</span>
                      </div>
                      
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-2 text-grey">Eklenme:</span>
                        <span class="text-body-2">{{ formatDate(favorite.addedAt) }}</span>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <v-icon size="48" color="grey" class="mb-4">mdi-heart-off</v-icon>
              <p class="text-grey text-body-1 mb-4">Henüz favori ürün bulunmuyor</p>
              <v-btn
                color="primary"
                prepend-icon="mdi-magnify"
                to="/products"
              >
                Ürün Arayın
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Temizleme Onay Dialog -->
    <v-dialog v-model="showClearDialog" max-width="400px">
      <v-card>
        <v-card-title class="pa-6 pb-4">
          <h3 class="text-h6 font-weight-semibold">Favorileri Temizle</h3>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <p class="text-body-1">
            Tüm favori ürünlerinizi silmek istediğinizden emin misiniz?
          </p>
          <p class="text-body-2 text-grey mt-2">
            Bu işlem geri alınamaz.
          </p>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="showClearDialog = false"
          >
            İptal
          </v-btn>
          <v-btn
            color="error"
            @click="clearAllFavorites"
          >
            Tümünü Temizle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const categoryFilter = ref('')
const priceFilter = ref('')
const showClearDialog = ref(false)

const categoryOptions = [
  'Elektronik',
  'Giyim',
  'Ev & Yaşam',
  'Spor',
  'Kitap',
  'Diğer'
]

const priceOptions = [
  { title: '0 - 1000 TL', value: '0-1000' },
  { title: '1000 - 5000 TL', value: '1000-5000' },
  { title: '5000 - 10000 TL', value: '5000-10000' },
  { title: '10000+ TL', value: '10000+' }
]

const favorites = ref([
  {
    id: 1,
    title: 'iPhone 13 Pro',
    description: '128GB, Mavi, Mükemmel durumda',
    price: 25000,
    originalPrice: 28000,
    category: 'Elektronik',
    status: 'active',
    seller: 'TechStore',
    image: '/images/products/iphone.jpg',
    addedAt: '2024-01-10',
    hasPriceDrop: true
  },
  {
    id: 2,
    title: 'MacBook Pro 2023',
    description: '14 inch, M2 Pro, 16GB RAM',
    price: 45000,
    originalPrice: 45000,
    category: 'Elektronik',
    status: 'active',
    seller: 'AppleStore',
    image: '/images/products/macbook.jpg',
    addedAt: '2024-01-12',
    hasPriceDrop: false
  },
  {
    id: 3,
    title: 'Nike Air Max',
    description: '42 numara, Siyah, Az kullanılmış',
    price: 1200,
    originalPrice: 1500,
    category: 'Spor',
    status: 'active',
    seller: 'SportShop',
    image: '/images/products/shoes.jpg',
    addedAt: '2024-01-08',
    hasPriceDrop: true
  }
])

const activeFavorites = computed(() => favorites.value.filter(f => f.status === 'active'))
const priceDrops = computed(() => favorites.value.filter(f => f.hasPriceDrop))
const totalValue = computed(() => favorites.value.reduce((sum, f) => sum + f.price, 0))

const filteredFavorites = computed(() => {
  let filtered = favorites.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(f => 
      f.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(f => f.category === categoryFilter.value)
  }
  
  if (priceFilter.value) {
    const [min, max] = priceFilter.value.split('-').map(Number)
    filtered = filtered.filter(f => {
      if (priceFilter.value === '10000+') {
        return f.price >= 10000
      }
      return f.price >= min && f.price <= max
    })
  }
  
  return filtered
})

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    sold: 'error',
    paused: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Aktif',
    sold: 'Satıldı',
    paused: 'Duraklatılmış'
  }
  return labels[status] || 'Bilinmiyor'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  priceFilter.value = ''
}

const enableNotifications = () => {
  console.log('Enabling price drop notifications...')
  // Implementation for enabling notifications
}

const viewProduct = (favorite) => {
  navigateTo(`/products/${favorite.id}`)
}

const contactSeller = (favorite) => {
  console.log('Contacting seller for:', favorite.title)
  // Implementation for contacting seller
}

const removeFromFavorites = (favorite) => {
  favorites.value = favorites.value.filter(f => f.id !== favorite.id)
}

const clearAllFavorites = () => {
  favorites.value = []
  showClearDialog.value = false
}
</script>

<style scoped>
.account-favorites {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.stats-card,
.filters-card,
.favorites-card {
  border-radius: 16px;
  background: white;
}

.stat-item {
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.favorite-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.favorite-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.favorite-image {
  border-radius: 12px 12px 0 0;
}

.favorite-details {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .stats-card .v-card-text,
  .filters-card .v-card-text,
  .favorites-card .v-card-text {
    padding: 16px;
  }
  
  .stats-card .v-card-title,
  .filters-card .v-card-title,
  .favorites-card .v-card-title {
    padding: 16px;
  }
}
</style> 