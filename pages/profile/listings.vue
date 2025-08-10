<template>
  <div class="listings-page">
    <!-- Header -->
    <div class="page-header">
      <h2>
        İlanlarım <span class="product-count">{{ totalListings }} Ürün</span>
      </h2>
    </div>

    <!-- Search and Filter Bar -->
    <div class="search-filter-bar">
      <v-text-field
        v-model="searchQuery"
        placeholder="🔍 Marka, Ürün Adı, Kategori Arayın"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="search-input"
        hide-details
        @keyup.enter="handleSearch"
      />
      <div class="filter-buttons">
        <DateSorting
          v-model="selectedSort"
          class="sort-select"
        />
        <v-btn 
          variant="outlined" 
          size="small" 
          prepend-icon="mdi-filter"
          @click="showFilterDialog = true"
          class="filter-btn"
        >
          Filtrele
        </v-btn>
      </div>
    </div>

    <!-- Filter Modal Component -->
    <FilterModal
      v-model="showFilterDialog"
      v-model:price-range="priceRange"
      v-model:selected-swap="selectedSwap"
      v-model:selected-status="selectedStatus"
      @apply="applyFilters"
      @clear="clearFilters"
    />

    <!-- İlan Listesi -->
    <div class="listings-list">
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        <p>Ürünler yükleniyor...</p>
      </div>

      <div v-else-if="filteredListings.length > 0">
        <div v-for="listing in filteredListings" :key="listing.id" class="listing-item">
          <div class="listing-content">
            <!-- Sol taraf - Resim -->
            <div class="listing-image">
              <img :src="getImageUrl({path:listing.showcase_image})" :alt="listing.name" @error="handleImageError" />
            </div>

            <!-- Orta - Detaylar -->
            <div class="listing-details">
              <h4 class="listing-title">{{ listing.name }}</h4>
              <div class="listing-metrics">
                <span class="metric status-metric">{{ getStatusText(listing.status ? 'active' : 'expired') }}</span>
                <span class="metric">Takas: {{ listing.swap ? 'Evet' : 'Hayır' }}</span>
                <span class="metric">Durum: {{ listing.condition === 'new' ? 'Yeni' : 'Kullanılmış' }}</span>
              </div>
              <div class="listing-views">
                <span class="metric">Görüntülenme: {{ listing.view_count || 0 }}</span>
                <span class="metric">Favori: {{ listing.favorite_count || 0 }}</span>
                <span class="metric">Ürün Miktarı: {{ listing.quantity || 1 }}</span>
              </div>
            </div>

            <!-- Sağ taraf - Tarih ve Fiyat -->
            <div class="listing-info">
              <div class="listing-date">{{ formatDate(listing.created_at) }}</div>
              <div class="listing-price">{{ formatPrice(parseFloat(listing.price)) }} {{ listing.currency }}</div>
              <div class="listing-updated">Bitiş: {{ formatDate(listing.due_date) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <v-icon size="80">mdi-view-list</v-icon>
        </div>
        <h3>Henüz ilanınız bulunmuyor</h3>
        <p>İlk ilanınızı oluşturmaya başlayın ve satışa başlayın!</p>
        <v-btn
          size="large"
          @click="createListing"
          prepend-icon="mdi-plus"
          class="mt-4"
          variant="elevated"
          style="background: linear-gradient(135deg, #8b2865 0%, #a0526d 100%); color: white; font-weight: 600"
        >
          İlk İlanınızı Oluşturun
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsApi } from '~/composables/api/useProductsApi'
import { getImageUrl } from '~/utils/getImageUrl'
import FilterModal from '~/pages/profile/components/listings/FilterModal.vue'
import DateSorting from '~/pages/profile/components/listings/DateSorting.vue'

const productApi = useProductsApi()

// Filtreleme durumu
const filteringState = ref({
  search: '',
  page: 1,
  min_price: null as number | null,
  max_price: null as number | null,
  swap: 'all', // all, true, false
  orderBy: 'DATE_DESC' as string | null, // DATE_DESC, DATE_ASC, PRICE_DESC, PRICE_ASC
  status: 'all' // all, active, expired
})

// API verileri
const listings = ref<any[]>([])
const loading = ref(false)
const totalListings = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)

// Arama ve filtreleme
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedSwap = ref('all')
const selectedSort = ref('DATE_DESC')

// Filtre dialog
const showFilterDialog = ref(false)
const activePanel = ref('price')

// Fiyat aralığı
const priceRange = ref({
  min: null as number | null,
  max: null as number | null
})

// Filtrelenmiş ürünler
const filteredListings = computed(() => listings.value)

// Filtreleme durumunu güncelle
const updateFilteringState = () => {
  filteringState.value = {
    search: searchQuery.value,
    page: currentPage.value,
    min_price: priceRange.value.min,
    max_price: priceRange.value.max,
    swap: selectedSwap.value,
    orderBy: selectedSort.value,
    status: selectedStatus.value
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'expired':
      return 'red'
    case 'active':
      return 'green'
    default:
      return 'grey'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'expired':
      return 'Süresi Dolmuş'
    case 'active':
      return 'Aktif'
    default:
      return status
  }
}

const formatPrice = (price: number) => {
  return price.toLocaleString('tr-TR')
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('tr-TR')
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/assets/images/default-category.svg'
}

