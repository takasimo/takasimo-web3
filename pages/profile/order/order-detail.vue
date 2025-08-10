
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
            <div class="status-badge" :style="{ backgroundColor: getStatusColor(group.shipment.status) }">
              {{ getStatusText(group.shipment.status, group.shipment.status_turkish) }}
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

const getStatusColor = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: '#ff9100',
    processing: '#2196f3',
    completed: '#4caf50',
    cancelled: '#f44336',
    api_create_post: '#9c27b0',
    failed: '#f44336'
  }
  return statusMap[status] || '#666'
}

const getStatusText = (status: string, statusTurkish?: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'Beklemede',
    processing: 'İşleniyor',
    completed: 'Teslim Edildi',
    cancelled: 'İptal Edildi',
    api_create_post: 'Kargoya Verildi',
    failed: 'Başarısız'
  }
  if (statusTurkish) return statusTurkish
  return statusMap[status] || status
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
  max-width: 1000px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.page-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 2rem;
}

.loading-state p,
.error-state p {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color: #555;
}

.order-detail-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 2rem 2rem 2rem;
}

.detail-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f2f5;
}

.header-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.header-icon .v-icon {
  color: white !important;
}

.header-content {
  flex: 1;
}

.card-title {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 700;
}

.card-subtitle {
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.return-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.return-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.order-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.info-item.total-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.info-item.total-item .info-label,
.info-item.total-item .info-value {
  color: white;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.1rem;
}

.order-code {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: #495057;
  background: #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.total-amount {
  color: #28a745;
  font-size: 1.4rem;
  font-weight: 800;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  margin-top: 0.5rem;
}

.cargo-details {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.cargo-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.cargo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #495057;
  font-weight: 500;
}

.cargo-item strong {
  color: #2c3e50;
  font-weight: 700;
}

.product-section {
  margin-top: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9ecef;
}

.product-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.product-item:hover {
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-image-container {
  position: relative;
  flex-shrink: 0;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 16px;
  background: white;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.product-item:hover .product-image {
  border-color: #667eea;
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.quantity-info,
.price-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-weight: 500;
}

.quantity {
  background: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  color: #495057;
}

.unit-price {
  color: #6c757d;
  font-size: 0.9rem;
}

.multiply {
  color: #adb5bd;
  font-weight: 600;
}

.total-price {
  color: #28a745;
  font-weight: 700;
  font-size: 1.1rem;
}

.address-card .address-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.address-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.address-item:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
}

.address-item.full-width {
  grid-column: 1 / -1;
}

.address-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.address-value {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.error-title {
  margin: 0;
  color: #e74c3c;
  font-size: 1.5rem;
  font-weight: 700;
}

.error-message {
  margin: 0;
  color: #7f8c8d;
  font-size: 1.1rem;
  text-align: center;
  max-width: 500px;
  line-height: 1.6;
}

.error-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
}

.error-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-detail-page {
    padding: 0;
  }
  
  .page-header {
    padding: 1rem;
    margin-bottom: 1rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .order-detail-content {
    padding: 0 1rem 1rem 1rem;
    gap: 1.5rem;
  }
  
  .detail-card {
    padding: 1.5rem;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .order-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .cargo-info {
    grid-template-columns: 1fr;
  }
  
  .product-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .product-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .address-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    border-radius: 0 0 15px 15px;
  }
  
  .detail-card {
    border-radius: 15px;
    padding: 1rem;
  }
  
  .product-image {
    width: 80px;
    height: 80px;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
}
</style>