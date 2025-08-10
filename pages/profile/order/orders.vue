<template>
  <div class="orders-page">
    <div class="orders-header">
      <v-icon class="orders-icon">mdi-shopping</v-icon>
      <h2>Siparişlerim</h2>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
      <p>Siparişler yükleniyor...</p>
    </div>

    

    <!-- Sipariş Listesi -->
    <div v-if="!loading && orders && orders.length > 0" class="orders-list">
      <div v-for="order in orders" :key="order.sale_code" class="order-item">
        <!-- Sipariş Header -->
        <div class="order-header">
          <v-chip :color="getStatusColor(order.shipment_groups[0]?.shipment.status)" size="small" class="status-chip">
            {{ getStatusText(order.shipment_groups[0]?.shipment.status) }}
          </v-chip>
          <span class="order-date">{{ formatDate(order.sales_date) }}</span>
          <v-btn variant="text" color="primary" size="small" class="details-btn" @click="viewOrder(order.sale_code)">
            Detaylar
            <v-icon right size="small">mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <!-- Ürün Bilgileri -->
        <div class="product-info">
          <v-icon class="product-icon">mdi-information-outline</v-icon>
          <div class="product-details">
            <div class="product-meta">
              <span class="product-status">{{ order.shipment_groups[0]?.shipment.status_turkish || 'Bilinmiyor' }}</span>
              <span class="product-name">{{ order.shipment_groups[0]?.items[0]?.product_name || 'Ürün Adı Bulunamadı' }}</span>
            </div>
            <div class="product-extra">
              <span class="product-quantity">{{ order.shipment_groups[0]?.items[0]?.quantity || 0 }} ürün</span>
              <span class="product-count">({{ order.shipment_groups[0]?.items[0]?.quantity || 0 }} adet)</span>
            </div>
          </div>
        </div>

        <!-- Ürün Görseli ve Detayları -->
        <div class="product-display">
          <img
            :src="getImageUrl({path:order.shipment_groups[0]?.items[0]?.showcase_image})"
            :alt="order.shipment_groups[0]?.items[0]?.product_name"
            class="product-image"
            @error="handleImageError"
          />
          <div class="product-info-text">
            <div class="product-quantity-text">{{ order.shipment_groups[0]?.items[0]?.quantity || 0 }} ürün</div>
            <div class="product-count-text">({{ order.shipment_groups[0]?.items[0]?.quantity || 0 }} adet)</div>
          </div>
        </div>

        <!-- Sipariş Footer -->
        <div class="order-footer">
          <div class="order-meta">
            <span class="order-date-full">Sipariş Tarihi</span>
            <span class="order-date-value">{{ formatDate(order.sales_date) }}</span>
          </div>
          <div class="order-total">
            <span class="total-label">Toplam</span>
            <span class="total-amount">{{ formatPrice(Number(order.total_amount)) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş durum -->
    <div v-if="!loading && (!orders || orders.length === 0)" class="empty-state">
      <v-icon size="48" color="grey-lighten-2">mdi-shopping</v-icon>
      <p>Henüz siparişiniz bulunmamaktadır.</p>
    </div>

    <!-- Pagination - Her zaman göster (test için) -->
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :from="from"
      :to="to"
      :total="total"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/api/useApi'
import { useToast } from '~/composables/useToast'
import { getImageUrl } from '~/utils/getImageUrl'
import Pagination from '~/components/Pagination.vue'
// Composables
const { api } = useApi()
const toast = useToast()

// Types
interface ShipmentItem {
  sale_code: string
  sales_item_code: string
  product_code: string
  product_name: string
  quantity: number
  unit_price: string
  total_price: string
  showcase_image: string
}

interface Shipment {
  shipment_code: string
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

interface Order {
  sale_code: string
  total_amount: string
  sales_date: string
  shipment_groups: ShipmentGroup[]
  returns: any[]
}

// State
const orders = ref<Order[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const from = ref(1)
const to = ref(1)
const total = ref(0)

// Siparişleri getir
const fetchOrders = async (page: number = 1) => {
  console.log('🚀 fetchOrders çağrıldı, sayfa:', page)
  loading.value = true

  try {
    const apiUrl = `/my-orders?per_page=2&page=${page}`
    console.log('📡 API çağrısı yapılıyor:', apiUrl)
    const response: any = await api.get(apiUrl)

    if (response && response.data && response.data.data) {
      // API response yapısına göre veri atama
      orders.value = response.data.data // Nested data yapısı
      totalPages.value = response.data.last_page
      currentPage.value = response.data.current_page
      from.value = response.data.from
      to.value = response.data.to
      total.value = response.data.total
      
      console.log('Pagination Debug:', {
        ordersLength: orders.value.length,
        totalPages: totalPages.value,
        currentPage: currentPage.value,
        from: from.value,
        to: to.value,
        total: total.value
      })
    } else {
      orders.value = []
      totalPages.value = 1
      currentPage.value = 1
      from.value = 1
      to.value = 1
      total.value = 0
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error('Siparişler yüklenirken bir hata oluştu')
    orders.value = []
    totalPages.value = 1
    currentPage.value = 1
    from.value = 1
    to.value = 1
    total.value = 0
  } finally {
    loading.value = false
  }
}

// Durum rengi
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'orange'
    case 'processing':
      return 'blue'
    case 'shipped':
      return 'purple'
    case 'delivered':
      return 'green'
    case 'canceled':
      return 'red'
    default:
      return 'grey'
  }
}

// Durum metni
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'BEKLİYOR'
    case 'processing':
      return 'HAZIRLANIYOR'
    case 'shipped':
      return 'KARGODA'
    case 'delivered':
      return 'TESLİM EDİLDİ'
    case 'canceled':
      return 'İPTAL'
    default:
      return 'BİLİNMEYEN'
  }
}

// Resim URL'ini al

// Resim hatası durumunda
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/assets/images/products/default-product.svg'
}

