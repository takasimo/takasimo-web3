<template>
  <div class="account-products">
    <div class="page-header mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">İlanlarım</h1>
      <p class="text-grey text-body-1">
        Yayınladığınız ilanları yönetin ve takip edin
      </p>
    </div>

    <v-row>
      <!-- İlan İstatistikleri -->
      <v-col cols="12" class="mb-6">
        <v-card class="stats-card" elevation="2" border>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-primary mb-2">
                    {{ products.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Toplam İlan
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-success mb-2">
                    {{ activeProducts.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Aktif İlan
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-warning mb-2">
                    {{ pendingProducts.length }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Bekleyen İlan
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <div class="stat-item text-center">
                  <div class="stat-number text-h4 font-weight-bold text-info mb-2">
                    {{ totalViews }}
                  </div>
                  <div class="stat-label text-body-2 text-grey">
                    Toplam Görüntülenme
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Filtreler ve Arama -->
      <v-col cols="12" class="mb-6">
        <v-card class="filters-card" elevation="2" border>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="İlan Ara"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </v-col>
              
              <v-col cols="12" md="3">
                <v-select
                  v-model="statusFilter"
                  label="Durum"
                  variant="outlined"
                  :items="statusOptions"
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

      <!-- İlan Listesi -->
      <v-col cols="12">
        <v-card class="products-card" elevation="2" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="primary" size="24" class="mr-3">mdi-format-list-bulleted</v-icon>
                <h3 class="text-h6 font-weight-semibold">İlanlarım</h3>
              </div>
              
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                to="/products/create"
              >
                Yeni İlan Ekle
              </v-btn>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-6 pt-0">
            <div v-if="filteredProducts.length > 0" class="products-grid">
              <div v-for="product in filteredProducts" :key="product.id" class="product-item">
                <v-card class="product-card" variant="outlined" border>
                  <v-img
                    :src="product.image"
                    height="200"
                    cover
                    class="product-image"
                  />
                  
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <v-chip
                        :color="getStatusColor(product.status)"
                        size="small"
                        variant="outlined"
                      >
                        {{ getStatusLabel(product.status) }}
                      </v-chip>
                      
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
                          <v-list-item @click="viewProduct(product)">
                            <template v-slot:prepend>
                              <v-icon size="small">mdi-eye</v-icon>
                            </template>
                            <v-list-item-title>Görüntüle</v-list-item-title>
                          </v-list-item>
                          
                          <v-list-item @click="editProduct(product)">
                            <template v-slot:prepend>
                              <v-icon size="small">mdi-pencil</v-icon>
                            </template>
                            <v-list-item-title>Düzenle</v-list-item-title>
                          </v-list-item>
                          
                          <v-list-item @click="toggleProductStatus(product)">
                            <template v-slot:prepend>
                              <v-icon size="small">{{ product.status === 'active' ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                            </template>
                            <v-list-item-title>{{ product.status === 'active' ? 'Duraklat' : 'Aktifleştir' }}</v-list-item-title>
                          </v-list-item>
                          
                          <v-list-item @click="deleteProduct(product)" class="text-error">
                            <template v-slot:prepend>
                              <v-icon size="small" color="error">mdi-delete</v-icon>
                            </template>
                            <v-list-item-title class="text-error">Sil</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                    
                    <h4 class="text-h6 font-weight-semibold mb-2">{{ product.title }}</h4>
                    <p class="text-body-2 text-grey mb-3">{{ product.description }}</p>
                    
                    <div class="product-details">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-body-2 text-grey">Fiyat:</span>
                        <span class="text-body-1 font-weight-medium text-primary">{{ product.price }} TL</span>
                      </div>
                      
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-body-2 text-grey">Kategori:</span>
                        <span class="text-body-2">{{ product.category }}</span>
                      </div>
                      
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-body-2 text-grey">Görüntülenme:</span>
                        <span class="text-body-2">{{ product.views }}</span>
                      </div>
                      
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-2 text-grey">Tarih:</span>
                        <span class="text-body-2">{{ formatDate(product.createdAt) }}</span>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <v-icon size="48" color="grey" class="mb-4">mdi-package-variant</v-icon>
              <p class="text-grey text-body-1 mb-4">Henüz ilan bulunmuyor</p>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                to="/products/create"
              >
                İlk İlanınızı Ekleyin
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

const statusOptions = [
  { title: 'Aktif', value: 'active' },
  { title: 'Beklemede', value: 'pending' },
  { title: 'Duraklatılmış', value: 'paused' },
  { title: 'Satıldı', value: 'sold' }
]

const categoryOptions = [
  'Elektronik',
  'Giyim',
  'Ev & Yaşam',
  'Spor',
  'Kitap',
  'Diğer'
]

const products = ref([
  {
    id: 1,
    title: 'iPhone 13 Pro',
    description: '128GB, Mavi, Mükemmel durumda',
    price: 25000,
    category: 'Elektronik',
    status: 'active',
    views: 156,
    image: '/images/products/iphone.jpg',
    createdAt: '2024-01-10'
  },
  {
    id: 2,
    title: 'MacBook Pro 2023',
    description: '14 inch, M2 Pro, 16GB RAM',
    price: 45000,
    category: 'Elektronik',
    status: 'pending',
    views: 89,
    image: '/images/products/macbook.jpg',
    createdAt: '2024-01-12'
  },
  {
    id: 3,
    title: 'Nike Air Max',
    description: '42 numara, Siyah, Az kullanılmış',
    price: 1200,
    category: 'Spor',
    status: 'active',
    views: 234,
    image: '/images/products/shoes.jpg',
    createdAt: '2024-01-08'
  }
])

const activeProducts = computed(() => products.value.filter(p => p.status === 'active'))
const pendingProducts = computed(() => products.value.filter(p => p.status === 'pending'))
const totalViews = computed(() => products.value.reduce((sum, p) => sum + p.views, 0))

const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(p => p.status === statusFilter.value)
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(p => p.category === categoryFilter.value)
  }
  
  return filtered
})

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    pending: 'warning',
    paused: 'grey',
    sold: 'info'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Aktif',
    pending: 'Beklemede',
    paused: 'Duraklatılmış',
    sold: 'Satıldı'
  }
  return labels[status] || 'Bilinmiyor'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
}

const viewProduct = (product) => {
  navigateTo(`/products/${product.id}`)
}

const editProduct = (product) => {
  navigateTo(`/products/${product.id}/edit`)
}

const toggleProductStatus = (product) => {
  if (product.status === 'active') {
    product.status = 'paused'
  } else if (product.status === 'paused') {
    product.status = 'active'
  }
}

const deleteProduct = (product) => {
  if (confirm(`${product.title} ilanını silmek istediğinizden emin misiniz?`)) {
    products.value = products.value.filter(p => p.id !== product.id)
  }
}
</script>

<style scoped>
.account-products {
  max-width: 100%;
}

.page-header h1 {
  color: #1a1a1a;
  line-height: 1.2;
}

.stats-card,
.filters-card,
.products-card {
  border-radius: 16px;
  background: white;
}

.stat-item {
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.product-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  border-radius: 12px 12px 0 0;
}

.product-details {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .stats-card .v-card-text,
  .filters-card .v-card-text,
  .products-card .v-card-text {
    padding: 16px;
  }
  
  .stats-card .v-card-title,
  .filters-card .v-card-title,
  .products-card .v-card-title {
    padding: 16px;
  }
}
</style> 