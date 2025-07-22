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
      <v-container fluid class="pa-0">
        <!-- Hero Section with Breadcrumb -->
        <div class="hero-section">
          <v-container class="py-4">
            <v-breadcrumbs :items="breadcrumbItems" class="px-0 breadcrumb-custom">
              <template v-slot:divider>
                <v-icon size="16" color="grey-lighten-1">mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-container>
        </div>

                <!-- Main Product Section -->
        <v-container class="py-4">
          <v-row>
            <!-- Left Column: Product Images & Description -->
            <v-col cols="12" md="8" class="product-left">
              <!-- Image Carousel with Badge -->
              <div class="image-container mb-4">
                <v-card class="image-card" elevation="2" rounded="lg">
                  <ImageCarousel :images="product.images" :showcase="product.showcase_image" />
                </v-card>
              </div>

              <!-- Product Title & Description -->
              <v-card class="product-info-card mb-4" elevation="2" rounded="lg">
                <v-card-text class="pa-4">
                  <h1 class="product-title text-h5 font-weight-bold mb-3">
                    {{ product.name || 'SÖZ NİŞAN ELBİSESİ' }}
                  </h1>
                  
                  <!-- Category Breadcrumb -->
                  <div class="category-breadcrumb mb-3">
                    <v-breadcrumbs :items="categoryBreadcrumbItems" class="px-0 py-0 category-breadcrumb-custom">
                      <template v-slot:divider>
                        <v-icon size="14" color="purple">mdi-chevron-right</v-icon>
                      </template>
                      <template v-slot:item="{ item }">
                        <v-chip 
                          size="small" 
                          color="purple" 
                          variant="flat" 
                          class="category-chip"
                          :class="{ 'category-chip-last': item.disabled }"
                        >
                          {{ item.title }}
                        </v-chip>
                      </template>
                    </v-breadcrumbs>
                  </div>
                  
                  <!-- Product Description -->
                  <div class="description-content text-body-1 mb-3">
                    {{ product.description || 'SÖZ NİŞAN ELBİSESİ LİLA RENK ABRAHAM KUMAŞ EL İŞLEMELİ İNCİ BONCUK DETAY 36-38 BEDEN İÇİN UYGUNDUR KENDİ ÖZEL TASARIMDIR.' }}
                  </div>

                </v-card-text>
              </v-card>
            </v-col>

            <!-- Right Column: Price, Seller & Specs -->
            <v-col cols="12" md="4" class="product-right">
              <!-- Price Card -->
              <v-card class="price-card mb-4" elevation="2" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="price-section text-center">
                    <div class="price-amount text-h3 font-weight-bold text-primary mb-2">
                      {{ product.price?.toLocaleString('tr-TR') || '5.000' }} TL
                    </div>
                    <div class="location-info text-center mt-3">
                      <div class="d-flex align-center justify-center mb-1">
                        <v-icon size="16" color="grey" class="mr-1">mdi-map-marker</v-icon>
                        <span class="text-body-2">{{ product.city?.name || 'Beyoğlu' }}, {{ product.district?.name || 'İstanbul' }}</span>
                      </div>
                      <div class="text-caption text-grey">{{ formatDate(product.created_at) || '19 Tem 2025' }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Seller Info Card -->
              <v-card class="seller-info-card mb-3" elevation="2" rounded="lg">
                <v-card-text class="pa-3">
                  <!-- Seller Header -->
                  <div class="seller-header d-flex align-center mb-3">
                    <v-avatar size="40" color="primary" class="mr-3">
                      <v-icon size="20" color="white">mdi-account</v-icon>
                    </v-avatar>
                    <div class="seller-details flex-1">
                      <div class="seller-name text-subtitle-1 font-weight-semibold">
                        {{ product.owner?.name || 'Yasemin A' }}
                      </div>
                      <div class="seller-join-date text-caption text-grey">
                        Ağu 2016'dan beri üye
                      </div>
                    </div>

                  </div>
                  
                  <!-- Product Status Info - Compact -->
                  <div class="product-status-info mb-3">
                    <!-- Stock Status -->
                    <div class="status-item d-flex align-center justify-space-between mb-2">
                      <div class="d-flex align-center">
                        <v-icon :color="stockStatus.color" size="16" class="mr-2">{{ stockStatus.icon }}</v-icon>
                        <span class="text-caption font-weight-medium">Stok Durumu</span>
                      </div>
                      <v-chip 
                        size="x-small" 
                        :color="stockStatus.color" 
                        :variant="stockStatus.variant"
                        class="status-chip"
                      >
                        {{ stockStatus.text }}
                      </v-chip>
                    </div>

                    <!-- Payment Methods -->
                    <div class="status-item d-flex align-center justify-space-between mb-2">
                      <div class="d-flex align-center">
                        <v-icon color="primary" size="16" class="mr-2">mdi-credit-card</v-icon>
                        <span class="text-caption font-weight-medium">Ödeme</span>
                      </div>
                      <div class="d-flex gap-1">
                        <v-chip 
                          v-for="method in availablePaymentMethods.slice(0, 2)" 
                          :key="method.type"
                          size="x-small" 
                          :color="method.color" 
                          variant="flat"
                          class="status-chip"
                        >
                          {{ method.text }}
                        </v-chip>
                      </div>
                    </div>

                    <!-- Exchange Status -->
                    <div class="status-item d-flex align-center justify-space-between mb-3">
                      <div class="d-flex align-center">
                        <v-icon :color="exchangeStatus.color" size="16" class="mr-2">{{ exchangeStatus.icon }}</v-icon>
                        <span class="text-caption font-weight-medium">Takas</span>
                      </div>
                      <v-chip 
                        size="x-small" 
                        :color="exchangeStatus.color" 
                        :variant="exchangeStatus.variant"
                        class="status-chip"
                      >
                        {{ exchangeStatus.text }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Action Buttons - Compact -->
                  <div class="seller-actions-compact">
                    <!-- Primary Actions -->
                    <div class="d-flex gap-2 mb-2">
                      <v-btn color="primary" variant="outlined" size="small" class="flex-1" prepend-icon="mdi-message">
                        Mesaj
                      </v-btn>
                      <v-btn color="orange" variant="outlined" size="small" class="flex-1" prepend-icon="mdi-handshake">
                        Teklif
                      </v-btn>
                    </div>

                    <!-- Buy Button -->
                    <v-btn color="success" variant="flat" size="small" block class="mb-2" prepend-icon="mdi-cart">
                      Sepete ekle - {{ product.price?.toLocaleString('tr-TR') || '5.000' }} TL
                    </v-btn>

                    <!-- Secondary Actions -->
                    <div class="d-flex gap-2">
                      <v-btn variant="text" size="small" class="flex-1" prepend-icon="mdi-account-circle">
                        Satıcı Profili
                      </v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Product Specifications -->
              <v-card class="specs-card mb-4" elevation="2" rounded="lg">
                <v-card-text class="pa-4">
                  <h3 class="text-h6 font-weight-semibold mb-3 d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
                    İlan Özellikleri
                  </h3>
                  
                  <v-list class="bg-transparent pa-0">
                    <v-list-item class="px-0 py-1">
                      <v-list-item-title class="text-body-2">İlan No</v-list-item-title>
                      <template v-slot:append>
                        <v-icon size="16" color="grey" class="mr-1">mdi-content-copy</v-icon>
                        <span class="text-body-2 font-weight-medium">{{ product.id || '1592427378' }}</span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="px-0 py-1">
                      <v-list-item-title class="text-body-2">İlan Tarihi</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-body-2 font-weight-medium">{{ formatDate(product.created_at) || '8 Temmuz 2025' }}</span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="px-0 py-1">
                      <v-list-item-title class="text-body-2">Ürün Durumu</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-body-2 font-weight-medium">{{ product.condition || 'Sıfır Ürün' }}</span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="px-0 py-1">
                      <v-list-item-title class="text-body-2">Konum</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-body-2 font-weight-medium">
                          {{ product.city?.name || 'İstanbul' }} / {{ product.district?.name || 'Bahçelievler' }}
                        </span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="px-0 py-1">
                      <v-list-item-title class="text-body-2">İletişim</v-list-item-title>
                      <template v-slot:append>
                        <v-btn size="x-small" color="primary" variant="flat" prepend-icon="mdi-message">
                          Mesaj
                        </v-btn>
                      </template>
                    </v-list-item>

                  </v-list>
                </v-card-text>
              </v-card>

  
            </v-col>

        </v-row>


      </v-container>
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
const sellerRating = ref(4.8)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { title: 'Ana Sayfa', to: '/' },
  { title: 'Ürünler', to: '/products' },
  { title: product.value?.categories?.[0]?.name || 'Kategori', to: '#' },
  { title: product.value?.name || 'Ürün', disabled: true }
])