// Tarih formatlama
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Fiyat formatlama
const formatPrice = (price: number) => {
  if (price < 100) {
    return `₺${price.toFixed(2)}`
  }
  return `₺${price.toLocaleString('tr-TR')}`
}

// Sipariş detayları
const viewOrder = (orderId: string) => {
  console.log('Sipariş detayı:', orderId)
  // Detay sayfasına yönlendir
}

// Sayfa değişikliği
const handlePageChange = async (page: number) => {
  console.log('🔄 Sayfa değişikliği isteniyor:', page)
  await fetchOrders(page)
  console.log('✅ Sayfa değişikliği tamamlandı:', page)
}

// Component mount olduğunda siparişleri yükle
onMounted(async () => {
  await fetchOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 0;
  max-width: 800px;
}

.orders-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.orders-icon {
  color: #666;
}

.orders-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.status-chip {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-date {
  color: #666;
  font-size: 0.9rem;
}

.details-btn {
  text-transform: none;
  font-weight: 500;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.product-icon {
  color: #666;
  flex-shrink: 0;
}

.product-details {
  flex: 1;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.product-status {
  color: #28a745;
  font-weight: 500;
  font-size: 0.9rem;
}

.product-status:before {
  content: '✓';
  margin-right: 0.25rem;
}

.product-name {
  color: #333;
  font-weight: 500;
}

.product-extra {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.product-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  background: white;
  padding: 0.5rem;
}

.product-info-text {
  flex: 1;
}

.product-quantity-text {
  color: #333;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.product-count-text {
  color: #666;
  font-size: 0.9rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.order-meta {
  display: flex;
  flex-direction: column;
}

.order-date-full {
  color: #666;
  font-size: 0.85rem;
}

.order-date-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.order-total {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.total-label {
  color: #666;
  font-size: 0.85rem;
}

.total-amount {
  color: #e91e63;
  font-weight: 600;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .details-btn {
    align-self: flex-end;
  }

  .product-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .product-display {
    flex-direction: column;
    text-align: center;
  }

  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .order-total {
    align-self: flex-end;
  }
}
</style>