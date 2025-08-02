<template>
  <v-main class="category-selection-page">
    <!-- Header -->
    <div class="page-header">
      <v-container class="py-4">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">Alt Kategoriler</h1>
            <p class="text-body-1 text-grey-darken-1 mb-0">Ürününüz için uygun alt kategoriyi seçin</p>
          </div>
          <v-btn 
            color="grey" 
            variant="outlined" 
            prepend-icon="mdi-arrow-left"
            @click="navigateTo('/products/product-create/product-create-main-categories')"
          >
            Geri Dön
          </v-btn>
        </div>
      </v-container>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular color="primary" indeterminate size="64" />
      <p class="mt-4 text-grey">Alt kategoriler yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-icon class="mb-4" color="error" size="64">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mb-2">Hata Oluştu</h2>
      <p class="text-grey mb-6">{{ error }}</p>
      <v-btn color="primary" prepend-icon="mdi-refresh" @click="loadCategories">Tekrar Dene</v-btn>
    </div>

    <!-- Categories Grid -->
    <div v-else class="categories-content">
      <v-container class="py-6">
        <!-- Current Category Info -->
        <div v-if="currentCategory" class="current-category-info mb-6">
          <div class="trendyol-header-card">
            <div class="header-content">
              <div class="header-image">
                <v-img 
                  v-if="currentCategory.image" 
                  :src="getImageUrl({ path: currentCategory.image, provider:'cdn'})" 
                  :alt="currentCategory.name" 
                  cover 
                  class="header-img"
                />
                <div v-else class="header-placeholder">
                  <v-icon color="grey-lighten-1" size="32">mdi-folder-multiple</v-icon>
                </div>
              </div>
              <div class="header-info">
                <h2 class="header-title">
                  {{ currentCategory.name }}
                </h2>
                <p v-if="currentCategory.description" class="header-description">
                  {{ currentCategory.description }}
                </p>
              </div>
              <div class="header-badge">
                <v-icon color="white" size="20">mdi-format-list-bulleted</v-icon>
                <span>{{ categories.length }} Alt Kategori</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="categories-grid">
          <v-row>
            <v-col v-for="category in categories" :key="category.category_code" cols="12" lg="4" md="6" sm="12">
              <div class="simple-category-card" @click="handleCategoryClick(category)">
                <div class="card-header">
                  <div class="category-info">
                    <h3 class="category-name">{{ category.name }}</h3>
                    <div v-if="category.children && category.children.length > 0" class="subcategory-info">
                      <v-icon color="grey-darken-1" size="16">mdi-format-list-bulleted</v-icon>
                      <span>{{ category.children.length }} alt kategori</span>
                    </div>
                  </div>
                  <div class="category-action">
                    <v-icon 
                      :color="category.children && category.children.length > 0 ? 'primary' : 'success'"
                      size="24"
                    >
                      {{ category.children && category.children.length > 0 ? 'mdi-chevron-right' : 'mdi-check-circle' }}
                    </v-icon>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && categories.length === 0" class="empty-state">
          <v-icon class="mb-4" color="grey-lighten-2" size="80">mdi-folder-open</v-icon>
          <h3 class="text-h5 font-weight-semibold mb-2 text-grey-darken-1">Alt Kategori Bulunamadı</h3>
          <p class="text-body-1 text-grey mb-6">Bu kategorinin alt kategorisi bulunmuyor.</p>
          <v-btn 
            color="primary" 
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            @click="navigateTo('/products/product-create/product-create-main-categories')"
          >
            Ana Kategorilere Dön
          </v-btn>
        </div>
      </v-container>
    </div>

    <!-- Toast Messages -->
    <v-snackbar v-model="showToast" :color="toastColor" :timeout="3000" location="top">
      {{ toastMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showToast = false">Kapat</v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script lang="ts" setup>
import type { Category } from '~/types'
import { useCategoriesApi } from '~/composables/api'
import { getImageUrl } from '~/utils/getImageUrl'

// Route and Navigation
const route = useRoute()
const router = useRouter()

// Reactive Data
const categories = ref<Category[]>([])
const currentCategory = ref<Category | null>(null)
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
    // URL parametresinden kategori kodunu al
    const categoryCode = route.params.id as string
    if (!categoryCode) {
      throw new Error('Kategori kodu bulunamadı')
    }

    console.log('📂 Loading sub-categories for category:', categoryCode)
    
    // Alt kategorileri yükle
    const response = (await useCategoriesApi().getCategoriesByParent(categoryCode, 1, 50)) as any
    console.log('API Response:', response)

    if (response && response.data) {
      categories.value = response.data
      
      // Eğer API'den parent kategori bilgisi geliyorsa onu kullan
      if (response.data.length > 0 && response.data[0].parent) {
        currentCategory.value = response.data[0].parent
      } else {
        // Fallback olarak basit bir obje oluştur
        currentCategory.value = {
          category_code: categoryCode,
          name: 'Kategori',
          description: '',
          image: undefined,
          children: response.data
        } as any
      }
    } else {
      categories.value = []
      currentCategory.value = null
    }

  } catch (err) {
    console.error('Alt kategori yükleme hatası:', err)
    error.value = 'Alt kategoriler yüklenirken bir hata oluştu.'
    categories.value = []
    currentCategory.value = null
  } finally {
    loading.value = false
  }
}

