<template>
  <Teleport to="body">
    <v-dialog 
      v-model="isOpen" 
      max-width="600"
      persistent
      no-click-animation
      eager
      :z-index="9999"
      class="address-modal-dialog"
    >
      <v-card class="address-modal-card">
        <!-- Header with gradient background -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon size="28" color="white">mdi-map-marker-plus</v-icon>
            </div>
            <div class="header-text">
              <h2>{{ isEditing ? 'Adres Düzenle' : 'Yeni Adres Ekle' }}</h2>
              <p>Adres bilgilerinizi giriniz</p>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <v-card-text class="modal-content">
          <div class="input-section">
            <label class="input-label">Adres Başlığı *</label>
            <v-text-field
              v-model="formData.title"
              placeholder="Ev, İş, Diğer"
              variant="outlined"
              required
              class="custom-input"
              prepend-inner-icon="mdi-tag"
              hide-details
            />
          </div>
          
          <div class="input-section">
            <label class="input-label">Ad Soyad *</label>
            <v-text-field
              v-model="formData.fullName"
              placeholder="Adınızı ve soyadınızı giriniz"
              variant="outlined"
              required
              class="custom-input"
              prepend-inner-icon="mdi-account"
              hide-details
            />
          </div>
          
          <div class="input-section">
            <label class="input-label">Telefon *</label>
            <v-text-field
              v-model="formData.phone"
              placeholder="Telefon numaranızı giriniz"
              variant="outlined"
              required
              class="custom-input"
              prepend-inner-icon="mdi-phone"
              hide-details
            />
          </div>
          
          <div class="input-section">
            <label class="input-label">Konum Bilgileri *</label>
            <LocationSelection 
              v-model="locationData"
              @change="onLocationChange"
            />
          </div>
          
          <div class="input-section">
            <label class="input-label">Adres Detayı *</label>
            <v-textarea
              v-model="formData.address"
              placeholder="Sokak, mahalle, bina no, daire no vb."
              variant="outlined"
              rows="3"
              required
              class="custom-textarea"
              prepend-inner-icon="mdi-map-marker"
              hide-details
            />
          </div>

          <div class="input-section">
            <v-checkbox
              v-model="formData.isDefault"
              label="Bu adresi varsayılan adres olarak ayarla"
              density="comfortable"
              class="custom-checkbox"
              hide-details
            />
          </div>
        </v-card-text>
        
        <!-- Actions -->
        <v-card-actions class="modal-actions">
          <v-btn 
            variant="outlined" 
            color="grey-darken-1"
            size="large"
            @click="closeModal"
            class="cancel-btn"
          >
            <v-icon left size="18">mdi-close</v-icon>
            İptal
          </v-btn>
          <v-btn 
            size="large"
            :loading="loading"
            :disabled="!isFormValid || loading"
            @click="saveAddress"
            class="save-btn"
          >
            <v-icon left size="18">mdi-check</v-icon>
            {{ isEditing ? 'Güncelle' : 'Kaydet' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Teleport>
</template>

<script setup lang="ts">
import type { LocationSelection } from '~/types'

interface Props {
  modelValue: boolean
  isEditing?: boolean
  addressData?: any
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  addressData: null,
  loading: false
})

const emit = defineEmits<Emits>()

// Computed for v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Form data
const formData = ref({
  title: '',
  fullName: '',
  phone: '',
  address: '',
  postalCode: '',
  isDefault: false
})

// Location data
const locationData = ref<LocationSelection>({})

// Computed
const isFormValid = computed(() => {
  return formData.value.title && 
         formData.value.fullName && 
         formData.value.phone &&
         formData.value.address &&
         locationData.value.city &&
         locationData.value.district
})

// Methods
const onLocationChange = (data: LocationSelection) => {
  locationData.value = data
}

const closeModal = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  formData.value = {
    title: '',
    fullName: '',
    phone: '',
    address: '',
    postalCode: '',
    isDefault: false
  }
  locationData.value = {}
}

const saveAddress = () => {
  if (!isFormValid.value) return

  const payload = {
    title: formData.value.title,
    full_name: formData.value.fullName,
    phone_number: formData.value.phone,
    city_code: locationData.value.city?.id,
    district_code: locationData.value.district?.id,
    locality_code: locationData.value.localization?.id,
    full_address: formData.value.address,
    postal_code: formData.value.postalCode,
    is_default: formData.value.isDefault
  }

  emit('save', payload)
}

