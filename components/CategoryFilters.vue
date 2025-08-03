<template>
  <div class="category-filters">
    <!-- Header -->
    <div class="filters-header">
      <div class="header-content">
        <v-icon class="header-icon" color="primary">mdi-filter-variant</v-icon>
        <h2>{{ categoryTitle }}</h2>
      </div>
      <div class="header-subtitle">Filtreleri kullanarak arama yapın</div>
    </div>

    <!-- Filter Sections -->
    <div class="filters-container">
      <div v-for="section in filterSections" :key="section.key" class="filter-section">
        <div class="section-header" @click="toggleSection(section.key)">
          <div class="section-title">
            <v-icon class="section-icon" size="20">{{ section.icon }}</v-icon>
            <span>{{ section.title }}</span>
          </div>
          <v-icon 
            :class="{ 'rotate': !sections[section.key] }" 
            class="chevron-icon"
            size="18"
          >
            mdi-chevron-up
          </v-icon>
        </div>
        
        <v-expand-transition>
          <div v-if="sections[section.key]" class="section-content">
            <!-- Categories Section -->
            <div v-if="section.key === 'subCategories'" class="categories-list">
              <div v-for="category in subCategories" :key="category.id" class="category-item">
                <div class="category-content">
                  <v-icon class="category-icon" size="16">mdi-tag</v-icon>
                  <span class="category-name">{{ category.name }}</span>
                </div>
                <div class="category-count">12</div>
              </div>
            </div>

            <!-- Location Section -->
            <div v-else-if="section.key === 'location'" class="location-filters">
              <div class="filter-field">
                <v-select
                  v-model="filters.province"
                  :items="provinces"
                  class="modern-select"
                  density="comfortable"
                  label="İl seçin"
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  prepend-inner-icon="mdi-map-marker"
                  hide-details
                  @update:model-value="onProvinceChange"
                />
              </div>
              <div class="filter-field">
                <v-select
                  v-model="filters.district"
                  :items="districts"
                  class="modern-select"
                  density="comfortable"
                  label="İlçe seçin"
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  prepend-inner-icon="mdi-map-marker-outline"
                  hide-details
                />
              </div>
            </div>

            <!-- Price Section -->
            <div v-else-if="section.key === 'price'" class="price-filters">
              <div class="price-range">
                <div class="filter-field">
                  <v-text-field
                    v-model="filters.minPrice"
                    class="modern-input"
                    density="comfortable"
                    label="Minimum Fiyat"
                    type="number"
                    variant="outlined"
                    prepend-inner-icon="mdi-currency-try"
                    hide-details
                    placeholder="0"
                  />
                </div>
                <div class="filter-field">
                  <v-text-field
                    v-model="filters.maxPrice"
                    class="modern-input"
                    density="comfortable"
                    label="Maksimum Fiyat"
                    type="number"
                    variant="outlined"
                    prepend-inner-icon="mdi-currency-try"
                    hide-details
                    placeholder="∞"
                  />
                </div>
              </div>
            </div>

            <!-- Exchange Section -->
            <div v-else-if="section.key === 'exchange'" class="exchange-filters">
              <v-radio-group v-model="filters.exchange" class="modern-radio-group" hide-details>
                <v-radio 
                  v-for="option in exchangeOptions" 
                  :key="option.value"
                  :label="option.label" 
                  :value="option.value"
                  class="modern-radio"
                  color="primary"
                />
              </v-radio-group>
            </div>

            <!-- Keyword Section -->
            <div v-else-if="section.key === 'keyword'" class="keyword-filter">
              <v-text-field
                v-model="filters.keyword"
                class="modern-input"
                density="comfortable"
                label="Kelime ara"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
              />
            </div>
          </div>
        </v-expand-transition>
      </div>
    </div>

    <!-- Search Button -->
    <div class="search-section">
      <v-btn 
        @click="submitSearch" 
        color="primary" 
        block 
        :loading="isSearching"
        class="search-button"
        elevation="0"
        size="large"
      >
        <v-icon class="mr-2">{{ isSearching ? 'mdi-loading' : 'mdi-magnify' }}</v-icon>
        {{ isSearching ? 'Aranıyor...' : 'Filtrele' }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useCategoriesApi, useLocationApi } from "~/composables/api"
// useProductsStore auto-import ile kullanılıyor

// Composables
const route = useRoute()
const { getSubCategoriesById } = useCategoriesApi()
const { getCities, getDistricts } = useLocationApi()
const productsStore = useProductsStore()

// Reactive data
const subCategories = ref([])
const provinces = ref([])
const districts = ref([])
const isSearching = ref(false)

// Computed properties
const categoryId = computed(() => route.params.id)
const categoryTitle = computed(() => subCategories.value[0]?.parent?.name || 'Kategoriler')