async function handleCategoryClick(category: Category) {
  try {
    // Check if category has children (subcategories)
    if (category.children && category.children.length > 0) {
      // Alt kategoriler var, yeni sayfaya yönlendir
      showToastMessage(`"${category.name}" kategorisinin alt kategorileri yükleniyor...`, 'info')
      
      await router.push(`/product-create-sub-categories/${category.category_code}`)
    } else {
      // Alt kategori yok, bu kategoriyi seç ve product-create sayfasına yönlendir
      navigateTo(`/product-create/${category.category_code}`)

    }
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

// Category styling functions


// Lifecycle
onMounted(() => {
  console.log('🚀 Alt kategoriler sayfası yüklendi')
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

/* Current Category Info */
.current-category-info {
  animation: fadeInUp 0.5s ease;
}

/* Trendyol Header Card */
.trendyol-header-card {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #8b2865;
  box-shadow: 0 4px 16px rgba(139, 40, 101, 0.15);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
}

.header-info {
  flex: 1;
  min-width: 0;
}

.header-title {
  font-size: 20px;
  font-weight: 800;
  color: #4a148c;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.header-description {
  font-size: 14px;
  color: #6a1b9a;
  margin: 0;
  line-height: 1.4;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 40, 101, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}

.header-badge span {
  font-weight: 700;
}

/* Categories Grid */
.categories-grid {
  animation: fadeInUp 0.6s ease;
}

/* Simple Category Cards */
.simple-category-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
  margin-bottom: 16px;
}

.simple-category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #8b2865;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  min-height: 80px;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  margin: 0 0 8px 0;
}

.subcategory-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
}

.subcategory-info span {
  font-weight: 500;
}

.category-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(139, 40, 101, 0.1);
  transition: all 0.3s ease;
}

.simple-category-card:hover .category-action {
  background: rgba(139, 40, 101, 0.2);
  transform: scale(1.1);
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
  .simple-category-card {
    margin-bottom: 12px;
  }

  .card-header {
    padding: 16px;
    min-height: 70px;
  }

  .category-name {
    font-size: 16px;
  }

  .subcategory-info {
    font-size: 13px;
  }

  .category-action {
    width: 44px;
    height: 44px;
  }

  /* Header Card Responsive */
  .trendyol-header-card {
    padding: 16px;
  }

  .header-content {
    gap: 12px;
  }

  .header-image {
    width: 56px;
    height: 56px;
  }

  .header-title {
    font-size: 18px;
  }

  .header-description {
    font-size: 13px;
  }

  .header-badge {
    padding: 6px 10px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .simple-category-card {
    margin-bottom: 10px;
  }

  .card-header {
    padding: 14px;
    min-height: 60px;
  }

  .category-name {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .subcategory-info {
    font-size: 12px;
  }

  .category-action {
    width: 40px;
    height: 40px;
  }

  /* Header Card Mobile Responsive */
  .trendyol-header-card {
    padding: 12px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .header-image {
    width: 48px;
    height: 48px;
  }

  .header-title {
    font-size: 16px;
  }

  .header-description {
    font-size: 12px;
  }

  .header-badge {
    padding: 6px 10px;
    font-size: 11px;
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