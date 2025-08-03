

<template>
<div class="product-create-page">

</div>
</template>

<script setup lang="ts">
import { useCategoriesApi, useProductsApi } from '~/composables/api'

const route = useRoute()

const categoryCode = computed(() => route.params?.id as string || '')
const { getProductById } = useProductsApi()

const formData = ref<any>({
  category_code: '',
  name: null,
  price: '',
  quantity: 1,
  swap: true,
  description: null,
  currency: 'TRY',
  showcase_image: null,
  accepted_communication_types: [],
  city: null,
  district: null,
  localities: null,
  full_address: null,
  lat: 1,
  lng: 1,
  accepted_payment_types: ['PAYMENT_BY_HAND'],
  condition:'new'
})



const initializeData = async () => {
  try {
    const categoryId = route.params?.id as string
    console.log('📝 Product create - Category ID:', categoryId)
    
    if (categoryId) {
      formData.value.category_code = categoryId
      
      const subCategoriesResponse = await getProductById(categoryId) as any
      console.log("📂 SubCategories Response:", subCategoriesResponse)
      
      if (subCategoriesResponse && subCategoriesResponse.data) {
        console.log("✅ Kategori verileri başarıyla yüklendi:", subCategoriesResponse.data)
      } else {
        console.log("⚠️ Kategori verisi bulunamadı")
      }
    } else {
      console.log("⚠️ URL'de kategori ID bulunamadı")
    }
  } catch (error) {
    console.error('❌ Initialization error:', error)
  }
}

onMounted(()=>{
  initializeData()
})

// Route değişikliklerini dinle
watch(() => route.params.id, (newCategoryId) => {
  if (newCategoryId) {
    console.log('🔄 Route değişti, yeni kategori ID:', newCategoryId)
    initializeData()
  }
}, { immediate: true })

</script>

<style scoped>

</style>