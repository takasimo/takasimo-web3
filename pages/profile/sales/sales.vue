<template>
  <div class="sales-page">
    <div class="sales-header">
      <v-icon class="sales-icon">mdi-shopping-outline</v-icon>
      <h2>Satışlarım</h2>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <v-progress-circular color="primary" indeterminate size="48"></v-progress-circular>
      <p>Satışlar yükleniyor...</p>
    </div>

    <!-- Satış Listesi -->
    <div v-else-if="!loading && sales && sales.length > 0" class="sales-list">
      <div v-for="sale in sales" :key="sale.sale_code" class="sale-item">
        <!-- Satış Header -->
        <div class="sale-header">
          <div class="sale-info">
            <h3>Satış #{{ sale.sale_code.slice(-8) }}</h3>
            <p class="sale-date">{{ formatDate(sale.sales_date) }}</p>
          </div>
          <v-chip :color="getStatusColor(sale.shipment_groups[0]?.shipment?.status)" class="status-chip" size="small">
            {{ getStatusText(sale.shipment_groups[0]?.shipment?.status) }}
          </v-chip>
        </div>

        <!-- Alıcı Bilgileri -->
        <div class="buyer-info">
          <v-icon class="buyer-icon">mdi-account</v-icon>
          <div class="buyer-details">
            <span class="buyer-label">Alıcı:</span>
            <span class="buyer-name">{{ sale.buyer_name }}</span>
          </div>
        </div>

        <!-- Ürün Bilgileri -->
        <div v-for="shipmentGroup in sale.shipment_groups" :key="shipmentGroup.seller_code || 'default'" class="shipment-group">
          <div class="shipment-header">
            <v-icon class="shipment-icon">mdi-truck-delivery</v-icon>
            <span class="carrier-name">{{ shipmentGroup.shipment.carrier_name }}</span>
            <v-chip :color="getDeliveryStatusColor(shipmentGroup.shipment.status)" class="delivery-status-chip" size="x-small">
              {{ shipmentGroup.shipment.status_turkish }}
            </v-chip>
          </div>

          <!-- Ürün Resim Galerisi -->
          <div class="products-gallery">
            <div class="gallery-header">
              <span class="total-products">{{ getTotalProducts(shipmentGroup.items) }} ürün</span>
              <span class="total-items">({{ getTotalItems(shipmentGroup.items) }} adet)</span>
            </div>

            <div class="products-grid">
              <div v-for="item in shipmentGroup.items" :key="item.sales_item_code" class="product-card">
                <div class="product-image-container">
                  <img
                    :alt="item.product_name"
                    :src="getImageUrl({ path: item.showcase_image })"
                    class="product-img"
                    @error="handleImageError"
                  />
                </div>
                <div class="product-info">
                  <h5 class="product-name">{{ item.product_name }}</h5>
                  <div class="product-summary">
                    <span class="quantity">{{ item.quantity }} adet</span>
                    <span class="price">₺{{ formatPrice(Number(item.total_price)) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Satış Footer -->
        <div class="sale-footer">
          <div class="sale-summary">
            <div class="total-amount">
              <span class="label">Toplam Satış:</span>
              <span class="amount">₺{{ formatPrice(sale.total_amount) }}</span>
            </div>
            <div class="total-commission">
              <span class="label">Toplam Komisyon:</span>
              <span class="amount">₺{{ formatPrice(calculateTotalCommission(sale)) }}</span>
            </div>
            <div class="total-net">
              <span class="label">Net Kazanç:</span>
              <span class="amount">₺{{ formatPrice(calculateTotalNetEarnings(sale)) }}</span>
            </div>
          </div>
          <v-btn class="details-btn" size="small" variant="outlined" @click="viewSale(sale.sale_code)"> Detayları Gör </v-btn>
        </div>
      </div>
    </div>

    <!-- Boş durum -->
    <div v-else-if="!loading && (!sales || sales.length === 0)" class="empty-state">
      <v-icon color="#ccc" size="64">mdi-shopping-outline</v-icon>
      <h3>Henüz satışınız bulunmuyor</h3>
      <p>Ürünlerinizi satmaya başlayın ve satışlarınızı buradan takip edin.</p>
    </div>

    <!-- Pagination -->
    <Pagination v-if="sales && sales.length > 0" :api-response="apiResponse" :sales="sales" @page-change="handlePageChange" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/api/useApi'
import { useToast } from '~/composables/useToast'
import { getImageUrl } from '~/utils/getImageUrl'

// Types - Basitleştirildi

// Composables
const { api } = useApi()
const toast = useToast()

// Reactive state
const sales = ref<any[]>([])
const loading = ref(false)
const apiResponse = ref<any>(null)

// Satışları getir
const fetchSales = async (page: number = 1) => {
  console.log('🚀 fetchSales çağrıldı, sayfa:', page)
  loading.value = true

  try {
    const apiUrl = `/my-sales?per_page=2&page=${page}`
    console.log('📡 API çağrısı yapılıyor:', apiUrl)
    const response: any = await api.get(apiUrl)

    console.log('📡 API Response:', response)
    console.log('📡 Response.data:', response?.data)
    console.log('📡 Response.data.data:', response?.data?.data)

    // Güvenli veri kontrolü
    if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
      // Sales array'i güvenli şekilde al
      sales.value = response.data.data.data
      apiResponse.value = response.data.data

      console.log('📊 Sales yüklendi:', {
        salesLength: sales.value.length,
        apiResponse: apiResponse.value
      })
    } else if (response?.data?.data && Array.isArray(response.data.data)) {
      // Alternatif veri yapısı kontrolü
      sales.value = response.data.data
      apiResponse.value = response.data

      console.log('📊 Sales yüklendi (alternatif yapı):', {
        salesLength: sales.value.length,
        apiResponse: apiResponse.value
      })
    } else {
      console.warn('⚠️ Beklenmeyen veri yapısı:', response)
      sales.value = []
      apiResponse.value = null
    }
  } catch (error) {
    console.error('❌ Error fetching sales:', error)
    console.error('❌ Error details:', {
      message: (error as any)?.message,
      stack: (error as any)?.stack,
      response: (error as any)?.response
    })
    toast.error('Satışlar yüklenirken bir hata oluştu')
    sales.value = []
    apiResponse.value = null
  } finally {
    loading.value = false
  }
}

// Sayfa değişikliği
const handlePageChange = async (page: number) => {
  console.log('🔄 Sayfa değişikliği isteniyor:', page)
  await fetchSales(page)
  console.log('✅ Sayfa değişikliği tamamlandı:', page)
}

// Component mount olduğunda satışları yükle
onMounted(async () => {
  await fetchSales()
})

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

// Teslimat durum rengi
const getDeliveryStatusColor = (status: string) => {
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

// Toplam komisyon hesapla
const calculateTotalCommission = (sale: any): number => {
  return sale.shipment_groups.reduce((total: any, group: any) => {
    return total + group.items.reduce((sum: any, item: any) => sum + item.commission_amount, 0)
  }, 0)
}

// Toplam net kazanç hesapla
const calculateTotalNetEarnings = (sale: any): number => {
  return sale.shipment_groups.reduce((total: any, group: any) => {
    return total + group.items.reduce((sum: any, item: any) => sum + item.payment_amount, 0)
  }, 0)
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
  return price.toFixed(2)
}

// Resim hatası durumunda
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/assets/images/products/default-product.svg'
}

// Toplam ürün sayısı
const getTotalProducts = (items: any[]): number => {
  return items.length
}

// Toplam adet sayısı
const getTotalItems = (items: any[]): number => {
  return items.reduce((total: any, item: any) => total + item.quantity, 0)
}

// Ürün detaylarını göster
const showProductDetails = (item: any) => {
  console.log('Ürün detayı:', item)
  // Modal veya detay sayfası açılabilir
}

// Satış detayları
const viewSale = (saleId: string) => {
  console.log('Satış detayı:', saleId)
  // Detay sayfasına yönlendir
}
</script>

<style scoped>
.sales-page {
  padding: 0;
  max-width: 800px;
}

.sales-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.sales-icon {
  color: #666;
}

.sales-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #666;
}

