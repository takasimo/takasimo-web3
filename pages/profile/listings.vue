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
    <div class="listings-grid">
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        <p>Ürünler yükleniyor...</p>
      </div>

      <div v-else-if="filteredListings.length > 0" class="grid-container">
        <div v-for="listing in filteredListings" :key="listing.id" class="listing-card">
          <div class="card-image">
            <img :src="getImageUrl({path:listing.showcase_image})" :alt="listing.name" @error="handleImageError" />
          </div>

          <div class="card-content">
            <h4 class="card-title">{{ listing.name }}</h4>
            
            <div class="card-metrics">
              <span class="metric status-metric">{{ getStatusText(listing.status ? 'active' : 'expired') }}</span>
              <span class="metric">Takas: {{ listing.swap ? 'Evet' : 'Hayır' }}</span>
              <span class="metric">Durum: {{ listing.condition === 'new' ? 'Yeni' : 'Kullanılmış' }}</span>
            </div>

            <div class="card-info">
              <div class="info-row">
                <span class="info-label">Görüntülenme:</span>
                <span class="info-value">{{ listing.view_count || 0 }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Favori:</span>
                <span class="info-value">{{ listing.favorite_count || 0 }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Miktar:</span>
                <span class="info-value">{{ listing.quantity || 1 }}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="card-date">{{ formatDate(listing.created_at) }}</div>
              <div class="card-price">{{ formatPrice(parseFloat(listing.price)) }} {{ listing.currency }}</div>
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
  max-width: none;
  margin: 0;
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
  gap: 24px;
  margin-bottom: 32px;
  align-items: stretch;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 28px 32px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.search-filter-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #8b2865 0%, #a0526d 50%, #8b2865 100%);
}

.search-input {
  flex: 0 0 50%;
  width: 50%;
  max-width: 50%;
  position: relative;
  display: flex;
  align-items: stretch;
}

.search-input :deep(.v-field) {
  border-radius: 18px;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 48px;
  min-height: 48px;
}

.search-input :deep(.v-input__control) {
  width: 100%;
}

.search-input :deep(.v-field:hover) {
  border-color: #8b2865;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(139, 40, 101, 0.1);
}

.search-input :deep(.v-field--focused) {
  border-color: #8b2865;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(139, 40, 101, 0.1), 0 8px 25px rgba(139, 40, 101, 0.15);
  transform: translateY(-1px);
}

.search-input :deep(.v-field__input) {
  padding: 16px 20px 16px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  height: 48px;
  min-height: 48px;
}

.search-input :deep(.v-field__prepend-inner) {
  margin-right: 12px;
  height: 48px;
  display: flex;
  align-items: center;
}

.filter-buttons {
  display: flex;
  gap: 16px;
  align-items: stretch;
  flex: 0 0 50%;
  width: 50%;
  min-width: 0;
}

.filter-buttons .v-select {
  flex: 1;
  min-width: 0;
  width: 50%;
}

.filter-buttons .v-btn {
  border-radius: 16px;
  font-weight: 600;
  text-transform: none;
  border: 2px solid #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
  padding: 12px 20px;
  height: 48px;
  flex: 1;
  min-width: 0;
  width: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-buttons .v-btn:hover {
  border-color: #8b2865;
  color: #8b2865;
  background: rgba(139, 40, 101, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.15);
}

.filter-btn {
  border-radius: 16px;
  font-weight: 600;
  text-transform: none;
  border: 2px solid #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
  padding: 12px 20px;
  height: 48px;
  flex: 1;
  min-width: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-btn:hover {
  border-color: #8b2865;
  color: #8b2865;
  background: rgba(139, 40, 101, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.15);
}

.filter-buttons .v-select :deep(.v-field) {
  border-radius: 16px;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 48px;
}

.filter-buttons .v-select :deep(.v-field:hover) {
  border-color: #8b2865;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(139, 40, 101, 0.1);
}

.filter-buttons .v-select :deep(.v-field--focused) {
  border-color: #8b2865;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(139, 40, 101, 0.1), 0 8px 25px rgba(139, 40, 101, 0.15);
  transform: translateY(-1px);
}



.listings-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.listing-card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.listing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.card-image {
  width: 100%;
  height: 180px; /* Adjust height for grid layout */
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
  transition: all 0.3s ease;
}

.listing-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
  flex-grow: 1;
}

.card-title {
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.card-metrics {
  display: flex;
  gap: 15px;
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

.card-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-label {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.info-value {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.card-date {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.card-price {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.5px;
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
    padding: 24px 24px;
    gap: 20px;
  }

  .search-input {
    flex: none;
    width: 100%;
  }

  .filter-buttons {
    justify-content: stretch;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    flex: none;
  }
  
  .filter-buttons .v-btn,
  .filter-btn {
    width: 100%;
    justify-content: center;
    height: 48px;
    flex: none;
  }
  
  .filter-buttons .v-select {
    min-width: 100%;
    width: 100%;
    height: 48px;
    flex: none;
  }
  
  .filter-dialog {
    margin: 16px;
  }
  
  .filter-dialog-content {
    padding: 16px;
  }

  .grid-container {
    grid-template-columns: 1fr; /* Single column on smaller screens */
  }

  .listing-card {
    flex-direction: column; /* Stack content on smaller screens */
  }

  .card-image {
    height: 150px; /* Adjust height for single column */
  }

  .card-content {
    padding: 15px; /* Adjust padding for single column */
  }

  .card-title {
    font-size: 16px; /* Adjust font size for single column */
  }

  .card-metrics {
    gap: 10px; /* Adjust gap for single column */
  }

  .metric {
    font-size: 13px; /* Adjust font size for single column */
  }

  .card-info {
    flex-direction: column; /* Stack info rows on smaller screens */
    gap: 8px; /* Adjust gap for stacked info */
  }

  .info-row {
    justify-content: space-between; /* Distribute space for stacked info */
  }

  .info-label {
    font-size: 12px; /* Adjust font size for single column */
  }

  .info-value {
    font-size: 13px; /* Adjust font size for single column */
  }

  .card-footer {
    flex-direction: column; /* Stack date and price on smaller screens */
    gap: 8px; /* Adjust gap for stacked footer */
  }

  .card-date {
    font-size: 12px; /* Adjust font size for single column */
  }

  .card-price {
    font-size: 16px; /* Adjust font size for single column */
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

  .listing-card {
    padding: 15px; /* Adjust padding for smaller screens */
  }

  .card-image {
    height: 120px; /* Further adjust height for smaller screens */
  }

  .card-title {
    font-size: 14px; /* Further adjust font size for smaller screens */
  }

  .card-metrics {
    gap: 8px; /* Further adjust gap for smaller screens */
  }

  .metric {
    font-size: 12px; /* Further adjust font size for smaller screens */
  }

  .card-info {
    gap: 6px; /* Further adjust gap for smaller screens */
  }

  .info-row {
    gap: 5px; /* Further adjust gap for smaller screens */
  }

  .info-label {
    font-size: 11px; /* Further adjust font size for smaller screens */
  }

  .info-value {
    font-size: 12px; /* Further adjust font size for smaller screens */
  }

  .card-footer {
    gap: 6px; /* Further adjust gap for smaller screens */
  }

  .card-date {
    font-size: 11px; /* Further adjust font size for smaller screens */
  }

  .card-price {
    font-size: 14px; /* Further adjust font size for smaller screens */
  }

  .listing-options {
    position: static;
    align-self: flex-end;
  }

  .listing-status {
    padding: 0 20px 20px 20px;
  }
}
</style>