// Filter sections configuration with icons
const filterSections = [
  { key: 'subCategories', title: 'Alt Kategoriler', icon: 'mdi-tag-multiple' },
  { key: 'location', title: 'Konum', icon: 'mdi-map-marker' },
  { key: 'price', title: 'Fiyat Aralığı', icon: 'mdi-currency-try' },
  { key: 'exchange', title: 'Takas Durumu', icon: 'mdi-swap-horizontal' },
  { key: 'keyword', title: 'Kelime Arama', icon: 'mdi-magnify' }
]

const exchangeOptions = [
  { label: 'Tümü', value: 'all' },
  { label: 'Takas Var', value: 'yes' },
  { label: 'Takas Yok', value: 'no' }
]

// Reactive state
const sections = reactive({
  subCategories: true,
  location: true,
  price: true,
  exchange: true,
  keyword: true
})

const filters = reactive({
  province: null,
  district: null,
  minPrice: null,
  maxPrice: null,
  exchange: 'all',
  keyword: ''
})



// Store'dan mevcut filtreleri al
const currentFilters = computed(() => productsStore.currentFilters)

// Methods
const toggleSection = (sectionKey) => {
  if (sectionKey in sections) {
    sections[sectionKey] = !sections[sectionKey]
  }
}

const onProvinceChange = (provinceId) => {
  // Reset district when province changes
  filters.district = null
  districts.value = []
  
  // Load districts for selected province
  if (provinceId) {
    loadDistricts(provinceId)
  }
}

const loadDistricts = async (provinceId) => {
  try {
    const response = await getDistricts(provinceId)
    districts.value = response?.data || []
  } catch (error) {
    console.error('Error loading districts:', error)
    districts.value = []
  }
}

const prepareSearchData = () => {
  return {
    categoryCode: String(categoryId.value),
    selectedCities: filters.province ? [filters.province] : [],
    selectedDistricts: filters.district ? [filters.district] : [],
    swap: filters.exchange === 'yes' ? true : filters.exchange === 'no' ? false : '',
    priceRange: {
      min: filters.minPrice,
      max: filters.maxPrice
    },
    dateSort: currentFilters.value.dateSort,
    priceSort: currentFilters.value.priceSort
  }
}

const submitSearch = async () => {
  isSearching.value = true
  
  try {
    // Prepare search data
    const searchData = prepareSearchData()

    // Update store filters and execute search
    productsStore.setFilters(searchData)
    const result = await productsStore.fetchFilteredProducts(1)
    
    if (result.success) {
      console.log('Search completed successfully')
    } else {
      console.error('Search failed:', result.error)
    }
  } catch (error) {
    console.error('Error during search:', error)
  } finally {
    isSearching.value = false
  }
}

const initializeData = async () => {
  try {
    // Load subcategories
    const subCategoriesResponse = await getSubCategoriesById(categoryId.value)
    console.log("xxxxxxxx",subCategoriesResponse)
    if (subCategoriesResponse && subCategoriesResponse.data) {
      subCategories.value = subCategoriesResponse.data
    }
    
    // Load cities
    const citiesResponse = await getCities()
    provinces.value = citiesResponse?.data || []
  } catch (error) {
    console.error('Initialization error:', error)
  }
}

// Lifecycle
onMounted(initializeData)

// Expose methods for parent component
defineExpose({
  submitSearch
})
</script>

<style scoped>
.category-filters {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 20px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 24px;
  height: fit-content;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  border: 1px solid rgba(139, 40, 101, 0.1);
  backdrop-filter: blur(10px);
}

