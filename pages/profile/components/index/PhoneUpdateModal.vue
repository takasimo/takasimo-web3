<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="420" 
    persistent
  >
    <v-card class="phone-modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            <v-icon color="white" size="28">mdi-phone</v-icon>
          </div>
          <div class="header-text">
            <h2>Telefon Güncelle</h2>
            <p>Telefon numaranızı güncellemek için aşağıdaki adımları takip edin</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <v-card-text class="modal-content">
        <!-- Phone Input -->
        <div class="input-section">
          <label class="input-label">Telefon Numarası</label>
          <v-text-field
            v-model="formData.phone"
            placeholder="5XX XXX XX XX"
            variant="outlined"
            prepend-inner-icon="mdi-phone"
            :disabled="verificationCodeSent"
            class="custom-input"
            hide-details
          />
        </div>

        <!-- Send Code Button -->
        <v-btn 
          variant="outlined"
          block
          size="large"
          :loading="sendCodeLoading"
          :disabled="!isPhoneValid || verificationCodeSent"
          @click="sendVerificationCode"
          class="send-code-btn"
        >
          <v-icon left size="18">mdi-message-text</v-icon>
          {{ verificationCodeSent ? 'Kod Gönderildi' : 'Doğrulama Kodu Gönder' }}
        </v-btn>

        <!-- Verification Section -->
        <div v-if="verificationCodeSent" class="verification-section">
          <div class="divider">
            <span>Doğrulama</span>
          </div>

          <label class="input-label">Doğrulama Kodu</label>
          <v-text-field
            v-model="verificationCode"
            placeholder="6 haneli kod"
            variant="outlined"
            prepend-inner-icon="mdi-shield-check"
            maxlength="6"
            class="custom-input"
            hide-details
          />

          <!-- Resend Button -->
          <div class="resend-section">
            <v-btn 
              variant="text"
              size="small"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
              class="resend-btn"
            >
              {{ countdown > 0 ? `Yeni kod (${countdown}s)` : 'Yeni kod al' }}
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="modal-actions">
        <v-btn 
          variant="text" 
          @click="closeModal"
          class="cancel-btn"
        >
          İptal
        </v-btn>
        <v-btn 
          :loading="updatePhoneLoading"
          :disabled="!isCodeValid"
          @click="updatePhone"
          class="update-btn"
        >
          Tamam
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useProfileApi } from '~/composables/api/useProfileApi'

interface Props {
  modelValue: boolean
  currentPhone?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success', message: string): void
  (e: 'error', message: string): void
}

const props = withDefaults(defineProps<Props>(), {
  currentPhone: ''
})

const emit = defineEmits<Emits>()

// API functions
const { phoneVerify, phoneVerifyCheck } = useProfileApi()

// Computed for v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Form data
const formData = ref({ phone: '' })
const verificationCode = ref('')

// States
const verificationCodeSent = ref(false)
const countdown = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)
const sendCodeLoading = ref(false)
const updatePhoneLoading = ref(false)

// Computed validation
const isPhoneValid = computed(() => {
  const phone = formData.value.phone?.replace(/\s/g, '')
  return phone && /^[0-9]{10}$/.test(phone)
})

const isCodeValid = computed(() => {
  return verificationCodeSent.value && /^[0-9]{6}$/.test(verificationCode.value)
})

// Watch for modal opening
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.value.phone = props.currentPhone || ''
    resetForm()
  }
})

// Functions
const resetForm = () => {
  verificationCode.value = ''
  verificationCodeSent.value = false
  countdown.value = 0
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
  resetForm()
  formData.value.phone = ''
}

const startCountdown = () => {
  countdown.value = 60
  countdownInterval.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval.value!)
      countdownInterval.value = null
    }
  }, 1000)
}

