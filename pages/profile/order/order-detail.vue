
<template>
  <v-main class="order-detail-page">
    <!-- Header with Back Button -->
    <div class="page-header">
      <v-btn
        variant="text"
        color="primary"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
        class="back-btn"
      >
        Siparişlerime Dön
      </v-btn>
      <h1 class="page-title">Sipariş Detayı</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="loading-text">Sipariş detayı yükleniyor...</p>
    </div>

    <!-- Order Detail Content -->
    <div v-if="!loading && orderDetail" class="order-detail-content">
      <!-- Order Information Section -->
      <div class="detail-card order-info-card">
        <div class="card-header">
          <div class="header-icon">
            <v-icon size="32" color="primary">mdi-receipt-text</v-icon>
          </div>
          <div class="header-content">
            <h2 class="card-title">Sipariş Bilgileri</h2>
            <p class="card-subtitle">Sipariş detayları ve özet bilgiler</p>
          </div>
        </div>
        
        <div class="order-info">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <v-icon size="small" color="grey">mdi-barcode</v-icon>
                Sipariş Kodu
              </div>
              <div class="info-value order-code">{{ orderDetail.sale_code }}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <v-icon size="small" color="grey">mdi-calendar</v-icon>
                Sipariş Tarihi
              </div>
              <div class="info-value">{{ formatDate(orderDetail.sales_date) }}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                <v-icon size="small" color="grey">mdi-package-variant</v-icon>
                Sipariş Özeti
              </div>
              <div class="info-value">{{ getTotalItems() }} Ürün, {{ orderDetail.shipment_groups.length }} Teslimat</div>
            </div>
            
            <div class="info-item total-item">
              <div class="info-label">
                <v-icon size="small" color="primary">mdi-currency-try</v-icon>
                Toplam Tutar
              </div>
              <div class="info-value total-amount">{{ formatPrice(Number(orderDetail.total_amount)) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cargo/Shipment Details Section -->
      <div class="detail-card cargo-card" v-for="group in orderDetail.shipment_groups" :key="group.shipment.shipment_code">
        <div class="card-header">
          <div class="header-icon">
            <v-icon size="32" :color="getStatusColor(group.shipment.status)">mdi-truck-delivery</v-icon>
          </div>
          <div class="header-content">
            <h3 class="card-title">Kargo Durumu</h3>
            <div class="status-badge" :class="`status-${group.shipment.status}`">
              {{ group.shipment.status_turkish }}
            </div>
          </div>
          <div class="header-actions">
            <v-btn 
              v-if="group.shipment.status === 'canceled'"
              color="warning" 
              variant="elevated"
              prepend-icon="mdi-arrow-left"
              @click="createReturnRequest(group.shipment.shipment_code)"
              class="return-btn"
            >
              İade Talebi Oluştur
            </v-btn>
          </div>
        </div>

        <div class="cargo-details">
          <div class="cargo-info">
            <div class="cargo-item">
              <v-icon size="small" color="grey">mdi-information</v-icon>
              <span>Güncel durum: <strong>{{ group.shipment.status_turkish }}</strong></span>
            </div>
            <div class="cargo-item">
              <v-icon size="small" color="grey">mdi-office-building</v-icon>
              <span>Kargo Firması: <strong>{{ group.shipment.carrier_name }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Product Items -->
        <div class="product-section">
          <h4 class="section-title">
            <v-icon size="small" color="primary">mdi-package-variant</v-icon>
            Ürün Detayları
          </h4>
          <div class="product-items">
            <div v-for="item in group.items" :key="item.sales_item_code" class="product-item">
              <div class="product-image-container">
                <img
                  :src="getImageUrl({path: item.showcase_image})"
                  :alt="item.product_name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div class="product-badge">
                  <v-icon size="small" color="white">mdi-package-variant</v-icon>
                </div>
              </div>
              <div class="product-details">
                <h5 class="product-name">{{ item.product_name }}</h5>
                <div class="product-meta">
                  <div class="quantity-info">
                    <v-icon size="small" color="primary">mdi-cart</v-icon>
                    <span class="quantity">{{ item.quantity }} adet</span>
                  </div>
                  <div class="price-info">
                    <span class="unit-price">{{ formatPrice(Number(item.unit_price)) }}</span>
                    <span class="multiply">×</span>
                    <span class="total-price">{{ formatPrice(Number(item.total_price)) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Address Section -->
      <div class="detail-card address-card">
        <div class="card-header">
          <div class="header-icon">
            <v-icon size="32" color="success">mdi-map-marker</v-icon>
          </div>
          <div class="header-content">
            <h3 class="card-title">Teslimat Adresi</h3>
            <p class="card-subtitle">Ürünün teslim edileceği adres bilgileri</p>
          </div>
        </div>
        
        <div class="address-info" v-if="parsedAddress">
          <div class="address-grid">
            <div class="address-item">
              <div class="address-label">
                <v-icon size="small" color="grey">mdi-account</v-icon>
                Ad Soyad
              </div>
              <div class="address-value">{{ parsedAddress.full_name }}</div>
            </div>
            
            <div class="address-item">
              <div class="info-label">
                <v-icon size="small" color="grey">mdi-phone</v-icon>
                Telefon
              </div>
              <div class="address-value">{{ parsedAddress.phone_number }}</div>
            </div>
            
            <div class="address-item full-width">
              <div class="address-label">
                <v-icon size="small" color="grey">mdi-map-marker</v-icon>
                Adres
              </div>
              <div class="address-value">{{ parsedAddress.full_address }}</div>
            </div>
            
            <div class="address-item full-width">
              <div class="address-label">
                <v-icon size="small" color="grey">mdi-city</v-icon>
                Adres Detayı
              </div>
              <div class="address-value">{{ parsedAddress.locality }}, {{ parsedAddress.district }} / {{ parsedAddress.city }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="!loading && !orderDetail" class="error-state">
      <div class="error-content">
        <v-icon size="64" color="error">mdi-alert-circle</v-icon>
        <h3 class="error-title">Sipariş Detayı Bulunamadı</h3>
        <p class="error-message">Aradığınız sipariş detayı bulunamadı veya erişim izniniz bulunmuyor.</p>
        <v-btn color="primary" variant="elevated" @click="goBack" class="error-btn">
          <v-icon left>mdi-arrow-left</v-icon>
          Siparişlerime Dön
        </v-btn>
      </div>
    </div>
  </v-main>
</template>
<script setup lang="ts">
import { useApi } from '~/composables/api/useApi'
import { useToast } from '~/composables/useToast'
import { getImageUrl } from '~/utils/getImageUrl'

// Composables
const { api } = useApi()
const toast = useToast()
const route = useRoute()
const router = useRouter()

// Types
interface AddressData {
  address_code: string
  title: string
  full_name: string
  phone_number: string
  city: string
  district: string
  locality: string
  full_address: string
  postal_code: string
}

interface ShipmentItem {
  sale_code: string
  sales_item_code: string
  product_code: string
  product_name: string
  quantity: number
  unit_price: string
  total_price: string
  seller_code: string
  showcase_image: string
}

interface Shipment {
  shipment_code: string
  seller_code: string
  carrier_name: string
  tracking_number: string | null
  tracking_url: string | null
  status: string
  status_turkish: string
  delivered_at: string | null
}

interface ShipmentGroup {
  shipment: Shipment
  seller_code: string
  items: ShipmentItem[]
}

interface OrderDetail {
  sale_code: string
  total_amount: string
  sales_date: string
  payment_date: string
  address_data: string
  shipment_groups: ShipmentGroup[]
  returns: any[]
}

// State
const orderDetail = ref<OrderDetail | null>(null)
const loading = ref(false)
const orderCode = route.params.id as string

// Computed
const parsedAddress = computed(() => {
  if (!orderDetail.value?.address_data) return null
  try {
    return JSON.parse(orderDetail.value.address_data) as AddressData
  } catch {
    return null
  }
})

// Methods
const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const response: any = await api.get(`/my-orders/${orderCode}`)
    orderDetail.value = response.data
  } catch (error) {
    toast.error('Sipariş detayı yüklenirken bir hata oluştu')
    router.push('/profile/order/orders')
  } finally {
    loading.value = false
  }
}

const getTotalItems = () => {
  if (!orderDetail.value?.shipment_groups) return 0
  return orderDetail.value.shipment_groups.reduce((total, group) => {
    return total + group.items.reduce((sum, item) => sum + item.quantity, 0)
  }, 0)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' - ' + date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  if (price < 100) {
    return `₺${price.toFixed(2)}`
  }
  return `₺${price.toLocaleString('tr-TR')}`
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/assets/images/products/default-product.svg'
}

const createReturnRequest = (shipmentCode: string) => {
  console.log('İade talebi oluşturuluyor:', shipmentCode)
  toast.info('İade talebi oluşturuldu')
}

const goBack = () => {
  router.push('/profile/order/orders')
}

// Lifecycle
onMounted(() => {
  if (orderCode) {
    fetchOrderDetail()
  }
})
</script>

<style scoped>
.order-detail-page {
  padding: 0;
  max-width: 900px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.loading-state p,
.error-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.order-detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.order-code {
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
}

.total-row {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.total-amount {
  color: #9c27b0;
  font-size: 1.2rem;
}

.cargo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.cargo-status h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.current-status,
.cargo-company {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.product-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  background: white;
  padding: 0.5rem;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.quantity-price {
  font-weight: 500;
}

.address-header h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .cargo-header {
    flex-direction: column;
    gap: 1rem;
  }

  .product-item {
    flex-direction: column;
    text-align: center;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>