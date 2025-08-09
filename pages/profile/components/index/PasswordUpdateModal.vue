<template>
  <Teleport to="body">
    <v-dialog 
      v-model="isOpen" 
      max-width="580"
      persistent
      no-click-animation
      eager
      :z-index="9999"
      class="password-update-dialog"
    >
      <v-card class="password-modal-card">
        <!-- Header with gradient background -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon size="28" color="white">mdi-shield-lock</v-icon>
            </div>
            <div class="header-text">
              <h2>Şifre Güncelle</h2>
              <p>Hesabınızın güvenliği için güçlü bir şifre seçin</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <v-card-text class="modal-content">
          <div class="form-section">
            <!-- Current Password -->
            <div class="input-group">
              <label class="input-label">Mevcut Şifre</label>
              <v-text-field
                v-model="formData.current_password"
                placeholder="Mevcut şifrenizi giriniz"
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="currentPasswordRules"
                required
                class="custom-input"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
              />
            </div>

            <!-- Divider -->
            <div class="section-divider">
              <div class="divider-line"></div>
              <span class="divider-text">Yeni Şifre</span>
              <div class="divider-line"></div>
            </div>

            <!-- New Password -->
            <div class="input-group">
              <label class="input-label">Yeni Şifre</label>
              <v-text-field
                v-model="formData.new_password"
                placeholder="Yeni şifrenizi giriniz"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="newPasswordRules"
                required
                class="custom-input"
                prepend-inner-icon="mdi-lock-plus"
                :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showNewPassword = !showNewPassword"
              />
            </div>

            <!-- Confirm Password -->
            <div class="input-group">
              <label class="input-label">Yeni Şifre Tekrar</label>
              <v-text-field
                v-model="formData.new_password_confirmation"
                placeholder="Yeni şifrenizi tekrar giriniz"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="confirmPasswordRules"
                required
                class="custom-input"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
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
            color="primary"
            size="large"
            :loading="loading"
            :disabled="!isFormValid || loading"
            @click="updatePassword"
            class="update-btn"
          >
            <v-icon left size="18">mdi-shield-check</v-icon>
            Şifreyi Güncelle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update', passwordData: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// Computed for v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const formData = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

// Validation rules
const currentPasswordRules = [
  (v: string) => !!v || 'Mevcut şifre gereklidir',
  (v: string) => v?.length >= 6 || 'Şifre en az 6 karakter olmalıdır'
]

const newPasswordRules = [
  (v: string) => !!v || 'Yeni şifre gereklidir',
  (v: string) => v?.length >= 6 || 'Şifre en az 6 karakter olmalıdır'
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Şifre tekrarı gereklidir',
  (v: string) => v === formData.value.new_password || 'Şifreler eşleşmiyor'
]

// Form validation
const isFormValid = computed(() => {
  const current = formData.value.current_password?.trim()
  const newPass = formData.value.new_password?.trim()
  const confirm = formData.value.new_password_confirmation?.trim()
  
  return current && 
         newPass && 
         confirm &&
         current.length >= 6 &&
         newPass.length >= 6 &&
         newPass === confirm
})

// Watch for modal opening to reset form
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // Reset form when opening
    formData.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
    
    // Reset visibility states
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
  }
})

// Functions
const closeModal = () => {
  emit('update:modelValue', false)
  formData.value = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }
}

const updatePassword = async () => {
  if (!isFormValid.value) return
  
  emit('update', {
    current_password: formData.value.current_password.trim(),
    new_password: formData.value.new_password.trim(),
    new_password_confirmation: formData.value.new_password_confirmation.trim()
  })
}
</script>

<style scoped>
.password-modal-card {
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

.password-modal-card * {
  pointer-events: auto !important;
}

/* Header with gradient */
.modal-header {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.9) 0%, rgba(192, 57, 43, 0.9) 100%);
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
  background: #fafafa;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group:last-child {
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

/* Section Divider */
.section-divider {
  display: flex;
  align-items: center;
  margin: 2rem 0 1.5rem 0;
  gap: 1rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
}

.divider-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: white;
  padding: 0 1rem;
}

/* Custom Input Styling */
:deep(.custom-input .v-field) {
  border-radius: 12px !important;
  border: 2px solid #e5e7eb !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
}

:deep(.custom-input .v-field:hover) {
  border-color: #d1d5db !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

:deep(.custom-input .v-field--focused) {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
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
  color: #e74c3c !important;
}

:deep(.custom-input .v-field__append-inner) {
  padding-right: 1rem !important;
  color: #9ca3af !important;
  cursor: pointer !important;
  pointer-events: auto !important;
  z-index: 10003 !important;
}

:deep(.custom-input .v-field--focused .v-field__append-inner) {
  color: #e74c3c !important;
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
  border: 2px solid #e5e7eb !important;
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
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
  border: none !important;
  color: white !important;
  transition: all 0.3s ease !important;
  min-width: 140px;
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(231, 76, 60, 0.4) !important;
}

.update-btn:disabled {
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
:deep(.password-update-dialog .v-overlay__content) {
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
  
  .form-section {
    padding: 1.5rem;
  }
  
  .modal-actions {
    padding: 1rem 1.5rem 1.5rem 1.5rem !important;
    flex-direction: column;
  }
  
  .cancel-btn,
  .update-btn {
    width: 100%;
  }
  
  .section-divider {
    margin: 1.5rem 0 1rem 0;
  }
}
</style>