const sendVerificationCode = async () => {
  if (!isPhoneValid.value || sendCodeLoading.value) return
  
  sendCodeLoading.value = true
  
  try {
    const result = await phoneVerify({ phone: formData.value.phone })
    
    verificationCodeSent.value = true
    startCountdown()
    
    emit('success', result?.message || 'Doğrulama kodu gönderildi')
  } catch (error: any) {
    const errorMessage = error.data?.message || error.message || 'Doğrulama kodu gönderilemedi'
    emit('error', errorMessage)
  } finally {
    sendCodeLoading.value = false
  }
}

const updatePhone = async () => {
  if (!isCodeValid.value || updatePhoneLoading.value) return
  
  updatePhoneLoading.value = true
  
  try {
    const verifyResult = await phoneVerifyCheck({
      phone: formData.value.phone.replace(/\s/g, ''),
      code: verificationCode.value
    })
    
    if (verifyResult) {
      const message = verifyResult.message || 'Telefon numaranız başarıyla doğrulandı.'
      emit('success', message)
      emit('update:modelValue', false)
    } else {
      emit('error', 'Doğrulama kodu geçersiz. Lütfen tekrar deneyin.')
    }
  } catch (error: any) {
    const errorMessage = error.data?.message || error.message || 'Beklenmedik bir hata oluştu.'
    emit('error', errorMessage)
  } finally {
    updatePhoneLoading.value = false
  }
}

// Cleanup
onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
</script>

<style scoped>
.phone-modal-card {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
}

/* Header */
.modal-header {
  background: linear-gradient(135deg, #8B2865 0%, #7C2456 100%);
  padding: 2rem;
  position: relative;
}

.modal-header::before {
  content: '';
  position: absolute;
  inset: 0;
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
}

.header-text p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin: 0.25rem 0 0 0;
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

/* Custom Input */
:deep(.custom-input .v-field) {
  border-radius: 12px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: none !important;
  transition: all 0.2s ease !important;
  background: #f8fafc;
}

:deep(.custom-input .v-field:hover) {
  border-color: #cbd5e1 !important;
  background: white;
}

:deep(.custom-input .v-field--focused) {
  border-color: #8B2865 !important;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 40, 101, 0.1) !important;
}

:deep(.custom-input .v-field__input) {
  padding: 1rem 1rem 1rem 3rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #1e293b !important;
}

:deep(.custom-input .v-field__prepend-inner) {
  padding-left: 1rem !important;
  color: #94a3b8 !important;
}

:deep(.custom-input .v-field--focused .v-field__prepend-inner) {
  color: #8B2865 !important;
}

:deep(.custom-input .v-field--disabled) {
  opacity: 0.6 !important;
}

:deep(.custom-input .v-field--disabled .v-field__prepend-inner) {
  color: #94a3b8 !important;
}

/* Send Code Button */
.send-code-btn {
  border-radius: 12px !important;
  margin: 1rem 0 !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  border: 1px solid #e2e8f0 !important;
  color: #475569 !important;
  background: #f8fafc !important;
  transition: all 0.2s ease !important;
  height: 48px !important;
  box-shadow: none !important;
}

.send-code-btn:hover {
  border-color: #8B2865 !important;
  color: #8B2865 !important;
  background: white !important;
}

.send-code-btn:disabled {
  opacity: 0.5 !important;
  background: #f1f5f9 !important;
  color: #94a3b8 !important;
  border-color: #e2e8f0 !important;
}

/* Verification Section */
.verification-section {
  margin-top: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0 1rem 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  padding: 0 1rem;
}

.resend-section {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.resend-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  color: #8B2865 !important;
}

/* Actions */
.modal-actions {
  padding: 1rem 2rem 2rem 2rem !important;
  gap: 1rem;
  border-top: 1px solid #f1f5f9;
}

.cancel-btn {
  font-weight: 500 !important;
  text-transform: none !important;
  color: #64748b !important;
}

.update-btn {
  border-radius: 12px !important;
  padding: 0.75rem 2rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  background: #8B2865 !important;
  color: white !important;
  transition: all 0.2s ease !important;
}

.update-btn:hover {
  background: #7C2456 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 40, 101, 0.3) !important;
}

/* Mobile Responsive */
@media (max-width: 480px) {
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