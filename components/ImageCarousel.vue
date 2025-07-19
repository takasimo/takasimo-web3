<template>
  <div class="image-carousel">
    <!-- Ana Resim Alanı -->
    <div class="carousel-wrapper" v-if="imageList.length">
      <button class="carousel-arrow left" @click="prev" aria-label="Önceki">
        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <v-img
        :src="getImageUrl({ path: imageList[current] })"
        class="carousel-image"
        :transition="false"
        cover
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-img>
      <button class="carousel-arrow right" @click="next" aria-label="Sonraki">
        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
      </button>
      
      <!-- Resim Sayısı Göstergesi -->
      <div class="image-counter">
        {{ current + 1 }} / {{ imageList.length }}
      </div>
    </div>
    
    <!-- Placeholder -->
    <div v-else class="carousel-placeholder">
      <v-img
        :src="getImageUrl({ path: '/images/placeholder.jpg' })"
        alt="placeholder"
        class="carousel-image"
        :transition="false"
        cover
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-img>
    </div>

    <!-- Thumbnail'lar -->
    <div class="thumbnails-container" v-if="imageList.length > 1">
      <div class="thumbnails-wrapper">
        <div 
          v-for="(img, i) in imageList" 
          :key="i" 
          :class="['thumbnail', { active: i === current }]" 
          @click="goTo(i)"
        >
          <v-img
            :src="getImageUrl({ path: img })"
            class="thumbnail-image"
            cover
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="primary" size="20" />
              </div>
            </template>
          </v-img>
        </div>
      </div>
    </div>

    <!-- Eski Dots (Mobil için) -->
    <div class="carousel-dots" v-if="imageList.length > 1">
      <span v-for="(img, i) in imageList" :key="i" :class="['dot', { active: i === current }]" @click="goTo(i)"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getImageUrl } from '~/utils/getImageUrl.js'

const props = defineProps({
  images: { type: Array, default: () => [] },
  showcase: { type: String, default: '' }
})

const imageList = computed(() => {
  const arr = []
  if (props.showcase) arr.push(props.showcase)
  if (Array.isArray(props.images)) {
    props.images.forEach(img => {
      if (img?.image && img.image !== props.showcase) arr.push(img.image)
    })
  }
  return arr
})

const current = ref(0)

const next = () => {
  current.value = (current.value + 1) % imageList.value.length
}

const prev = () => {
  current.value = (current.value - 1 + imageList.value.length) % imageList.value.length
}

const goTo = (i) => {
  current.value = i
}

watch(imageList, () => { current.value = 0 })
</script>

<style scoped>
.image-carousel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 16px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 6%);
  overflow: hidden;
  position: relative;
  padding: 0;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.carousel-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  display: block;
  background: #f8f9fa;
  border-radius: 0;
  transition: box-shadow 0.2s;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 1.5px solid #eee;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: #8B2865;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  border: none;
}

.carousel-arrow.left {
  left: 12px;
}

.carousel-arrow.right {
  right: 12px;
}

.carousel-arrow:hover {
  background: #8B2865;
  color: #fff;
  box-shadow: 0 4px 16px rgb(139 40 101 / 18%);
  transform: translateY(-50%) scale(1.1);
}

.carousel-arrow svg {
  fill: currentColor;
}

.image-counter {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
}

/* Thumbnails */
.thumbnails-container {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.thumbnails-wrapper {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #8B2865 #f0f0f0;
}

.thumbnails-wrapper::-webkit-scrollbar {
  height: 4px;
}

.thumbnails-wrapper::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 2px;
}

.thumbnails-wrapper::-webkit-scrollbar-thumb {
  background: #8B2865;
  border-radius: 2px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.thumbnail:hover {
  border-color: #8B2865;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #8B2865;
  box-shadow: 0 2px 8px rgb(139 40 101 / 20%);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 0 8px 0;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #eee;
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active {
  background: #8B2865;
}

.carousel-placeholder {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  min-height: 180px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .thumbnails-container {
    padding: 12px;
  }
  
  .thumbnail {
    width: 70px;
    height: 52px;
  }
}

@media (max-width: 600px) {
  .image-carousel {
    max-width: 100vw;
    border-radius: 0;
  }
  
  .carousel-image {
    max-height: 250px;
  }
  
  .carousel-arrow {
    width: 32px;
    height: 32px;
  }
  
  .carousel-arrow.left {
    left: 4px;
  }
  
  .carousel-arrow.right {
    right: 4px;
  }
  
  .image-counter {
    top: 8px;
    right: 8px;
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .thumbnails-container {
    padding: 8px;
  }
  
  .thumbnail {
    width: 60px;
    height: 45px;
  }
  
  .thumbnails-wrapper {
    gap: 6px;
  }
}
</style> 