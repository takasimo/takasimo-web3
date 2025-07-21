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
              <v-card class="price-card mb-4" elevation="1" border>
                <v-card-text class="pa-4">
                  <div v-if="product.price" class="price-content text-center">
                    <div class="price-amount text-h4 font-weight-bold text-primary mb-1">
                      {{ product.price.toLocaleString('tr-TR') }} ₺
                    </div>
                    <div class="d-flex justify-center gap-2">
                      <v-chip size="x-small" color="success" variant="flat">Pazarlık</v-chip>
                      <v-chip 
                        :color="product.swap ? 'warning' : 'grey'" 
                        size="x-small" 
                        variant="flat"
                      >
                        {{ product.swap ? 'Takas' : 'Takas Yok' }}
                      </v-chip>
                    </div>
                  </div>
                  
                  <div v-else class="no-price text-center">
                    <div class="text-h6 text-grey-darken-1 mb-1">Fiyat Belirtilmemiş</div>
                    <div class="text-body-2 text-grey">Satıcı ile iletişime geçin</div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Stock Status Card -->
              <v-card class="stock-card mb-4" elevation="1" border>
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon :color="stockStatus.color" size="20" class="mr-2">
                        {{ stockStatus.icon }}
                      </v-icon>
                      <v-chip
                        :color="stockStatus.color"
                        :variant="stockStatus.variant"
                        size="small"
                        class="font-weight-medium"
                      >
                        {{ stockStatus.text }}
                      </v-chip>
                    </div>
                    
                                          <div v-if="product.quantity > 0" class="stock-count">
                        <span class="text-body-1 font-weight-bold">{{ product.quantity }}</span>
                        <span class="text-body-2 text-medium-emphasis ml-1">adet</span>
                      </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Payment Methods Card -->
              <v-card class="payment-card mb-4" elevation="1" border>
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <div class="d-flex align-center">
                      <v-icon color="primary" size="20" class="mr-2">mdi-credit-card</v-icon>
                      <span class="text-body-1 font-weight-medium">Ödeme</span>
                    </div>
                  </div>
                  
                  <div class="payment-methods-compact">
                    <div class="d-flex gap-2 flex-wrap">
                      <v-chip
                        v-for="method in availablePaymentMethods"
                        :key="method.type"
                        :color="method.color"
                        size="small"
                        variant="tonal"
                        class="payment-chip"
                      >
                        <v-icon start size="16">{{ method.icon }}</v-icon>
                        {{ method.text }}
                      </v-chip>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Exchange Status Card -->
              <v-card class="exchange-card mb-4" elevation="1" border>
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon :color="exchangeStatus.color" size="20" class="mr-2">
                        {{ exchangeStatus.icon }}
                      </v-icon>
                      <v-chip
                        :color="exchangeStatus.color"
                        :variant="exchangeStatus.variant"
                        size="small"
                        class="font-weight-medium"
                      >
                        {{ exchangeStatus.text }}
                      </v-chip>
                    </div>
                  </div>


                </v-card-text>
              </v-card>

              <!-- Seller Info Card -->
              <v-card class="seller-card mb-4" elevation="1" border>
                <v-card-text class="pa-4">
                  <div class="seller-header d-flex align-center mb-3">
                    <v-avatar size="40" color="primary" class="mr-3">
                      <v-icon size="20" color="white">mdi-account</v-icon>
                    </v-avatar>
                    <div class="seller-info">
                      <div class="text-body-1 font-weight-semibold">
                        {{ product.owner?.name || 'Kullanıcı' }}
                      </div>
                      <div class="text-grey text-body-2">
                        {{ product.city?.name || '' }} / {{ product.district?.name || '' }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="seller-actions">
                    <v-btn 
                      block
                      variant="outlined" 
                      color="primary" 
                      size="small"
                      @click="navigateToSellerProfile(product.owner?.user_code)"
                      prepend-icon="mdi-account-circle"
                      class="mb-2"
                    >
                      Satıcı Profili
                    </v-btn>
                    
                    <!-- Communication Options -->
                    <div class="communication-options d-flex gap-2">
                      <v-btn 
                        v-for="comm in availableCommunicationMethods"
                        :key="comm.type"
                        variant="outlined" 
                        :color="comm.color"
                        size="small"
                        :prepend-icon="comm.icon"
                        class="flex-1"
                      >
                        {{ comm.text }}
                      </v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Action Buttons -->
              <v-card class="action-card" elevation="1" border>
                <v-card-text class="pa-4">
                  <div class="action-buttons">
                    <v-btn 
                      block 
                      color="primary" 
                      size="large" 
                      class="mb-3 action-btn"
                      prepend-icon="mdi-heart"
                      variant="flat"
                    >
                      Favorilere Ekle
                    </v-btn>
                    
                    <div class="d-flex gap-2">
                      <v-btn 
                        color="success" 
                        size="large" 
                        class="action-btn flex-1"
                        prepend-icon="mdi-message"
                        variant="outlined"
                      >
                        Mesaj
                      </v-btn>
                      
                      <v-btn 
                        color="grey" 
                        size="large"
                        class="action-btn flex-1"
                        prepend-icon="mdi-share-variant"
                        variant="outlined"
                      >
                        Paylaş
                      </v-btn>
                    </div>
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
import { useProductsApi } from '~/composables/api/index.js'
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

// Computed properties for status calculations
const stockStatus = computed(() => {
  if (!product.value) return { color: 'grey', variant: 'outlined', icon: 'mdi-help', text: 'Bilinmiyor', available: false }
  
  const status = product.value.stock_status || 'in_stock'
  const count = product.value.quantity || 0

  switch (status) {
    case 'out_of_stock':
      return {
        color: 'error',
        variant: 'flat',
        icon: 'mdi-close-circle',
        text: 'Stokta Yok',
        available: false
      }
    case 'low_stock':
      return {
        color: 'warning',
        variant: 'flat',
        icon: 'mdi-alert-circle',
        text: 'Az Stok Kaldı',
        available: true
      }
    default:
      return {
        color: 'success',
        variant: 'tonal',
        icon: 'mdi-check-circle',
        text: count > 10 ? 'Stokta Var' : 'Sınırlı Stok',
        available: true
      }
  }
})

const stockProgress = computed(() => {
  if (!product.value || !product.value.quantity) return 0
  const count = product.value.quantity
  const maxStock = 20 // Assume max stock for progress calculation
  return Math.min((count / maxStock) * 100, 100)
})

const availablePaymentMethods = computed(() => {
  if (!product.value) return []
  
  const availableMethods = product.value.accepted_payment_types || ['cash', 'card', 'bank_transfer']
  const allMethods = [
    {
      type: 'cash',
      color: 'success',
      icon: 'mdi-cash',
      text: 'Nakit'
    },
    {
      type: 'card',
      color: 'primary',
      icon: 'mdi-credit-card',
      text: 'Kredi Kartı'
    },
    {
      type: 'CARD', // API'den büyük harfle gelebilir
      color: 'primary',
      icon: 'mdi-credit-card',
      text: 'Kredi Kartı'
    },
    {
      type: 'bank_transfer',
      color: 'info',
      icon: 'mdi-bank',
      text: 'Havale/EFT'
    }
  ]
  
  // Sadece mevcut olan ödeme yöntemlerini döndür
  return allMethods.filter(method => availableMethods.includes(method.type))
})

const availableCommunicationMethods = computed(() => {
  if (!product.value) return []
  
  const availableComm = product.value.accepted_communication_types || ['message', 'phone']
  const allMethods = [
    {
      type: 'message',
      color: 'success',
      icon: 'mdi-message',
      text: 'Mesaj'
    },
    {
      type: 'phone',
      color: 'primary',
      icon: 'mdi-phone',
      text: 'Telefon'
    }
  ]
  
  // Sadece mevcut olan iletişim yöntemlerini döndür
  return allMethods.filter(method => availableComm.includes(method.type))
})

const exchangeStatus = computed(() => {
  if (!product.value) return { color: 'grey', variant: 'outlined', icon: 'mdi-help', text: 'Bilinmiyor' }
  
  const allowed = product.value.exchange_allowed || product.value.swap

  if (allowed) {
    return {
      color: 'success',
      variant: 'tonal',
      icon: 'mdi-swap-horizontal',
      text: 'Takas Kabul Ediliyor'
    }
  } else {
    return {
      color: 'error',
      variant: 'outlined',
      icon: 'mdi-close',
      text: 'Takas Yapılmıyor'
    }
  }
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const res = await getProductById(route.params.id)
    // Mock data ile test için gerekli alanları ekleyelim
    product.value = {
      ...res,
      stock_status: res.stock_status || 'in_stock',
      quantity: res.quantity || Math.floor(Math.random() * 20) + 1,
      accepted_payment_types: res.accepted_payment_types || ['cash', 'card', 'bank_transfer'],
      accepted_communication_types: res.accepted_communication_types || ['message', 'phone'],
      exchange_allowed: res.exchange_allowed !== undefined ? res.exchange_allowed : true
    }
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
  background: white;
  border: 1px solid #e0e0e0;
}

.price-display {
  text-align: left;
}

.price-header h3 {
  color: #424242;
  margin: 0;
}

.price-content {
  text-align: center;
}

.price-amount {
  color: #8B2865 !important;
  font-size: 2.5rem;
  line-height: 1.2;
}

.price-currency {
  color: #666 !important;
  font-weight: 500;
}

.price-details {
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
  padding-top: 16px;
}

.price-detail-item {
  border-bottom: 1px solid #f8f8f8;
}

.price-detail-item:last-child {
  border-bottom: none;
}

.no-price {
  text-align: center;
  padding: 24px 0;
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
  height: 48px;
  transition: all 0.2s ease;
}

.action-btn {
  position: relative;
  overflow: hidden;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn .btn-text {
  font-weight: 600;
  font-size: 14px;
}

.action-btn.v-btn--variant-flat {
  background: #8B2865 !important;
  color: white !important;
}

.action-btn.v-btn--variant-flat:hover {
  background: #7a1f54 !important;
}

.action-btn.v-btn--variant-outlined {
  border-color: #8B2865 !important;
  color: #8B2865 !important;
}

.action-btn.v-btn--variant-outlined:hover {
  background: rgba(139, 40, 101, 0.1) !important;
}

.action-btn.v-btn--variant-text {
  color: #666 !important;
}

.action-btn.v-btn--variant-text:hover {
  background: rgba(102, 102, 102, 0.1) !important;
}

/* Compact Card Styles */
.price-card,
.stock-card,
.payment-card,
.exchange-card,
.seller-card,
.action-card {
  border-radius: 12px;
}

.stock-card {
  border-left: 3px solid rgb(var(--v-theme-success));
}

.stock-count {
  text-align: right;
}

/* Payment Methods Compact */
.payment-methods-compact .payment-chip {
  font-size: 12px;
  height: 24px;
}

/* Exchange Card Compact */
.exchange-card {
  border-left: 3px solid rgb(var(--v-theme-success));
}

.exchange-card[class*="error"] {
  border-left-color: rgb(var(--v-theme-error)) !important;
}

/* Seller Actions */
.seller-actions .v-btn {
  font-size: 12px;
  min-width: 0;
}

/* Action Buttons Compact */
.action-buttons .v-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
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
  
  .payment-method-card {
    min-height: 80px;
  }
  
  .stock-count .text-h6 {
    font-size: 1.2rem !important;
  }
  
  .price-card,
  .stock-card,
  .payment-card,
  .exchange-card,
  .seller-card,
  .action-card {
    margin-bottom: 16px;
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
