<template>
  <div class="date-sorting">
    <label class="sort-label">Sıralama</label>
    <v-select
      :model-value="modelValue"
      @update:model-value="updateSort"
      :items="[
        { title: 'Tarih (Yeni)', value: 'DATE_DESC' },
        { title: 'Tarih (Eski)', value: 'DATE_ASC' },
        { title: 'Fiyat (Yüksek)', value: 'PRICE_DESC' },
        { title: 'Fiyat (Düşük)', value: 'PRICE_ASC' }
      ]"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="compact"
      hide-details
      class="sort-select"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const updateSort = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.date-sorting {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.sort-select {
  min-width: 140px;
}

.sort-select :deep(.v-field) {
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.sort-select :deep(.v-field:hover) {
  border-color: #8b2865;
  background: white;
}

.sort-select :deep(.v-field--focused) {
  border-color: #8b2865;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 40, 101, 0.1);
}
</style>
