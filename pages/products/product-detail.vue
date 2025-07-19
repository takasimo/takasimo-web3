<template>
  <v-main class="product-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-grey">Ürün bilgileri yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mb-2">Ürün Bulunamadı</h2>
      <p class="text-grey mb-6">{{ error }}</p>
      <v-btn color="primary" @click="navigateTo('/')" prepend-icon="mdi-home">
        Ana Sayfaya Dön
      </v-btn>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-content">
      <v-container class="py-8">
        <v-row>
          <!-- Breadcrumb -->
          <v-col cols="12" class="mb-6">
            <v-breadcrumbs :items="breadcrumbItems" class="px-0">
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-col>

          <!-- Left Column: Product Images & Info -->
          <v-col cols="12" lg="7" class="product-left">
            <!-- Image Carousel -->
            <div class="image-section mb-6">
              <ImageCarousel :images="product.images" :showcase="product.showcase_image" />
            </div>

            <!-- Product Basic Info -->
            <div class="product-info-section">
              <div class="product-header mb-4">
                <h1 class="product-title text-h4 font-weight-bold mb-2">
                  {{ product.name }}
                </h1>
                <div class="product-meta d-flex align-center flex-wrap gap-4">
                  <div class="meta-item d-flex align-center">
                    <v-icon size="18" color="grey" class="mr-2">mdi-map-marker</v-icon>
                    <span class="text-grey">{{ product.city?.name || '' }} / {{ product.district?.name || '' }}</span>
                  </div>
                  <div class="meta-item d-flex align-center">
                    <v-icon size="18" color="grey" class="mr-2">mdi-clock-outline</v-icon>
                    <span class="text-grey">{{ timeAgo(product.updated_at) }}</span>
                  </div>
                  <div class="meta-item d-flex align-center">
                    <v-icon size="18" color="grey" class="mr-2">mdi-calendar-outline</v-icon>
                    <span class="text-grey">{{ formatDate(product.created_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Product Description -->
              <div class="product-description mb-6">
                <h3 class="text-h6 font-weight-semibold mb-3">Ürün Açıklaması</h3>
                <div class="description-content">
                  {{ product.description || 'Bu ürün için henüz açıklama eklenmemiş.' }}
                </div>
              </div>

              <!-- Product Details -->
              <div class="product-details">
                <h3 class="text-h6 font-weight-semibold mb-4">Ürün Detayları</h3>
                <v-card class="details-card" elevation="0" border>
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-tag</v-icon>
                      </template>
                      <v-list-item-title>İlan No</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-grey">{{ product.ad_no }}</span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title>İlan Tarihi</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-grey">{{ formatDate(product.created_at || product.ad_date) }}</span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-folder</v-icon>
                      </template>
                      <v-list-item-title>Kategori</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-grey">{{ product.categories?.[0]?.name || '-' }}</span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-package-variant</v-icon>
                      </template>
                      <v-list-item-title>Durum</v-list-item-title>
                      <template v-slot:append>
                        <v-chip 
                          :color="product.condition === 'new' ? 'success' : 'warning'" 
                          size="small"
                          variant="flat"
                        >
                          {{ product.condition === 'new' ? 'Yeni' : 'İkinci El' }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
              </div>
            </div>
          </v-col>

          <!-- Right Column: Seller Info & Actions -->
          <v-col cols="12" lg="5" class="product-right">
            <div class="sticky-sidebar">
              <!-- Price Card -->
              <v-card class="price-card mb-6" elevation="2" border>
                <v-card-text class="pa-6">
                  <div class="price-display text-center">
                    <div class="price-amount text-h3 font-weight-bold text-primary mb-2">
                      {{ product.price ? product.price.toLocaleString('tr-TR') : 'Fiyat Belirtilmemiş' }}
                    </div>
                    <div class="price-currency text-h6 text-grey">
                      {{ product.currency || 'TL' }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Seller Info Card -->
              <v-card class="seller-card mb-6" elevation="2" border>
                <v-card-text class="pa-6">
                  <div class="seller-header d-flex align-center mb-4">
                    <v-avatar size="56" color="primary" class="mr-4">
                      <v-icon size="32" color="white">mdi-account</v-icon>
                    </v-avatar>
                    <div class="seller-info">
                      <h3 class="text-h6 font-weight-semibold mb-1">
                        {{ product.owner?.name || 'Kullanıcı' }}
                      </h3>
                      <p class="text-grey text-body-2">
                        {{ product.city?.name || '' }} / {{ product.district?.name || '' }}
                      </p>
                    </div>
                  </div>
                  
                  <v-btn 
                    block 
                    variant="outlined" 
                    color="primary" 
                    class="mb-3"
                    @click="navigateToSellerProfile(product.owner?.user_code)"
                    prepend-icon="mdi-account-circle"
                  >
                    Satıcı Profilini Görüntüle
                  </v-btn>
                  
                  <v-btn 
                    block 
                    variant="outlined" 
                    color="primary"
                    prepend-icon="mdi-phone"
                  >
                    {{ product.owner?.phone || 'Telefon Numarası Yok' }}
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- Action Buttons -->
              <v-card class="action-card" elevation="2" border>
                <v-card-text class="pa-6">
                  <div class="action-buttons">
                    <v-btn 
                      block 
                      color="primary" 
                      size="large" 
                      class="mb-3"
                      prepend-icon="mdi-heart"
                      variant="flat"
                    >
                      Favorilere Ekle
                    </v-btn>
                    
                    <v-btn 
                      block 
                      color="secondary" 
                      size="large" 
                      class="mb-3"
                      prepend-icon="mdi-share-variant"
                      variant="outlined"
                    >
                      Paylaş
                    </v-btn>
                    
                    <v-btn 
                      block 
                      color="error" 
                      size="large"
                      prepend-icon="mdi-flag"
                      variant="outlined"
                    >
                      Şikayet Et
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-main>
</template>

<script setup>
import { useProductsApi } from '~/composables/api'
const route = useRoute()
const { getProductById } = useProductsApi()

const product = ref(null)
const loading = ref(true)
const error = ref(null)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { title: 'Ana Sayfa', to: '/' },
  { title: 'Ürünler', to: '/products' },
  { title: product.value?.categories?.[0]?.name || 'Kategori', to: '#' },
  { title: product.value?.name || 'Ürün', disabled: true }
])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return 'az önce'
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} gün önce`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} ay önce`
  return `${Math.floor(diff / 31536000)} yıl önce`
}

function navigateToSellerProfile(userCode) {
  if (userCode) {
    navigateTo(`/seller-profile/${userCode}`)
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const res = await getProductById(route.params.id)
    product.value = res
  } catch (err) {
    error.value = 'Ürün bulunamadı veya yüklenirken bir hata oluştu.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-detail-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.product-content {
  background: #f8f9fa;
}

.product-left {
  padding-right: 32px;
}

.product-right {
  padding-left: 32px;
}

.sticky-sidebar {
  position: sticky;
  top: 24px;
}

.image-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.product-info-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.product-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}

.product-title {
  color: #1a1a1a;
  line-height: 1.2;
}

.product-meta {
  color: #666;
}

.meta-item {
  font-size: 14px;
}

.product-description {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}

.description-content {
  line-height: 1.6;
  color: #444;
  font-size: 16px;
}

.details-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.price-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.price-card .v-card-text {
  color: white;
}

.price-amount {
  color: white !important;
}

.price-currency {
  color: rgba(255, 255, 255, 0.8) !important;
}

.seller-card {
  border-radius: 16px;
}

.seller-info h3 {
  color: #1a1a1a;
}

.action-card {
  border-radius: 16px;
}

.action-buttons .v-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .product-left {
    padding-right: 16px;
  }
  
  .product-right {
    padding-left: 16px;
  }
}

@media (max-width: 960px) {
  .product-left,
  .product-right {
    padding: 0;
  }
  
  .sticky-sidebar {
    position: static;
  }
  
  .product-info-section {
    padding: 24px;
    margin-top: 24px;
  }
  
  .product-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 600px) {
  .product-info-section {
    padding: 16px;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .product-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .meta-item {
    justify-content: flex-start;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
