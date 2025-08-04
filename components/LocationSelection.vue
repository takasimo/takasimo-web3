<template>
  <div class="location-selection">
    <!-- City Selection -->
    <div class="form-group">
      <label class="form-label">İl *</label>
      <v-select
        v-model="selectedCity"
        :items="cities"
        item-title="name"
        placeholder="İl seçiniz"
        variant="outlined"
        density="compact"
        :loading="loading.cities"
        :disabled="loading.cities"
        @update:model-value="onCityChange"
        hide-details
        required
        return-object
      />
    </div>

    <!-- District Selection -->
    <div class="form-group">
      <label class="form-label">İlçe *</label>
      <v-select
        v-model="selectedDistrict"
        :items="districts"
        item-title="name"
        placeholder="İlçe seçiniz"
        variant="outlined"
        density="compact"
        :loading="loading.districts"
        :disabled="!selectedCity || loading.districts"
        @update:model-value="onDistrictChange"
        hide-details
        required
        return-object
      />
    </div>

    <!-- Localization Selection -->
    <div class="form-group">
      <label class="form-label">Mahalle</label>
      <v-select
        v-model="selectedLocalization"
        :items="localizations"
        item-title="name"
        placeholder="Mahalle seçiniz (Opsiyonel)"
        variant="outlined"
        density="compact"
        :loading="loading.localizations"
        :disabled="!selectedDistrict || loading.localizations"
        @update:model-value="onLocalizationChange"
        hide-details
        return-object
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useLocationApi } from '~/composables/api/useLocationApi'
import type { City, District, Localization, LocationSelection } from '~/types'

// Props
interface Props {
  modelValue?: LocationSelection
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: LocationSelection]
  'change': [value: LocationSelection]
}>()

// API
const { getCities, getDistricts, getLocalizations } = useLocationApi()

// Reactive data
const cities = ref<City[]>([])
const districts = ref<District[]>([])
const localizations = ref<Localization[]>([])

const selectedCity = ref<City | null>(null)
const selectedDistrict = ref<District | null>(null)
const selectedLocalization = ref<Localization | null>(null)

const loading = ref({
  cities: false,
  districts: false,
  localizations: false
})

// Methods
const loadCities = async () => {
  try {
    loading.value.cities = true
    console.log('🔍 Loading cities...')
    const response = await getCities()
    console.log('🏙️ Cities API response:', response)
    cities.value = response.data || []
    console.log('📍 Cities loaded:', cities.value)
  } catch (error) {
    console.error('Error loading cities:', error)
  } finally {
    loading.value.cities = false
  }
}

const loadDistricts = async (cityId: number) => {
  try {
    loading.value.districts = true
    districts.value = []
    localizations.value = []
    selectedDistrict.value = null
    selectedLocalization.value = null
    
    console.log('🔍 Loading districts for city ID:', cityId)
    const response = await getDistricts(cityId)
    console.log('📂 Districts API response:', response)
    districts.value = response.data || []
    console.log('📍 Districts loaded:', districts.value)
  } catch (error) {
    console.error('Error loading districts:', error)
  } finally {
    loading.value.districts = false
  }
}

const loadLocalizations = async (districtId: number) => {
  try {
    loading.value.localizations = true
    localizations.value = []
    selectedLocalization.value = null
    
    const response = await getLocalizations(districtId)
    localizations.value = response.data || []
  } catch (error) {
    console.error('Error loading localizations:', error)
  } finally {
    loading.value.localizations = false
  }
}

const onCityChange = async () => {
  console.log('🏙️ City changed, selected:', selectedCity.value)
  if (selectedCity.value) {
    await loadDistricts(selectedCity.value.id)
  } else {
    districts.value = []
    localizations.value = []
    selectedDistrict.value = null
    selectedLocalization.value = null
  }
  emitLocationChange()
}

const onDistrictChange = async () => {
  console.log('🏘️ District changed, selected:', selectedDistrict.value)
  if (selectedDistrict.value) {
    await loadLocalizations(selectedDistrict.value.id)
  } else {
    localizations.value = []
    selectedLocalization.value = null
  }
  emitLocationChange()
}

const onLocalizationChange = () => {
  emitLocationChange()
}

const emitLocationChange = () => {
  const locationData: LocationSelection = {
    city: selectedCity.value || undefined,
    district: selectedDistrict.value || undefined,
    localization: selectedLocalization.value || undefined
  }
  
  emit('update:modelValue', locationData)
  emit('change', locationData)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedCity.value = newValue.city || null
    selectedDistrict.value = newValue.district || null
    selectedLocalization.value = newValue.localization || null
    
    // Load related data if needed
    if (newValue.city && !districts.value.length) {
      loadDistricts(newValue.city.id)
    }
    if (newValue.district && !localizations.value.length) {
      loadLocalizations(newValue.district.id)
    }
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadCities()
})
</script>

<style scoped>
.location-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}
</style> 