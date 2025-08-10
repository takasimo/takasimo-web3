<template>
  <div class="pagination-container">
    <!-- Basit Sayfa Numaraları -->
    <div class="page-numbers">
      <v-btn
        v-if="currentPage > 1"
        variant="text"
        size="small"
        @click="handlePageChange(currentPage - 1)"
        class="page-btn"
      >
        <v-icon>mdi-chevron-left</v-icon>
        Önceki
      </v-btn>

      <div class="page-indicators">
        <span 
          v-for="page in visiblePages" 
          :key="page"
          :class="['page-number', { active: page === currentPage }]"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </span>
      </div>

      <v-btn
        v-if="currentPage < totalPages"
        variant="text"
        size="small"
        @click="handlePageChange(currentPage + 1)"
        class="page-btn"
      >
        Sonraki
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    
    <!-- Sayfa Bilgisi -->
    <div class="pagination-info">
      <span class="info-text">
        {{ from }}-{{ to }} / {{ total }} {{ itemType }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  items: any[]
  apiResponse: any
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

// Pagination bilgilerini API response'dan al
const currentPage = computed(() => props.apiResponse?.current_page || 1)
const totalPages = computed(() => props.apiResponse?.last_page || 1)
const from = computed(() => props.apiResponse?.from || 1)
const to = computed(() => props.apiResponse?.to || 1)
const total = computed(() => props.apiResponse?.total || 0)

// Genel item tipi
const itemType = computed(() => 'öğe')

// Görünür sayfa numaralarını hesapla
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    // Tüm sayfaları göster
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Mevcut sayfa etrafında sayfaları göster
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const handlePageChange = (page: number) => {
  console.log('🔄 Pagination: Sayfa değişikliği isteniyor:', page)
  emit('page-change', page)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  color: #666;
  font-size: 0.9rem;
}

.page-indicators {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.2s ease;
  user-select: none;
}

.page-number:hover {
  background-color: #f0f0f0;
  color: #333;
}

.page-number.active {
  background-color: #8B2865;
  color: white;
  font-weight: 500;
}

.pagination-info {
  text-align: center;
}

.info-text {
  color: #666;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .pagination-container {
    margin: 1rem 0;
  }
  
  .page-numbers {
    gap: 0.25rem;
  }
  
  .page-number {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.8rem;
  }
}
</style>
