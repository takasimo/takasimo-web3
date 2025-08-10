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
  initialProvinceId?: number | null
  initialDistrictId?: number | null
  initialLocalityId?: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationSelection]
  'change': [value: LocationSelection]
  'update:province-id': [value: number | null]
  'update:district-id': [value: number | null]
  'update:locality-id': [value: number | null]
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
    emit('update:province-id', selectedCity.value.id)
  } else {
    districts.value = []
    localizations.value = []
    selectedDistrict.value = null
    selectedLocalization.value = null
    emit('update:province-id', null)
    emit('update:district-id', null)
    emit('update:locality-id', null)
  }
  emitChange()
}

const onDistrictChange = async () => {
  if (selectedDistrict.value) {
    await loadData(() => getLocalizations(selectedDistrict.value!.id), localizations, 'localizations')
    emit('update:district-id', selectedDistrict.value.id)
  } else {
    localizations.value = []
    selectedLocalization.value = null
    emit('update:district-id', null)
    emit('update:locality-id', null)
  }
  emitChange()
}

const onLocalizationChange = () => {
  if (selectedLocalization.value) {
    emit('update:locality-id', selectedLocalization.value.id)
  } else {
    emit('update:locality-id', null)
  }
  emitChange()
}

// Initialize
onMounted(async () => {
  // Load cities first
  if (cities.value.length === 0) {
    await loadData(getCities, cities, 'cities')
  }
  
  // Set initial values if provided
  if (props.initialProvinceId && cities.value.length > 0) {
    const initialCity = cities.value.find(city => city.id === props.initialProvinceId)
    if (initialCity) {
      selectedCity.value = initialCity
      
      // Load districts for this city
      await loadData(() => getDistricts(initialCity.id), districts, 'districts')
      
      // Set initial district if provided
      if (props.initialDistrictId && districts.value.length > 0) {
        const initialDistrict = districts.value.find(district => district.id === props.initialDistrictId)
        if (initialDistrict) {
          selectedDistrict.value = initialDistrict
          
          // Load localizations for this district
          await loadData(() => getLocalizations(initialDistrict.id), localizations, 'localizations')
          
          // Set initial locality if provided
          if (props.initialLocalityId && localizations.value.length > 0) {
            const initialLocality = localizations.value.find(locality => locality.id === props.initialLocalityId)
            if (initialLocality) {
              selectedLocalization.value = initialLocality
            }
          }
        }
      }
    }
  }
})
</script>

<style scoped>
.location-selection {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Vuetify select alanları için özel spacing */
:deep(.v-select .v-field) {
  border-radius: 12px !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
}

:deep(.v-select .v-field:hover) {
  border-color: #d1d5db !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

:deep(.v-select .v-field--focused) {
  border-color: #8B2865 !important;
  box-shadow: 0 0 0 3px rgba(139, 40, 101, 0.1) !important;
  transform: translateY(-1px);
}

:deep(.v-select .v-field__input) {
  padding: 0.75rem 1rem !important;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
}

:deep(.v-select .v-field__append-inner) {
  padding-right: 0.75rem !important;
}
</style> 