// Category breadcrumb items
const categoryBreadcrumbItems = computed(() => {
  if (!product.value?.categories || product.value.categories.length === 0) {
    return [
      { title: 'Şarj Cihazı', to: '#' },
      { title: 'Aksesuar', to: '#' },
      { title: 'Cep Telefonu', to: '#' },
      { title: 'Elektronik', disabled: true }
    ]
  }
  
  return product.value.categories.map((category, index) => ({
    title: category.name,
    to: index === product.value.categories.length - 1 ? undefined : '#',
    disabled: index === product.value.categories.length - 1
  }))
})

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
        text: `${count} Adet Kaldı`,
        available: true
      }
    default:
      return {
        color: 'success',
        variant: 'tonal',
        icon: 'mdi-check-circle',
        text: `${count} Adet`,
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
/* Clean & User-Friendly Product Detail Styles */
.product-detail-page {
  background: #f8fafc;
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
  background: transparent;
}

/* Hero Section */
.hero-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.breadcrumb-custom .v-breadcrumbs-item {
  font-size: 14px;
  color: #64748b;
}

/* Layout */
.product-left {
  padding-right: 8px;
}

.product-right {
  padding-left: 8px;
}

/* Image Section */
.image-container {
  position: relative;
}

.image-card {
  background: white;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.image-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

/* Product Cards */
.price-info-card,
.product-info-card,
.seller-info-card,
.specs-card,
.description-card,
.safety-card,
.complaint-card {
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Price Card */
.price-card {
  border-left: 4px solid #8B2865;
}

.price-amount {
  color: #8B2865 !important;
  font-size: 2.2rem;
  line-height: 1.2;
}

.price-features .v-chip {
  font-weight: 500;
  font-size: 12px;
  height: 24px;
}

.location-info {
  color: #6b7280;
}

/* Product Info Card */
.product-info-card {
  border-left: 4px solid #3b82f6;
}

.product-title {
  color: #1e293b;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

/* Category Breadcrumb */
.category-breadcrumb {
  background: #f8f4ff;
  border: 1px solid #e9d5ff;
  border-radius: 8px;
  padding: 8px 12px;
}

.category-breadcrumb-custom .v-breadcrumbs-item {
  font-size: 12px;
}

.category-chip {
  font-size: 11px !important;
  height: 20px !important;
  font-weight: 500 !important;
}

.category-chip-last {
  background-color: #8b5cf6 !important;
  color: white !important;
}

.product-tags .v-chip {
  font-weight: 500;
  font-size: 12px;
  height: 24px;
}

/* Seller Info Card - Compact */
.seller-info-card {
  border-left: 4px solid #10b981;
}

.seller-name {
  color: #1e293b;
  font-size: 1rem;
  line-height: 1.2;
}

.seller-join-date {
  color: #6b7280;
  font-size: 0.75rem;
}

.seller-rating {
  text-align: right;
}

.seller-rating .v-rating {
  justify-content: flex-end;
}

/* Product Status Info */
.product-status-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
}

.status-item {
  min-height: 28px;
}

.status-chip {
  font-size: 10px !important;
  height: 18px !important;
  font-weight: 600 !important;
}

.seller-actions-compact .v-btn {
  font-weight: 500;
  text-transform: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 12px;
}

.seller-actions-compact .v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Secondary buttons styling */
.seller-actions-compact .v-btn--variant-text {
  font-size: 10px;
  min-width: 0;
  padding: 0 8px;
}

/* Specs Card */
.specs-card {
  border-left: 4px solid #f59e0b;
}

.specs-card .v-list-item {
  min-height: 40px;
}

/* Safety Card */
.safety-card {
  border-left: 4px solid #10b981;
}

/* Description Card */
.description-card {
  border-left: 4px solid #8b5cf6;
}

.description-content {
  line-height: 1.6;
  color: #374151;
  font-size: 15px;
}

/* Complaint Card */
.complaint-card {
  border-left: 4px solid #ef4444;
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
    padding-right: 8px;
  }
  
  .product-right {
    padding-left: 8px;
  }
  
  .product-main-row {
    gap: 16px;
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
  
  .hero-section {
    padding: 12px 0;
  }
  
  .product-header-card .pa-6,
  .description-card .pa-6,
  .details-card .pa-6 {
    padding: 24px !important;
  }
  
  .product-title {
    font-size: 1.75rem;
  }
  
  .price-amount {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .product-header-card .pa-6,
  .description-card .pa-6,
  .details-card .pa-6,
  .info-cards .pa-5,
  .price-card .pa-6,
  .seller-card .pa-4,
  .action-card .pa-4 {
    padding: 16px !important;
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
  
  .price-amount {
    font-size: 1.8rem !important;
  }
  
  .info-section {
    padding: 4px;
  }
  
  .action-buttons .v-btn {
    height: 44px;
    font-size: 14px;
  }
  
  .breadcrumb-custom {
    font-size: 12px;
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
