<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  
  <!-- Toast Notifications -->
  <Toast />
</template>

<script setup lang="ts">
import Toast from '~/components/Toast.vue'
</script>