.loading-state p {
  margin: 0;
  font-size: 1.1rem;
}

.sales-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.sale-item {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sale-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.sale-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.1rem;
}

.sale-date {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.status-chip {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.buyer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.buyer-icon {
  color: #666;
  flex-shrink: 0;
}

.buyer-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.buyer-label {
  color: #666;
  font-size: 0.9rem;
}

.buyer-name {
  color: #333;
  font-weight: 500;
}

.shipment-group {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.products-gallery {
  margin-top: 1rem;
}

.gallery-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dee2e6;
}

.total-products {
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

.total-items {
  color: #666;
  font-size: 0.9rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
}

.product-image-container {
  position: relative;
  margin-bottom: 0.75rem;
}

.product-img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.product-info {
  text-align: center;
}

.product-name {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-summary {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quantity {
  color: #666;
  font-size: 0.8rem;
}

.price {
  color: #28a745;
  font-weight: 600;
  font-size: 0.9rem;
}

.shipment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.shipment-icon {
  color: #666;
  flex-shrink: 0;
}

.carrier-name {
  color: #333;
  font-weight: 500;
  flex: 1;
}

.delivery-status-chip {
  font-size: 0.75rem;
  font-weight: 600;
}

.sale-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.sale-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.total-amount,
.total-commission,
.total-net {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.total-amount .label,
.total-commission .label,
.total-net .label {
  color: #666;
  font-size: 0.9rem;
}

.total-amount .amount {
  color: #333;
  font-weight: 500;
}

.total-commission .amount {
  color: #666;
  font-weight: 500;
}

.total-net .amount {
  color: #28a745;
  font-weight: 600;
  font-size: 1.1rem;
}

.details-btn {
  text-transform: none;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
  color: #666;
}

.empty-state h3 {
  margin: 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .sale-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .product-card {
    padding: 0.5rem;
  }

  .product-img {
    height: 60px;
  }

  .sale-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .sale-summary {
    width: 100%;
  }
}
</style>
