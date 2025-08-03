

<template>
<div class="product-create-page">

</div>
</template>

<script setup lang="ts">
import { useCategoriesApi } from '~/composables/api'

const route = useRoute()

const categoryCode = computed(() => route.params?.id || '')

const formData = ref<any>({
  category_code: categoryCode.value,
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

const { getSubCategoriesById } = useCategoriesApi()

onMounted(()=>{
  initializeData()
})


const initializeData = async () => {
  try {
    // Load subcategories
    const subCategoriesResponse = await getSubCategoriesById('eff195001c3925202d4c09d59cc458ae')
    console.log("subCategoriesResponse",subCategoriesResponse)
  } catch (error) {
    console.error('Initialization error:', error)
  }
}

</script>

<style scoped>

</style>