<template>
  <v-main class="category-selection-page">
    <!-- Header -->
    <div class="page-header">
      <v-container class="py-4">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
              Kategori Seçimi
            </h1>
            <p class="text-body-1 text-grey-darken-1 mb-0">
              Ürününüz için uygun kategoriyi seçin
            </p>
          </div>
          <v-btn 
            color="grey" 
            variant="outlined" 
            prepend-icon="mdi-arrow-left"
            @click="navigateTo('/products/product-create')"
          >
            Geri Dön
          </v-btn>
        </div>
      </v-container>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-section" v-if="breadcrumbItems.length > 1">
      <v-container class="py-2">
        <v-breadcrumbs 
          :items="breadcrumbItems" 
          class="px-0 py-2 breadcrumb-custom"
          @click:item="handleBreadcrumbClick"
        >
          <template v-slot:divider>
            <v-icon size="16" color="primary">mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <span 
              class="breadcrumb-item"
              :class="{ 'breadcrumb-active': item.disabled }"
              @click="!item.disabled && handleBreadcrumbClick(item)"
            >
              {{ item.title }}
            </span>
          </template>
        </v-breadcrumbs>
      </v-container>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-grey">Kategoriler yükleniyor...</p>
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
        <!-- Current Category Info -->
        <div v-if="currentCategory" class="current-category-info mb-6">
          <v-card class="pa-4" elevation="2" rounded="lg" color="primary-lighten-5">
            <div class="d-flex align-center">
              <v-avatar size="48" class="mr-4" color="primary">
                <v-img 
                  v-if="currentCategory.image" 
                  :src="currentCategory.image"
                  :alt="currentCategory.name"
                />
                <v-icon v-else color="white">mdi-folder</v-icon>
              </v-avatar>
              <div class="flex-1">
                <h2 class="text-h5 font-weight-bold text-primary mb-1">
                  {{ currentCategory.name }}
                </h2>
                <p v-if="currentCategory.description" class="text-body-2 text-grey-darken-1 mb-0">
                  {{ currentCategory.description }}
                </p>
              </div>
              <v-chip 
                color="primary" 
                variant="flat" 
                size="small"
                prepend-icon="mdi-format-list-bulleted"
              >
                {{ categories.length }} Alt Kategori
              </v-chip>
            </div>
          </v-card>
        </div>

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
              <v-card 
                class="category-card" 
                elevation="2" 
                rounded="lg"
                hover
                @click="handleCategoryClick(category)"
              >
                <div class="category-card-content">
                  <!-- Category Image -->
                  <div class="category-image-container">
                    <v-avatar size="80" class="category-avatar" color="primary-lighten-4">
                      <v-img 
                        v-if="category.image" 
                        :src="category.image"
                        :alt="category.name"
                        class="category-image"
                      />
                      <v-icon v-else size="40" color="primary">mdi-folder</v-icon>
                    </v-avatar>
                  </div>

                  <!-- Category Info -->
                  <div class="category-info">
                    <h3 class="category-title text-h6 font-weight-semibold mb-2">
                      {{ category.name }}
                    </h3>
                    <p v-if="category.description" class="category-description text-body-2 text-grey-darken-1 mb-3">
                      {{ category.description }}
                    </p>
                  </div>

                  <!-- Category Footer -->
                  <div class="category-footer">
                    <div class="d-flex align-center justify-space-between">
                      <v-chip 
                        size="small" 
                        color="primary" 
                        variant="tonal"
                        prepend-icon="mdi-tag"
                      >
                        Kategori
                      </v-chip>
                      <v-btn 
                        size="small" 
                        color="primary" 
                        variant="text"
                        append-icon="mdi-arrow-right"
                      >
                        Seç
                      </v-btn>
                    </div>
                  </div>
                </div>

                <!-- Hover Effect -->
                <div class="category-overlay">
                  <v-icon size="32" color="white">mdi-arrow-right-circle</v-icon>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && categories.length === 0" class="empty-state">
          <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-folder-open</v-icon>
          <h3 class="text-h5 font-weight-semibold mb-2 text-grey-darken-1">
            Alt Kategori Bulunamadı
          </h3>
          <p class="text-body-1 text-grey mb-6">
            Bu kategorinin alt kategorisi bulunmuyor.
          </p>
          <v-btn 
            color="primary" 
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            @click="goBack"
          >
            Üst Kategoriye Dön
          </v-btn>
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
// Route and Navigation
const route = useRoute()
const router = useRouter()

// Reactive Data
const categories = ref<Category[]>([])
const currentCategory = ref<Category | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const categoryHistory = ref<Category[]>([])

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('info')

// Computed
const breadcrumbItems = computed(() => {
  const items: Array<{title: string, disabled: boolean, categoryCode: string | null}> = [
    { title: 'Ana Kategoriler', disabled: false, categoryCode: null }
  ]

  categoryHistory.value.forEach((cat, index) => {
    items.push({
      title: cat.name,
      disabled: index === categoryHistory.value.length - 1,
      categoryCode: cat.category_code
    })
  })

  return items
})

// Mock API Functions - Removed since we're using real API

