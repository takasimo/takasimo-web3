<script setup lang="ts">
const route = useRoute()

const categoryCode = computed(() => route.params?.code || '')

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
</script>

<template>
<div class="product-create-page">

</div>
</template>

<style scoped>

</style>