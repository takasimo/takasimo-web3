<template>
  <Teleport to="body">
    <v-dialog 
      v-model="isOpen" 
      max-width="500"
      persistent
      no-click-animation
      eager
      :z-index="9999"
    >
      <v-card class="password-modal-card">
        <v-card-title>
          <span class="text-h5">Mevcut Parola</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.current_password"
                  label="Lütfen mevcut parolanızı giriniz."
                  :type="showCurrentPassword ? 'text' : 'password'"
                  variant="outlined"
                  :rules="currentPasswordRules"
                  required
                  :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showCurrentPassword = !showCurrentPassword"
                />
              </v-col>
            </v-row>
            
            <div class="mt-4">
              <h3 class="text-h6 mb-3">Parola</h3>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.new_password"
                    label="••••••"
                    :type="showNewPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="newPasswordRules"
                    required
                    :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showNewPassword = !showNewPassword"
                  />
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.new_password_confirmation"
                    label="Yeni parola tekrar"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="confirmPasswordRules"
                    required
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  />
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeModal">
            İptal
          </v-btn>
          <v-btn 
            color="primary" 
            :loading="loading"
            :disabled="!isFormValid || loading"
            @click="updatePassword"
            class="update-password-btn"
          >
            Güncelle
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
/* Password modal specific styling */
.password-modal-card {
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

/* Modal override for consistent styling */
:deep(.v-dialog .v-card) {
  border-radius: 12px !important;
  position: relative !important;
  z-index: 10000 !important;
}

:deep(.v-dialog .v-card-title) {
  padding: 1.5rem 1.5rem 1rem 1.5rem !important;
  font-weight: 600 !important;
}

:deep(.v-dialog .v-card-text) {
  padding: 0 1.5rem 1rem 1.5rem !important;
}

:deep(.v-dialog .v-card-actions) {
  padding: 1rem 1.5rem 1.5rem 1.5rem !important;
}

/* Text field styling in modals */
:deep(.v-dialog .v-text-field) {
  margin-bottom: 1rem;
}

:deep(.v-dialog .v-text-field .v-field) {
  border-radius: 8px !important;
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

:deep(.v-dialog .v-text-field .v-field__append-inner) {
  pointer-events: auto !important;
  z-index: 10003 !important;
}

/* Button styling */
.update-password-btn {
  background: linear-gradient(45deg, #9c27b0, #673ab7) !important;
  color: white !important;
  text-transform: none;
  font-weight: 500;
}

.update-password-btn:hover {
  box-shadow: 0 4px 8px rgba(156, 39, 176, 0.4) !important;
}
</style>
