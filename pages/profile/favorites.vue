<template>
  <div class="favorites-page">
    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <div v-for="tab in tabs" :key="tab.key" :class="['tab-item', { active: activeTab === tab.key }]" @click="activeTab = tab.key">
        {{ tab.label }}
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Favori İlanlar Tab -->
      <div v-if="activeTab === 'listings'" class="tab-panel">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p>Favori ilanlar yükleniyor...</p>
        </div>

        <!-- Favori İlanlar Grid -->
        <div v-else-if="!loading && filteredFavorites.length > 0" class="favorites-grid">
          <v-card v-for="favorite in filteredFavorites" :key="favorite.product_code" class="favorite-card">
            <div class="favorite-image-container">
              <v-img
                :src="getImageUrl({path:favorite.products?.showcase_image})"
                :alt="favorite.products?.name"
                height="200"
                cover
                class="favorite-image"
              />
              <div class="favorite-badge">
                <v-icon color="white" size="16">mdi-credit-card</v-icon>
                <v-icon color="white" size="12">mdi-check</v-icon>
              </div>
              <v-btn icon class="favorite-btn active" @click="removeFromFavorites(favorite.product_code)">
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </div>

            <div class="favorite-info">
              <h4 class="favorite-title">{{ favorite.products?.name }}</h4>
              <p class="favorite-category">{{ favorite.products?.category_code }} / {{ favorite.products?.condition }}</p>
              <p class="favorite-price">{{ formatPrice(favorite.products?.price) }}</p>
              <p class="favorite-location">📍 {{ favorite.products?.full_address }}</p>
              <p class="favorite-date">{{ formatDate(favorite.created_at) }} tarihinde eklendi</p>
            </div>
          </v-card>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1" class="pagination-container">
          <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" @update:model-value="handlePageChange" />
        </div>

        <!-- Empty State -->
        <v-alert v-else-if="!loading && filteredFavorites.length === 0" type="info" class="empty-state">
          <div class="empty-content">
            <v-icon size="64" color="grey">mdi-heart-outline</v-icon>
            <h3>Henüz favori ürününüz bulunmamaktadır.</h3>
            <p>Beğendiğiniz ürünleri favorilere ekleyerek burada görebilirsiniz.</p>
            <v-btn color="primary" @click="browseProducts"> Ürünlere Göz At </v-btn>
          </div>
        </v-alert>
      </div>

      <!-- Favori Aramalar Tab -->
      <div v-if="activeTab === 'searches'" class="tab-panel">
        <div class="search-list">
          <div v-for="search in favoriteSearches" :key="search.id" class="search-item">
            <div class="search-content">
              <span class="search-term">{{ search.term }}</span>
              <v-btn
                icon
                variant="text"
                size="small"
                @click="toggleSearchNotifications(search.id)"
                :class="{ 'notifications-off': !search.notifications }"
              >
                <v-icon>{{ search.notifications ? 'mdi-bell' : 'mdi-bell-off' }}</v-icon>
              </v-btn>
            </div>
          </div>

          <v-alert v-if="favoriteSearches.length === 0" type="info" class="empty-state">
            <div class="empty-content">
              <v-icon size="64" color="grey">mdi-magnify</v-icon>
              <h3>Henüz favori aramanız bulunmamaktadır.</h3>
              <p>Sık aradığınız ürünleri favori aramalara ekleyerek bildirim alabilirsiniz.</p>
            </div>
          </v-alert>
        </div>
      </div>

      <!-- Favori Satıcılar Tab -->
      <div v-if="activeTab === 'sellers'" class="tab-panel">
        <div class="sellers-list">
          <div v-for="seller in favoriteSellers" :key="seller.id" class="seller-item">
            <div class="seller-content">
              <div class="seller-avatar">
                <v-icon color="white" size="24">mdi-account</v-icon>
              </div>
              <span class="seller-name">{{ seller.name }}</span>
            </div>
          </div>

          <v-alert v-if="favoriteSellers.length === 0" type="info" class="empty-state">
            <div class="empty-content">
              <v-icon size="64" color="grey">mdi-account-multiple</v-icon>
              <h3>Henüz favori satıcınız bulunmamaktadır.</h3>
              <p>Beğendiğiniz satıcıları favorilere ekleyerek yeni ilanlarından haberdar olabilirsiniz.</p>
            </div>
          </v-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/api/useApi'
import {getImageUrl} from '~/utils/getImageUrl'

// Tab configuration
const tabs = [
  { key: 'listings', label: 'Favori İlanlar' },
  { key: 'searches', label: 'Favori Aramalar' },
  { key: 'sellers', label: 'Favori Satıcılar' }
]

const activeTab = ref('listings')
const { api } = useApi()

// API state
const favorites = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

// Mock favori aramalar verileri
const favoriteSearches = ref([
  {
    id: 'S001',
    term: 'saatler',
    notifications: true
  },
  {
    id: 'S002',
    term: 'telefon',
    notifications: false
  }
])

// Mock favori satıcılar verileri
const favoriteSellers = ref([
  {
    id: 'SE001',
    name: 'mersinbutik02'
  }
])

// Filtre seçenekleri
const categoryOptions = ref(['Telefon', 'Bilgisayar', 'Elektronik', 'Ev & Yaşam', 'Giyim', 'Spor'])

const swapOptions = ref([
  { title: 'Tümü', value: 'all' },
  { title: 'Var', value: 'true' },
  { title: 'Yok', value: 'false' }
])

// Filtre state'leri
const selectedCategory = ref('')
const selectedSwap = ref('all')
const minPrice = ref('')
const maxPrice = ref('')
const searchQuery = ref('')
const showFilterDialog = ref(false)

