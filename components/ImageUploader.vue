<template>
  <div class="image-uploader">
    <!-- Upload Area -->
    <div v-if="uploadedImages.length === 0" class="upload-container">
      <div class="upload-area" @click="triggerFileUpload">
        <v-icon size="48" color="grey-lighten-1">mdi-plus</v-icon>
        <p class="upload-text">Görsel Yükle</p>
      </div>
      <input 
        ref="fileInput" 
        type="file" 
        multiple 
        accept="image/*" 
        class="file-input" 
        @change="handleFileUpload"
      />
    </div>

    <!-- Add More Button -->
    <div v-if="uploadedImages.length > 0 && uploadedImages.length < maxImages" class="add-more-container">
      <div class="add-more-area" @click="triggerFileUpload">
        <v-icon size="32" color="primary">mdi-plus</v-icon>
        <p class="add-more-text">Daha Fazla Ekle</p>
      </div>
      <input 
        ref="fileInput" 
        type="file" 
        multiple 
        accept="image/*" 
        class="file-input" 
        @change="handleFileUpload"
      />
    </div>
    
    <!-- Uploaded Images Grid -->
    <div v-if="uploadedImages.length > 0" class="uploaded-images-grid">
      <div 
        v-for="(image, index) in uploadedImages" 
        :key="index" 
        class="image-thumbnail"
        :class="{ 'showcase-image': index === 0 }"
      >
        <img :src="image" :alt="`Görsel ${index + 1}`" class="thumbnail-img" />
        <div class="thumbnail-overlay">
          <v-btn
            icon
            size="small"
            color="error"
            variant="flat"
            class="remove-btn"
            @click="removeImage(index)"
          >
            <v-icon size="16">mdi-close</v-icon>
          </v-btn>
        </div>
        <div v-if="index === 0" class="showcase-label">
          <v-chip color="primary" size="small" variant="flat">Vitrin</v-chip>
        </div>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="upload-progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <div class="progress-text">
        <span>Görseller yükleniyor...</span>
        <span class="progress-count">{{ uploadedImages.length }}/{{ selectedFiles.length }}</span>
      </div>
    </div>
    
    <!-- Upload Info -->
    <div class="upload-info">
      <div class="info-item">
        <v-chip color="purple" size="small" variant="outlined" prepend-icon="mdi-image">
          En fazla {{ maxImages }} resim
        </v-chip>
      </div>
      <div class="info-item">
        <v-chip color="blue" size="small" variant="outlined" prepend-icon="mdi-cloud-download">
          Max resim boyutu 15 MB
        </v-chip>
      </div>
    </div>
    
    <!-- Upload Status -->
    <div v-if="uploadedImages.length > 0" class="upload-status">
      <p class="status-text">{{ uploadedImages.length }}/{{ maxImages }} görsel yüklendi</p>
    </div>
    
    <p v-if="uploadedImages.length === 0" class="upload-hint">Yeni görseller eklemek için tıklayın</p>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  modelValue?: string[]
  maxImages?: number
  maxFileSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  maxImages: 10,
  maxFileSize: 15 * 1024 * 1024 // 15 MB
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'upload-complete': [images: string[]]
  'upload-error': [error: string]
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const uploadedImages = ref<string[]>(props.modelValue)
const isUploading = ref(false)
const uploadProgress = ref(0)

// Watchers
watch(() => props.modelValue, (newValue) => {
  uploadedImages.value = newValue
}, { deep: true })

watch(uploadedImages, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Methods
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  // Dosya sayısı kontrolü
  const totalImages = uploadedImages.value.length + files.length
  if (totalImages > props.maxImages) {
    emit('upload-error', `En fazla ${props.maxImages} resim yükleyebilirsiniz`)
    return
  }

  // Dosya boyutu kontrolü
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > props.maxFileSize) {
      emit('upload-error', `${files[i].name} dosyası çok büyük (max ${props.maxFileSize / (1024 * 1024)} MB)`)
      return
    }
  }

  // Dosyaları array'e ekle
  const fileArray = Array.from(files)
  selectedFiles.value = [...selectedFiles.value, ...fileArray]

  // Upload işlemini başlat
  await uploadImages(fileArray)
}

const uploadImages = async (files: File[]) => {
  isUploading.value = true
  uploadProgress.value = 0

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Simüle edilmiş upload işlemi (gerçek API'de burada upload yapılır)
      await simulateUpload(file)
      
      // Progress güncelle
      uploadProgress.value = ((i + 1) / files.length) * 100
      
      // Base64'e çevir (gerçek uygulamada API'den URL döner)
      const imageUrl = await fileToBase64(file)
      uploadedImages.value.push(imageUrl)
    }

    emit('upload-complete', uploadedImages.value)
  } catch (error) {
    console.error('Upload error:', error)
    emit('upload-error', 'Görsel yüklenirken hata oluştu')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
    // File input'u temizle
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const simulateUpload = (file: File): Promise<void> => {
  return new Promise((resolve) => {
    // Simüle edilmiş upload süresi (1-2 saniye)
    setTimeout(() => {
      resolve()
    }, Math.random() * 1000 + 500)
  })
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  selectedFiles.value.splice(index, 1)
}

// Expose methods for parent component
defineExpose({
  triggerFileUpload,
  removeImage,
  clearImages: () => {
    uploadedImages.value = []
    selectedFiles.value = []
  }
})
</script>

<style scoped>
.image-uploader {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.upload-container {
  position: relative;
  margin-bottom: 16px;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #8b2865;
  background: #f3e5f5;
}

.upload-text {
  margin: 12px 0 0 0;
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
}

/* Add More Button */
.add-more-container {
  position: relative;
  margin-bottom: 16px;
}

.add-more-area {
  border: 2px dashed #8b2865;
  border-radius: 8px;
  padding: 16px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(139, 40, 101, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-more-area:hover {
  border-color: #6a1b9a;
  background: rgba(139, 40, 101, 0.1);
}

.add-more-text {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #8b2865;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* Uploaded Images Grid */
.uploaded-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.image-thumbnail {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.image-thumbnail:hover {
  border-color: #8b2865;
  transform: scale(1.02);
}

.showcase-image {
  border-color: #8b2865;
  border-width: 3px;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-thumbnail:hover .thumbnail-overlay {
  opacity: 1;
}

.remove-btn {
  width: 24px;
  height: 24px;
  min-width: 24px;
}

.showcase-label {
  position: absolute;
  bottom: 4px;
  left: 4px;
}

/* Upload Progress */
.upload-progress-container {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b2865, #9c27b0);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #64748b;
}

.progress-count {
  font-weight: 600;
  color: #8b2865;
}

.upload-info {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.upload-status {
  text-align: center;
  margin-bottom: 8px;
}

.status-text {
  font-size: 14px;
  color: #8b2865;
  font-weight: 600;
  margin: 0;
}

.upload-hint {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 960px) {
  .upload-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .uploaded-images-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }
}

@media (max-width: 600px) {
  .image-uploader {
    padding: 16px;
  }
  
  .upload-area {
    padding: 32px 16px;
  }
  
  .upload-text {
    font-size: 14px;
  }
  
  .uploaded-images-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 6px;
  }
  
  .add-more-area {
    padding: 12px 16px;
  }
  
  .add-more-text {
    font-size: 12px;
  }
}
</style> 