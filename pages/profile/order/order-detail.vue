
<template>
  <div class="order-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
      <p>Sipariş detayı yükleniyor...</p>
    </div>

    <!-- Order Detail Content -->
    <div v-if="!loading && orderDetail" class="order-detail-content">
      <!-- Order Information Section -->
      <div class="detail-card">
        <div class="order-header">
          <h2>Sipariş Detayı</h2>
        </div>
        <div class="order-info">
          <div class="info-row">
            <span class="info-label">Sipariş Kodu:</span>
            <span class="info-value order-code">{{ orderDetail.sale_code }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sipariş Tarihi:</span>
            <span class="info-value">{{ formatDate(orderDetail.sales_date) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sipariş Özeti:</span>
            <span class="info-value">{{ getTotalItems() }} Ürün, {{ orderDetail.shipment_groups.length }} Teslimat</span>
          </div>
          <div class="info-row total-row">
            <span class="info-label">Tutar:</span>
            <span class="info-value total-amount">{{ formatPrice(Number(orderDetail.total_amount)) }}</span>
          </div>
        </div>
      </div>

      <!-- Cargo/Shipment Details Section -->
      <div class="detail-card" v-for="group in orderDetail.shipment_groups" :key="group.shipment.shipment_code">
        <div class="cargo-header">
          <div class="cargo-status">
            <h3>Kargo: {{ group.shipment.status_turkish }}</h3>
            <p class="current-status">Güncel durum: {{ group.shipment.status_turkish }}</p>
            <p class="cargo-company">Kargo Firması: {{ group.shipment.carrier_name }}</p>
          </div>
          <v-btn 
            v-if="group.shipment.status === 'canceled'"
            color="warning" 
            variant="elevated"
            prepend-icon="mdi-arrow-left"
            @click="createReturnRequest(group.shipment.shipment_code)"
          >
            İade Talebi Oluştur
          </v-btn>
        </div>

        <!-- Product Items -->
        <div class="product-items">
          <div v-for="item in group.items" :key="item.sales_item_code" class="product-item">
            <img
              :src="getImageUrl({path: item.showcase_image})"
              :alt="item.product_name"
              class="product-image"
              @error="handleImageError"
            />
            <div class="product-details">
              <h4 class="product-name">{{ item.product_name }}</h4>
              <div class="product-meta">
                <v-icon size="small" color="grey">mdi-cart</v-icon>
                <span class="quantity-price">{{ item.quantity }} × {{ formatPrice(Number(item.unit_price)) }} = {{ formatPrice(Number(item.total_price)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Address Section -->
      <div class="detail-card">
        <div class="address-header">
          <h3>Teslimat Adresi</h3>
        </div>
        <div class="address-info" v-if="parsedAddress">
          <div class="info-row">
            <span class="info-label">Ad Soyad:</span>
            <span class="info-value">{{ parsedAddress.full_name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Telefon:</span>
            <span class="info-value">{{ parsedAddress.phone_number }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Adres:</span>
            <span class="info-value">{{ parsedAddress.full_address }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Adres Detayı:</span>
            <span class="info-value">{{ parsedAddress.locality }}, {{ parsedAddress.district }} / {{ parsedAddress.city }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="!loading && !orderDetail" class="error-state">
      <v-icon size="48" color="error">mdi-alert-circle</v-icon>
      <p>Sipariş detayı bulunamadı</p>
      <v-btn color="primary" @click="goBack">Geri Dön</v-btn>
    </div>
  </div>
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
    const response = await api.get(`/my-orders/${orderCode}`)
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