// Filtrelenmiş favoriler
const filteredFavorites = computed(() => {
  console.log('filteredFavorites computed - favorites.value:', favorites.value)
  console.log('filteredFavorites computed - length:', favorites.value?.length)
  return favorites.value || []
})

// Favori ilanları getir
const fetchFavorites = async (page = 1) => {
  loading.value = true
  try {
    const response = (await api.get('favorites', {
      with: ['products'],
      filter: ['{"k":"product_code","o":"!=","v":null}', '{"k":"seller_code","o":"=","v":null}', '{"k":"is_deleted","o":"=","v":false}'],
      page: page
    })) as any

    console.log('Favorites API response:', response)

    if (response.data) {
      favorites.value = response.data || []
      totalPages.value = response.last_page || 1
      currentPage.value = response.current_page || 1
      totalItems.value = response.total || 0
    }
  } catch (error) {
    console.error('Favori ilanlar yüklenirken hata:', error)
  } finally {
    loading.value = false
  }
}

// Sayfa değişimi
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchFavorites(page)
}

// Favori çıkar
const removeFromFavorites = async (productCode: string) => {
  if (confirm('Bu ürünü favorilerden çıkarmak istediğinizden emin misiniz?')) {
    try {
      // API'den favori çıkarma işlemi yapılacak
      await api.delete(`favorites/${productCode}`)

      // Listeyi yenile
      fetchFavorites(currentPage.value)
    } catch (error) {
      console.error('Favori çıkarılırken hata:', error)
    }
  }
}

// Yardımcı fonksiyonlar
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

const formatPrice = (price: string) => {
  return `${price} TL`
}

const toggleSearchNotifications = (searchId: string) => {
  const search = favoriteSearches.value.find((s) => s.id === searchId)
  if (search) {
    search.notifications = !search.notifications
  }
}

const clearFilters = () => {
  selectedCategory.value = ''
  selectedSwap.value = 'all'
  minPrice.value = ''
  maxPrice.value = ''
}

const applyFilters = () => {
  showFilterDialog.value = false
}

const browseProducts = () => {
  console.log('Ürünlere göz at')
  // navigateTo('/products')
}

// Sayfa yüklendiğinde favorileri getir
onMounted(() => {
  if (activeTab.value === 'listings') {
    fetchFavorites()
  }
})

// Tab değiştiğinde veri yükle
watch(activeTab, (newTab) => {
  if (newTab === 'listings') {
    fetchFavorites()
  }
})
</script>

<style scoped>
.favorites-page {
  padding: 0;
  max-width: none;
  margin: 0;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  background: white;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 0;
}

.tab-item {
  flex: 1;
  padding: 20px 24px;
  text-align: center;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
}

.tab-item:hover {
  color: #333;
}

.tab-item.active {
  color: #8b2865;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #8b2865;
  border-radius: 2px 2px 0 0;
}

/* Tab Content */
.tab-content {
  padding: 24px;
}

.tab-panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* Search Filter Bar */
.search-filter-bar {
  display: flex;
  gap: 16px;
  align-items: stretch;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  position: relative;
}

.search-filter-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #8b2865 0%, #d63384 100%);
  border-radius: 16px 16px 0 0;
}

.search-input {
  flex: 0 0 50%;
  width: 50%;
  max-width: 50%;
  position: relative;
  display: flex;
  align-items: stretch;
}

.search-input :deep(.v-input__control) {
  width: 100%;
}

.search-field {
  height: 48px;
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
  height: 48px;
  flex: 1;
  min-width: 0;
  width: 50%;
  border: 2px solid #e9ecef;
  background: white;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.filter-buttons .v-btn:hover {
  border-color: #8b2865;
  color: #8b2865;
  background: rgba(139, 40, 101, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 40, 101, 0.15);
}

/* Favorites Grid */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.favorite-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  overflow: hidden;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.favorite-image-container {
  position: relative;
}

.favorite-image {
  border-radius: 16px 16px 0 0;
}

.favorite-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 32px;
  height: 32px;
  background: #8b2865;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn.active {
  color: #e91e63 !important;
}

.favorite-info {
  padding: 16px;
  background: #f8f9fa;
}

.favorite-title {
  margin: 0 0 8px 0;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-category {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 12px;
}

.favorite-price {
  margin: 0;
  color: #8b2865;
  font-weight: 700;
  font-size: 16px;
  text-align: right;
}

.favorite-location {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 12px;
}

.favorite-date {
  margin: 0;
  color: #999;
  font-size: 12px;
}

/* Search List */
.search-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.search-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-term {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.notifications-off {
  color: #999 !important;
}

/* Sellers List */
.sellers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.seller-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.seller-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.seller-avatar {
  width: 48px;
  height: 48px;
  background: #8b2865;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seller-name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  border: none !important;
  background: transparent !important;
}

.empty-content {
  text-align: center;
  padding: 2rem;
}

.empty-content h3 {
  margin: 1rem 0 0.5rem 0;
  color: #666;
}

.empty-content p {
  margin-bottom: 1.5rem;
  color: #888;
}

/* Filter Modal */
.filter-modal-card {
  border-radius: 20px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e9ecef;
}

.filter-actions {
  padding: 24px;
  gap: 16px;
  justify-content: flex-end;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-state p {
  margin-top: 16px;
  color: #666;
  font-size: 16px;
}

/* Pagination Container */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .search-filter-bar {
    flex-direction: column;
  }

  .search-input,
  .filter-buttons {
    flex: 1;
    width: 100%;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .tab-item {
    padding: 16px 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .tab-content {
    padding: 16px;
  }

  .tab-panel {
    padding: 16px;
  }
}
</style>