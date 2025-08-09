<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="520" 
    persistent
    class="name-update-dialog"
  >
    <v-card class="name-modal-card">
      <!-- Header with gradient background -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            <v-icon size="28" color="white">mdi-account-edit</v-icon>
          </div>
          <div class="header-text">
            <h2>İsim Güncelle</h2>
            <p>Profil bilgilerinizi güncelleyin</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <v-card-text class="modal-content">
        <div class="form-section">
          <div class="input-group">
            <label class="input-label">Ad Soyad</label>
            <v-text-field
              v-model="formData.name"
              placeholder="Adınızı ve soyadınızı giriniz"
              variant="outlined"
              :rules="nameRules"
              required
              class="custom-input"
              prepend-inner-icon="mdi-account"
            />
          </div>
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
          @click="updateName"
          class="update-btn"
        >
          <v-icon left size="18">mdi-check</v-icon>
          Tamam
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  currentName?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update', name: string): void
}

const props = withDefaults(defineProps<Props>(), {
  currentName: '',
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
  name: ''
})

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Ad soyad gereklidir',
  (v: string) => v?.length >= 2 || 'Ad soyad en az 2 karakter olmalıdır'
]

// Form validation
const isFormValid = computed(() => {
  const name = formData.value.name?.trim()
  return name && name.length >= 2
})

// Watch for modal opening to initialize form
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.value.name = props.currentName || ''
  }
})

// Functions
const closeModal = () => {
  emit('update:modelValue', false)
  formData.value.name = ''
}

const updateName = async () => {
  if (!isFormValid.value) return
  
  emit('update', formData.value.name.trim())
}
</script>

<style scoped>
.name-modal-card {
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
}

/* Header with gradient */
.modal-header {
  background: linear-gradient(135deg, #8B5A9B 0%, #6B4C7A 100%);
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
  background: linear-gradient(135deg, rgba(139, 90, 155, 0.9) 0%, rgba(107, 76, 122, 0.9) 100%);
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
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

/* Content */
.modal-content {
  padding: 2rem !important;
  background: #fafafa;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.input-group {
  margin-bottom: 0;
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
  border-color: #8B5A9B !important;
  box-shadow: 0 0 0 3px rgba(139, 90, 155, 0.1) !important;
  transform: translateY(-1px);
}

:deep(.custom-input .v-field__input) {
  padding: 1rem 1rem 1rem 3rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
}

:deep(.custom-input .v-field__prepend-inner) {
  padding-left: 1rem !important;
  color: #9ca3af !important;
}

:deep(.custom-input .v-field--focused .v-field__prepend-inner) {
  color: #8B5A9B !important;
}

/* Actions */
.modal-actions {
  padding: 1.5rem 2rem 2rem 2rem !important;
  background: #fafafa;
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

.update-btn {
  border-radius: 12px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  background: linear-gradient(135deg, #8B5A9B 0%, #6B4C7A 100%) !important;
  border: none !important;
  color: white !important;
  transition: all 0.3s ease !important;
  min-width: 120px;
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 90, 155, 0.4) !important;
}

.update-btn:disabled {
  opacity: 0.6 !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Dialog Animation */
:deep(.name-update-dialog .v-overlay__content) {
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
  .update-btn {
    width: 100%;
  }
}
</style>
