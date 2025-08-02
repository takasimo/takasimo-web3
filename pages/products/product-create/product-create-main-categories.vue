<template>
  <v-main class="category-selection-page">
    <!-- Header -->
    <div class="page-header">
      <v-container class="py-4">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
              Ana Kategoriler
            </h1>
            <p class="text-body-1 text-grey-darken-1 mb-0">
              Ürününüz için uygun ana kategoriyi seçin
            </p>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-grey">Ana kategoriler yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mb-2">Hata Oluştu</h2>
      <p class="text-grey mb-6">{{ error }}</p>
      <v-btn color="primary" @click="loadCategories" prepend-icon="mdi-refresh">
        Tekrar Dene
      </v-btn>
    </div>

    <!-- Categories Grid -->
    <div v-else class="categories-content">
      <v-container class="py-6">
        <!-- Categories Grid -->
        <div class="categories-grid">
          <v-row>
            <v-col 
              v-for="category in categories" 
              :key="category.category_code"
              cols="12" 
              sm="6" 
              md="4" 
              lg="3"
            >
              <div 
                class="trendyol-card" 
                @click="handleCategoryClick(category)"
              >
                <!-- Card Image Container -->
                <div class="card-image-container">
                  <div class="image-wrapper">
                    <v-img 
                      v-if="category.image" 
                      :src="getImageUrl({ path: category.image, provider:'cdn'})" 
                      :alt="category.name"
                      class="card-image"
                      cover
                    />
                    <div v-else class="placeholder-image">
                      <v-icon size="48" color="grey-lighten-1">mdi-folder-multiple</v-icon>
                    </div>
                  </div>
                  
                  <!-- Category Badge -->
                  <div class="category-badge">
                    <span class="badge-text">Ana Kategori</span>
                  </div>
                  
                  <!-- Hover Overlay -->
                  <div class="hover-overlay">
                    <div class="overlay-content">
                      <v-icon size="32" color="white">mdi-arrow-right</v-icon>
                      <span class="overlay-text">Alt Kategoriler</span>
                    </div>
                  </div>
                </div>

                <!-- Card Content -->
                <div class="card-content">
                  <h3 class="card-title">
                    {{ category.name }}
                  </h3>

                  <!-- Subcategory Count -->
                  <div v-if="category.children && category.children.length > 0" class="subcategory-count">
                    <v-icon size="16" color="grey-darken-1">mdi-format-list-bulleted</v-icon>
                    <span>{{ category.children.length }} alt kategori</span>
                  </div>
                  
                  <!-- Action Button -->
                  <div class="action-button">
                    <v-btn 
                      color="secondary"
                      variant="flat" 
                      size="small"
                      class="select-btn"
                      prepend-icon="mdi-folder-open"
                    >
                      Alt Kategoriler
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && categories.length === 0" class="empty-state">
          <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-folder-open</v-icon>
          <h3 class="text-h5 font-weight-semibold mb-2 text-grey-darken-1">
            Ana Kategori Bulunamadı
          </h3>
          <p class="text-body-1 text-grey mb-6">
            Henüz hiç ana kategori eklenmemiş.
          </p>
        </div>
      </v-container>
    </div>

    <!-- Toast Messages -->
    <v-snackbar
      v-model="showToast"
      :color="toastColor"
      :timeout="3000"
      location="top"
    >
      {{ toastMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showToast = false"
        >
          Kapat
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import {useCategoriesApi} from '~/composables/api'
import {getImageUrl} from '~/utils/getImageUrl'

// Route and Navigation
const route = useRoute()
const router = useRouter()

// Reactive Data
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('info')

// Methods
async function loadCategories() {
  loading.value = true
  error.value = null

  try {
    // Sadece ana kategorileri yükle (parent_code = null)
    const response = await useCategoriesApi().getCategoriesByParent(null, 1, 50) as any
    console.log("API Response:", response)

    if (response && response.data) {
      categories.value = response.data
    } else {
      categories.value = []
    }

  } catch (err) {
    console.error('Ana kategori yükleme hatası:', err)
    error.value = 'Ana kategoriler yüklenirken bir hata oluştu.'
    categories.value = []
  } finally {
    loading.value = false
  }
}

async function handleCategoryClick(category: Category) {
  try {
    // Alt kategoriler sayfasına yönlendir
    showToastMessage(`"${category.name}" kategorisinin alt kategorileri yükleniyor...`, 'info')
    
    // /product-create-sub-categories/:id formatında yönlendir
    await router.push(`/product-create-sub-categories/${category.category_code}`)
  } catch (err) {
    console.error('Kategori işleme hatası:', err)
    showToastMessage('Kategori işlenirken bir hata oluştu.', 'error')
  }
}

function showToastMessage(message: string, color = 'info') {
  toastMessage.value = message
  toastColor.value = color
  showToast.value = true
}

// Lifecycle
onMounted(() => {
  console.log('🚀 Ana kategoriler sayfası yüklendi')
  loadCategories()
})
</script>

<style scoped>
.category-selection-page {
  background: #f8fafc;
  min-height: 100vh;
}

/* Header */
.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Loading & Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

/* Categories Grid */
.categories-grid {
  animation: fadeInUp 0.6s ease;
}

/* Trendyol Style Cards */
.trendyol-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  height: 320px;
  border: 1px solid #f1f5f9;
}

.trendyol-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: #8B2865;
}

/* Card Image Container */
.card-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
}

.trendyol-card:hover .card-image {
  transform: scale(1.1);
}

/* Category Badge */
.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(139, 40, 101, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
}

.badge-text {
  font-size: 10px;
  font-weight: 700;
}

/* Hover Overlay */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(139, 40, 101, 0.9), rgba(156, 39, 176, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;
}

.trendyol-card:hover .hover-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
}

.overlay-text {
  display: block;
  margin-top: 8px;
  font-weight: 600;
  font-size: 14px;
}

/* Card Content */
.card-content {
  padding: 16px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Subcategory Count */
.subcategory-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
}

.subcategory-count span {
  font-weight: 500;
}

/* Action Button */
.action-button {
  margin-top: auto;
}

.select-btn {
  width: 100%;
  height: 36px;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8B2865, #9C27B0);
  border: none;
  transition: all 0.3s ease;
}

.select-btn:hover {
  background: linear-gradient(135deg, #6A1B9A, #8B2865);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 40, 101, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeInUp 0.5s ease;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 960px) {
  .trendyol-card {
    height: 280px;
  }
  
  .card-image-container {
    height: 160px;
  }
  
  .card-content {
    height: 120px;
    padding: 12px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .select-btn {
    height: 32px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .trendyol-card {
    height: 260px;
  }
  
  .card-image-container {
    height: 140px;
  }
  
  .card-content {
    height: 120px;
    padding: 12px;
  }
  
  .card-title {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .subcategory-count {
    font-size: 11px;
    margin-bottom: 8px;
  }
  
  .select-btn {
    height: 30px;
    font-size: 11px;
  }
  
  .category-badge {
    top: 8px;
    left: 8px;
    padding: 3px 6px;
  }
  
  .badge-text {
    font-size: 9px;
  }
}

/* Custom Scrollbar */
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