// Watch for modal opening to populate form data
watch(() => props.modelValue, (newVal) => {
  if (newVal && props.addressData) {
    // Populate form with existing data for editing
    formData.value = {
      title: props.addressData.title || '',
      fullName: props.addressData.fullName || '',
      phone: props.addressData.phone || '',
      address: props.addressData.address || '',
      postalCode: props.addressData.postalCode || '',
      isDefault: props.addressData.isDefault || false
    }
    
    // Set location data for editing
    locationData.value = {
      city: { id: props.addressData.cityCode, name: props.addressData.city } as any,
      district: { id: props.addressData.districtCode, name: props.addressData.district } as any,
      localization: props.addressData.localityCode ? { id: props.addressData.localityCode, name: props.addressData.neighborhood } as any : undefined
    }
  } else if (newVal) {
    // Reset form for new address
    resetForm()
  }
})
</script>

<style scoped>
.address-modal-card {
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15) !important;
  border: none !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 10001 !important;
  opacity: 1 !important;
  transform: none !important;
  user-select: auto !important;
}

.address-modal-card * {
  pointer-events: auto !important;
}

/* Header with gradient */
.modal-header {
  background: linear-gradient(135deg, #8B2865 0%, #7C2456 100%);
  padding: 2rem 2rem 1.5rem 2rem;
  position: relative;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(139, 40, 101, 0.9) 0%, rgba(124, 36, 86, 0.9) 100%);
  backdrop-filter: blur(10px);
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-text h2 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

.header-text p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

/* Content */
.modal-content {
  padding: 2rem !important;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

/* Custom Input Styling */
:deep(.custom-input .v-field) {
  border-radius: 12px !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
}

:deep(.custom-input .v-field:hover) {
  border-color: #d1d5db !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

:deep(.custom-input .v-field--focused) {
  border-color: #8B2865 !important;
  box-shadow: 0 0 0 3px rgba(139, 40, 101, 0.1) !important;
  transform: translateY(-1px);
}

:deep(.custom-input .v-field__input) {
  padding: 1rem 3rem 1rem 3rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
}

:deep(.custom-input .v-field__prepend-inner) {
  padding-left: 1rem !important;
  color: #9ca3af !important;
}

:deep(.custom-input .v-field--focused .v-field__prepend-inner) {
  color: #8B2865 !important;
}

/* Custom Textarea Styling */
:deep(.custom-textarea .v-field) {
  border-radius: 12px !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
}

:deep(.custom-textarea .v-field:hover) {
  border-color: #d1d5db !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

:deep(.custom-textarea .v-field--focused) {
  border-color: #8B2865 !important;
  box-shadow: 0 0 0 3px rgba(139, 40, 101, 0.1) !important;
  transform: translateY(-1px);
}

:deep(.custom-textarea .v-field__input) {
  padding: 1rem 3rem 1rem 3rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
}

:deep(.custom-textarea .v-field__prepend-inner) {
  padding-left: 1rem !important;
  color: #9ca3af !important;
}

:deep(.custom-textarea .v-field--focused .v-field__prepend-inner) {
  color: #8B2865 !important;
}

/* Custom Checkbox Styling */
:deep(.custom-checkbox .v-selection-control) {
  margin-top: 0.5rem;
}

/* Actions */
.modal-actions {
  padding: 1.5rem 2rem 2rem 2rem !important;
  gap: 1rem;
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  border-radius: 12px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  border: 1px solid #e5e7eb !important;
  color: #6b7280 !important;
  background: white !important;
  transition: all 0.3s ease !important;
}

.cancel-btn:hover {
  border-color: #d1d5db !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.save-btn {
  border-radius: 12px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  background: linear-gradient(135deg, #8B2865 0%, #7C2456 100%) !important;
  border: none !important;
  color: white !important;
  transition: all 0.3s ease !important;
  min-width: 140px;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 40, 101, 0.4) !important;
}

.save-btn:disabled {
  opacity: 0.6 !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Overlay fix */
:deep(.v-overlay) {
  z-index: 9998 !important;
}

:deep(.v-overlay__content) {
  z-index: 9999 !important;
  pointer-events: auto !important;
}

/* Dialog container fix */
:deep(.v-dialog) {
  z-index: 10000 !important;
  pointer-events: auto !important;
}

/* Ensure all interactive elements work */
:deep(.v-dialog .v-btn) {
  pointer-events: auto !important;
  z-index: 10002 !important;
}

:deep(.v-dialog .v-text-field) {
  pointer-events: auto !important;
}

:deep(.v-dialog .v-text-field .v-field__input) {
  pointer-events: auto !important;
}

/* Dialog Animation */
:deep(.address-modal-dialog .v-overlay__content) {
  animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .modal-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .modal-content {
    padding: 1.5rem !important;
  }
  
  .modal-actions {
    padding: 1rem 1.5rem 1.5rem 1.5rem !important;
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