// Methods
async function loadCategories(parentCode: string | null = null) {
  loading.value = true
  error.value = null

  try {
    const response = await useCategoriesApi().getCategoriesByParent(parentCode) as any
    console.log("API Response:", response)

    if (response && response.data) {
      categories.value = response.data

      // Set current category if we have a parent code
      if (parentCode && categoryHistory.value.length > 0) {
        currentCategory.value = categoryHistory.value[categoryHistory.value.length - 1]
      } else {
        currentCategory.value = null
      }
    } else {
      categories.value = []
    }

  } catch (err) {
    console.error('Kategori yükleme hatası:', err)
    error.value = 'Kategoriler yüklenirken bir hata oluştu.'
    categories.value = []
  } finally {
    loading.value = false
  }
}

async function handleCategoryClick(category: Category) {
  try {
    // Kategoriyi geçmişe ekle
    categoryHistory.value.push(category)

    // Alt kategorileri kontrol et
    const subCategoriesResponse = await useCategoriesApi().getCategoriesByParent(category.category_code) as any

    if (subCategoriesResponse && subCategoriesResponse.data && subCategoriesResponse.data.length > 0) {
      // Alt kategoriler var, onları göster
      await loadCategories(category.category_code)

      // URL'yi güncelle
      await router.push({
        query: {
          ...route.query,
          category: category.category_code
        }
      })
    } else {
      // Alt kategori yok, toast göster
      showToastMessage('Bu kategorinin alt kategorisi bulunmuyor. Lütfen bu kategoriyi seçin.', 'warning')

      // Kategoriyi seç ve önceki sayfaya dön
      setTimeout(() => {
        selectCategory(category)
      }, 2000)
    }
  } catch (err) {
    console.error('Kategori yükleme hatası:', err)
    showToastMessage('Alt kategoriler yüklenirken bir hata oluştu.', 'error')
  }
}

function handleBreadcrumbClick(item: any) {
  if (item.disabled) return

  if (item.categoryCode === null) {
    // Ana kategorilere dön
    categoryHistory.value = []
    currentCategory.value = null
    loadCategories()
    router.push({ query: {} })
  } else {
    // Belirli bir kategoriye dön
    const targetIndex = categoryHistory.value.findIndex(cat => cat.category_code === item.categoryCode)
    if (targetIndex !== -1) {
      categoryHistory.value = categoryHistory.value.slice(0, targetIndex + 1)
      loadCategories(item.categoryCode)
      router.push({
        query: {
          ...route.query,
          category: item.categoryCode
        }
      })
    }
  }
}

function goBack() {
  if (categoryHistory.value.length > 0) {
    categoryHistory.value.pop()
    const parentCategory = categoryHistory.value[categoryHistory.value.length - 1]
    loadCategories(parentCategory?.category_code || null)

    if (parentCategory) {
      router.push({
        query: {
          ...route.query,
          category: parentCategory.category_code
        }
      })
    } else {
      router.push({ query: {} })
    }
  }
}

function selectCategory(category: Category) {
  // Kategori seçimi tamamlandı
  showToastMessage(`"${category.name}" kategorisi seçildi!`, 'success')

  setTimeout(() => {
    // Seçilen kategoriyi parent component'e gönder veya store'a kaydet
    navigateTo('/products/product-create')
  }, 1500)
}

function showToastMessage(message: string, color = 'info') {
  toastMessage.value = message
  toastColor.value = color
  showToast.value = true
}

// Lifecycle
onMounted(() => {
  const categoryCode = route.query.category as string
  if (categoryCode) {
    loadCategories(categoryCode)
  } else {
    loadCategories()
  }
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

/* Breadcrumb */
.breadcrumb-section {
  background: white;
  border-bottom: 1px solid #f1f5f9;
}

.breadcrumb-custom .breadcrumb-item {
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  transition: color 0.2s ease;
}

.breadcrumb-custom .breadcrumb-item:hover:not(.breadcrumb-active) {
  color: #3b82f6;
}

.breadcrumb-custom .breadcrumb-active {
  color: #1e293b;
  font-weight: 600;
  cursor: default;
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

/* Categories Grid */
.categories-grid {
  animation: fadeInUp 0.6s ease;
}

.category-card {
  position: relative;
  background: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 280px;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.category-card-content {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

/* Category Image */
.category-image-container {
  text-align: center;
  margin-bottom: 16px;
}

.category-avatar {
  border: 3px solid #f1f5f9;
  transition: all 0.3s ease;
}

.category-card:hover .category-avatar {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.category-image {
  object-fit: cover;
}

/* Category Info */
.category-info {
  flex: 1;
  text-align: center;
}

.category-title {
  color: #1e293b;
  line-height: 1.3;
  margin-bottom: 8px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-description {
  line-height: 1.4;
  max-height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Category Footer */
.category-footer {
  margin-top: auto;
}

/* Hover Overlay */
.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.category-card:hover .category-overlay {
  opacity: 0.9;
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
  .category-card {
    height: 240px;
  }
  
  .category-card-content {
    padding: 20px;
  }
  
  .category-avatar {
    width: 64px !important;
    height: 64px !important;
  }
}

@media (max-width: 600px) {
  .page-header .d-flex {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .category-card {
    height: 200px;
  }
  
  .category-card-content {
    padding: 16px;
  }
  
  .category-title {
    font-size: 1rem;
    min-height: 40px;
  }
  
  .category-avatar {
    width: 56px !important;
    height: 56px !important;
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