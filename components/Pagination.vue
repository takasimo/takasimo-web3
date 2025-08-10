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
        {{ from }}-{{ to }} / {{ total }} sipariş
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PaginationProps {
  currentPage: number
  totalPages: number
  from: number
  to: number
  total: number
}

interface PaginationEmits {
  (e: 'page-change', page: number): void
}

const props = defineProps<PaginationProps>()
const emit = defineEmits<PaginationEmits>()

// Görünür sayfa numaralarını hesapla
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (props.totalPages <= maxVisible) {
    // Tüm sayfaları göster
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Mevcut sayfa etrafında sayfaları göster
    let start = Math.max(1, props.currentPage - 2)
    let end = Math.min(props.totalPages, start + maxVisible - 1)
    
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