// API'den ürünleri getir
const fetchListings = async (page: number = 1) => {
  loading.value = true
  try {
    currentPage.value = page
    updateFilteringState()

    const res = (await productApi.myProducts2({ filter: filteringState.value })) as any
    console.log('res', res)
    if (res.data) {
      listings.value = res.data || []
      totalListings.value = res.total || 0
      totalPages.value = res.last_page || 1
      currentPage.value = res.current_page || 1
    }
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error)
    // Toast mesajı eklenebilir
  } finally {
    loading.value = false
  }
}

// Arama yap
const handleSearch = () => {
  currentPage.value = 1
  fetchListings(1)
}

// Filtreleme yap
const handleFilter = () => {
  currentPage.value = 1
  fetchListings(1)
}

// Sıralama yap
const handleSort = () => {
  currentPage.value = 1
  fetchListings(1)
}

// Sayfa değiştir
const handlePageChange = (page: number) => {
  fetchListings(page)
}

// Filtreleri temizle
const clearFilters = () => {
  selectedStatus.value = 'all'
  selectedSwap.value = 'all'
  priceRange.value = { min: null, max: null }
}

// Filtreleri uygula
const applyFilters = () => {
  showFilterDialog.value = false
  currentPage.value = 1
  fetchListings(1)
}

const createListing = () => {
  navigateTo('/products/product-create')
}

// Sayfa yüklendiğinde ürünleri getir
onMounted(() => {
  fetchListings()
})

// Arama değiştiğinde otomatik arama yap
watch(searchQuery, () => {
  if (searchQuery.value.length > 2 || searchQuery.value.length === 0) {
    handleSearch()
  }
})
</script>

<style scoped>
.listings-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: white;
  padding: 24px 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.page-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.page-header .product-count {
  background: linear-gradient(135deg, #8b2865 0%, #a0526d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.page-header .v-btn {
  background: linear-gradient(135deg, #8b2865 0%, #a0526d 100%);
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.3);
  transition: all 0.3s ease;
}

.page-header .v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(139, 40, 101, 0.4);
}

.search-filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  align-items: center;
  background: white;
  padding: 24px 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.search-input {
  flex: 1;
  max-width: 450px;
}

.search-input :deep(.v-field) {
  border-radius: 16px;
  background: #f8fafc;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-input :deep(.v-field:hover) {
  border-color: #8b2865;
  background: white;
}

.search-input :deep(.v-field--focused) {
  border-color: #8b2865;
  background: white;
  box-shadow: 0 0 0 4px rgba(139, 40, 101, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.filter-buttons .v-btn {
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  border: 2px solid #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
}

.filter-buttons .v-btn:hover {
  border-color: #8b2865;
  color: #8b2865;
  background: rgba(139, 40, 101, 0.05);
  transform: translateY(-1px);
}

.filter-btn {
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  border: 2px solid #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
}

.filter-buttons .v-select {
  min-width: 140px;
}

.filter-buttons .v-select :deep(.v-field) {
  border-radius: 12px;
  background: #f8fafc;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.filter-buttons .v-select :deep(.v-field:hover) {
  border-color: #8b2865;
  background: white;
}

.filter-buttons .v-select :deep(.v-field--focused) {
  border-color: #8b2865;
  background: white;
  box-shadow: 0 0 0 4px rgba(139, 40, 101, 0.1);
}



.listings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.listing-item {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.listing-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.listing-content {
  display: flex;
  padding: 28px;
  position: relative;
  gap: 24px;
  align-items: flex-start;
}

.listing-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  position: relative;
}

/* Gradient overlay kaldırıldı - daha temiz görünüm */

.listing-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.listing-item:hover .listing-image img {
  transform: scale(1.05);
}

.listing-details {
  flex: 1;
  min-width: 0;
}

.listing-title {
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.listing-metrics {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.metric {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.status-metric {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 600;
  padding: 4px 10px;
  font-size: 12px;
}

.metric:hover {
  background: #e2e8f0;
  color: #475569;
}

.listing-views {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.listing-views .metric {
  font-size: 12px;
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 6px;
  color: #64748b;
}

.listing-info {
  text-align: right;
  min-width: 140px;
}

.listing-date {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.listing-price {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.listing-updated {
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 400;
}

.listing-options {
  position: absolute;
  top: 20px;
  right: 20px;
}

.listing-options .v-btn {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.listing-options .v-btn:hover {
  background: white;
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.empty-state .v-icon {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state h3 {
  margin: 20px 0 12px 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  color: #94a3b8;
  font-size: 16px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.loading-state p {
  margin: 20px 0 0 0;
  color: #94a3b8;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .listings-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    padding: 20px 24px;
  }

  .page-header h2 {
    font-size: 24px;
  }

  .search-filter-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 20px 24px;
  }

  .search-input {
    max-width: none;
  }

  .filter-buttons {
    justify-content: center;
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-buttons .v-select {
    min-width: 100%;
  }
  
  .filter-dialog {
    margin: 16px;
  }
  
  .filter-dialog-content {
    padding: 16px;
  }

  .listing-content {
    flex-direction: column;
    gap: 20px;
    padding: 24px;
  }

  .listing-info {
    text-align: left;
    min-width: auto;
  }

  .listing-options {
    position: static;
    align-self: flex-end;
  }

  .listing-status {
    padding: 0 24px 24px 24px;
  }
}

@media (max-width: 480px) {
  .listings-page {
    padding: 12px;
  }

  .page-header,
  .search-filter-bar {
    padding: 16px 20px;
    border-radius: 16px;
  }

  .listing-content {
    padding: 20px;
  }

  .listing-status {
    padding: 0 20px 20px 20px;
  }

  .listing-image {
    width: 80px;
    height: 80px;
  }
}
</style>