/* Header Styles */
.filters-header {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(139, 40, 101, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.header-icon {
  background: linear-gradient(135deg, #8b2865, #a85587);
  border-radius: 12px;
  padding: 8px;
  color: white !important;
}

.filters-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  background: linear-gradient(135deg, #8b2865, #a85587);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
}

/* Filters Container */
.filters-container {
  margin-bottom: 24px;
}

/* Filter Section */
.filter-section {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(139, 40, 101, 0.08);
  transition: all 0.3s ease;
}

.filter-section:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(139, 40, 101, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 40, 101, 0.1);
}

.filter-section:last-child {
  margin-bottom: 0;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.section-header:hover {
  transform: translateX(4px);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.section-icon {
  color: #8b2865;
  background: rgba(139, 40, 101, 0.1);
  border-radius: 8px;
  padding: 4px;
}

.chevron-icon {
  color: #8b2865;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

/* Section Content */
.section-content {
  border-top: 1px solid rgba(139, 40, 101, 0.1);
  overflow: hidden;
  transform-origin: top;
  will-change: transform, opacity, max-height;
}

/* Categories List */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
  border: 1px solid rgba(139, 40, 101, 0.08);
  position: relative;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(139, 40, 101, 0.03), transparent);
  transition: left 0.6s ease;
}

.category-item:hover::before {
  left: 100%;
}

.category-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-color: rgba(139, 40, 101, 0.15);
  transform: translateX(6px) translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(139, 40, 101, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.04);
}

.category-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.category-icon {
  color: #8b2865;
  background: rgba(139, 40, 101, 0.08);
  border-radius: 10px;
  padding: 6px;
  transition: all 0.3s ease;
}

.category-item:hover .category-icon {
  background: rgba(139, 40, 101, 0.15);
  transform: scale(1.1);
}

.category-name {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
  letter-spacing: 0.2px;
  transition: color 0.3s ease;
}

.category-item:hover .category-name {
  color: #8b2865;
  font-weight: 600;
}

.category-count {
  background: linear-gradient(135deg, rgba(139, 40, 101, 0.08) 0%, rgba(168, 85, 135, 0.06) 100%);
  color: #8b2865;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(139, 40, 101, 0.1);
  transition: all 0.3s ease;
  min-width: 32px;
  text-align: center;
}

.category-item:hover .category-count {
  background: linear-gradient(135deg, rgba(139, 40, 101, 0.15) 0%, rgba(168, 85, 135, 0.12) 100%);
  border-color: rgba(139, 40, 101, 0.2);
  transform: scale(1.05);
}

/* Location Filters */
.location-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Price Filters */
.price-filters {
  padding: 8px 0;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(139, 40, 101, 0.1);
  border-radius: 50%;
}

/* Exchange Filters */
.exchange-filters {
  padding: 8px 0;
}

.modern-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modern-radio {
  margin: 0;
}

/* Filter Fields */
.filter-field {
  margin-bottom: 0;
}

/* Modern Input Styles */
.modern-select,
.modern-input {
  --v-field-border-radius: 12px;
  --v-field-border-width: 1px;
  --v-field-border-color: rgba(139, 40, 101, 0.15);
  --v-field-border-opacity: 1;
}

.modern-select :deep(.v-field),
.modern-input :deep(.v-field) {
  border-radius: 12px !important;
  border: 1px solid rgba(139, 40, 101, 0.15) !important;
  background: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;
  box-shadow: none !important;
}

.modern-select :deep(.v-field:hover),
.modern-input :deep(.v-field:hover) {
  border-color: rgba(139, 40, 101, 0.25) !important;
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(139, 40, 101, 0.08) !important;
}

.modern-select :deep(.v-field--focused),
.modern-input :deep(.v-field--focused) {
  border-color: #8b2865 !important;
  border-width: 1px !important;
  box-shadow: 0 0 0 2px rgba(139, 40, 101, 0.08) !important;
  background: rgba(255, 255, 255, 0.98) !important;
}

/* Remove outline elements completely */
.modern-select :deep(.v-field__outline),
.modern-input :deep(.v-field__outline) {
  display: none !important;
}

.modern-select :deep(.v-field__outline__start),
.modern-input :deep(.v-field__outline__start),
.modern-select :deep(.v-field__outline__end),
.modern-input :deep(.v-field__outline__end),
.modern-select :deep(.v-field__outline__notch),
.modern-input :deep(.v-field__outline__notch) {
  display: none !important;
}

/* Input field specific styles */
.modern-input :deep(.v-field__input) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  min-height: 44px !important;
}

/* Select field specific styles */
.modern-select :deep(.v-field__input) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  min-height: 44px !important;
}

/* Remove any additional borders */
.modern-select :deep(.v-field__field),
.modern-input :deep(.v-field__field) {
  border: none !important;
  box-shadow: none !important;
}

/* Ensure clean appearance */
.modern-select :deep(.v-field__append-inner),
.modern-input :deep(.v-field__append-inner),
.modern-select :deep(.v-field__prepend-inner),
.modern-input :deep(.v-field__prepend-inner) {
  border: none !important;
}

/* Search Section */
.search-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid rgba(139, 40, 101, 0.1);
}

.search-button {
  background: linear-gradient(135deg, #8b2865, #a85587) !important;
  border-radius: 16px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(139, 40, 101, 0.3) !important;
}

.search-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(139, 40, 101, 0.4) !important;
}

.search-button:active {
  transform: translateY(0) !important;
}

/* Scrollbar Styling */
.category-filters::-webkit-scrollbar {
  width: 6px;
}

.category-filters::-webkit-scrollbar-track {
  background: rgba(139, 40, 101, 0.05);
  border-radius: 3px;
}

.category-filters::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #8b2865, #a85587);
  border-radius: 3px;
}

.category-filters::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #a85587, #8b2865);
}

/* Responsive Design */
@media (max-width: 768px) {
  .category-filters {
    margin-bottom: 20px;
    max-height: none;
    border-radius: 16px;
    padding: 20px;
  }

  .price-range {
    flex-direction: column;
    gap: 8px;
  }

  .price-separator {
    transform: rotate(90deg);
  }

  .section-header:hover {
    transform: none;
  }

  .category-item:hover {
    transform: translateY(-1px);
  }
}

/* Animation Classes */
.v-expand-transition-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.v-expand-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.v-expand-transition-enter-from {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.v-expand-transition-leave-to {
  opacity: 0;
  transform: translateY(-3px);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.v-expand-transition-enter-to,
.v-expand-transition-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 400px;
  padding-top: 16px;
  padding-bottom: 0;
  margin-top: 8px;
  margin-bottom: 0;
}
</style> 