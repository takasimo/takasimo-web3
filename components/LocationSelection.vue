<template>
  <div class="location-selection">
    <!-- City Selection -->
    <v-select
      v-model="selectedCity"
      :items="cities"
      item-title="name"
      label="İl *"
      placeholder="İl seçiniz"
      variant="outlined"
      density="compact"
      :loading="loading.cities"
      @update:model-value="onCityChange"
      hide-details
      required
      return-object
    />

    <!-- District Selection -->
    <v-select
      v-model="selectedDistrict"
      :items="districts"
      item-title="name"
      label="İlçe *"
      placeholder="İlçe seçiniz"
      variant="outlined"
      density="compact"
      :loading="loading.districts"
      :disabled="!selectedCity"
      @update:model-value="onDistrictChange"
      hide-details
      required
      return-object
    />

    <!-- Localization Selection -->
    <v-select
      v-model="selectedLocalization"
      :items="localizations"
      item-title="name"
      label="Mahalle"
      placeholder="Mahalle seçiniz (Opsiyonel)"
      variant="outlined"
      density="compact"
      :loading="loading.localizations"
      :disabled="!selectedDistrict"
      @update:model-value="onLocalizationChange"
      hide-details
      return-object
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocationApi } from '~/composables/api/useLocationApi'
import type { City, District, Localization, LocationSelection } from '~/types'

// Props & Emits
const props = defineProps<{
  modelValue?: LocationSelection
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationSelection]
  'change': [value: LocationSelection]
}>()

// API & State
const { getCities, getDistricts, getLocalizations } = useLocationApi()

const cities = ref<City[]>([])
const districts = ref<District[]>([])
const localizations = ref<Localization[]>([])

const selectedCity = ref<City | null>(null)
const selectedDistrict = ref<District | null>(null)
const selectedLocalization = ref<Localization | null>(null)

const loading = ref({ cities: false, districts: false, localizations: false })

// Methods
const loadData = async (apiCall: () => Promise<any>, dataRef: any, loadingKey: keyof typeof loading.value) => {
  try {
    loading.value[loadingKey] = true
    const response = await apiCall()
    dataRef.value = response.data || []
  } catch (error) {
    console.error(`Error loading ${loadingKey}:`, error)
  } finally {
    loading.value[loadingKey] = false
  }
}

const emitChange = () => {
  const data: LocationSelection = {
    city: selectedCity.value || undefined,
    district: selectedDistrict.value || undefined,
    localization: selectedLocalization.value || undefined
  }
  emit('update:modelValue', data)
  emit('change', data)
}

// Event Handlers
const onCityChange = async () => {
  if (selectedCity.value) {
    await loadData(() => getDistricts(selectedCity.value!.id), districts, 'districts')
  } else {
    districts.value = []
    localizations.value = []
    selectedDistrict.value = null
    selectedLocalization.value = null
  }
  emitChange()
}

const onDistrictChange = async () => {
  if (selectedDistrict.value) {
    await loadData(() => getLocalizations(selectedDistrict.value!.id), localizations, 'localizations')
  } else {
    localizations.value = []
    selectedLocalization.value = null
  }
  emitChange()
}

const onLocalizationChange = () => emitChange()

// Initialize
onMounted(async () => {
  if (cities.value.length === 0) {
    await loadData(getCities, cities, 'cities')
  }
})
</script>

<style scoped>
.location-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style> 