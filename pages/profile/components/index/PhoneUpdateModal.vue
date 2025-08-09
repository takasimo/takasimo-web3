<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="420" 
    persistent
    class="phone-update-dialog"
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
        <!-- Phone Input Section -->
        <div class="input-section">
          <label class="input-label">Telefon Numarası</label>
          <v-text-field
            v-model="formData.phone"
            placeholder="5XX XXX XX XX"
            variant="outlined"
            :rules="phoneRules"
            required
            class="custom-input"
            prepend-inner-icon="mdi-phone"
          />
        </div>

        <!-- Send Code Button -->
        <v-btn 
          color="primary"
          variant="outlined"
          block
          size="large"
          :loading="sendCodeLoading"
          :disabled="!isPhoneFormValid || sendCodeLoading || verificationCodeSent"
          @click="sendVerificationCode"
          class="send-code-btn"
        >
          <v-icon left size="18">mdi-message-text</v-icon>
          {{ verificationCodeSent ? 'Kod Gönderildi' : 'Doğrulama Kodu Gönder' }}
        </v-btn>

        <!-- Verification Section -->
        <div v-if="verificationCodeSent" class="verification-section">
          <div class="section-divider">
            <div class="divider-line"></div>
            <span class="divider-text">Doğrulama</span>
            <div class="divider-line"></div>
          </div>

          <div class="input-section">
            <label class="input-label">Doğrulama Kodu</label>
            <v-text-field
              v-model="verificationCode"
              placeholder="6 haneli kod"
              variant="outlined"
              :rules="verificationCodeRules"
              maxlength="6"
              required
              class="custom-input"
              prepend-inner-icon="mdi-shield-check"
            />
          </div>

          <!-- Resend Options -->
          <div class="resend-options">
            <v-btn 
              variant="text"
              size="small"
              color="primary"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
              class="resend-btn"
            >
              <v-icon left size="16">mdi-refresh</v-icon>
              {{ countdown > 0 ? `Yeni kod (${countdown}s)` : 'Yeni kod al' }}
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="modal-actions">
        <v-btn 
          variant="text" 
          color="grey-darken-1"
          @click="closeModal"
          class="cancel-btn"
        >
          İptal
        </v-btn>
        <v-btn 
          :loading="updatePhoneLoading"
          :disabled="!isVerificationFormValid || updatePhoneLoading"
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
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success', message: string): void
  (e: 'error', message: string): void
}

const props = withDefaults(defineProps<Props>(), {
  currentPhone: '',
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
  phone: ''
})

const verificationCode = ref('')

// Phone update states
const verificationCodeSent = ref(false)
const countdown = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

// Loading states
const sendCodeLoading = ref(false)
const updatePhoneLoading = ref(false)

// API functions
const { phoneVerify, phoneVerifyCheck } = useProfileApi()

// Validation rules
const phoneRules = [
  (v: string) => !!v || 'Telefon numarası gereklidir',
  (v: string) => /^[0-9]{10}$/.test(v.replace(/\s/g, '')) || 'Geçerli bir telefon numarası giriniz (10 haneli)'
]

const verificationCodeRules = [
  (v: string) => !!v || 'Doğrulama kodu gereklidir',
  (v: string) => /^[0-9]{6}$/.test(v) || 'Doğrulama kodu 6 haneli olmalıdır'
]

// Form validation
const isPhoneFormValid = computed(() => {
  const phone = formData.value.phone?.replace(/\s/g, '')
  return phone && /^[0-9]{10}$/.test(phone)
})

const isVerificationFormValid = computed(() => {
  const code = verificationCode.value?.trim()
  return code && /^[0-9]{6}$/.test(code)
})

// Watch for modal opening to initialize form
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.value = {
      phone: props.currentPhone || ''
    }
    verificationCode.value = ''
    verificationCodeSent.value = false
    countdown.value = 0
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
  }
})

// Functions
const closeModal = () => {
  emit('update:modelValue', false)
  verificationCodeSent.value = false
  countdown.value = 0
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  formData.value = {
    phone: ''
  }
  verificationCode.value = ''
}

const sendVerificationCode = async () => {
  if (!isPhoneFormValid.value || sendCodeLoading.value) return
  
  sendCodeLoading.value = true
  
  try {
    console.log('Modal: Sending verification code to:', formData.value.phone)
    
    const result = await phoneVerify({ phone: formData.value.phone })
    console.log('Modal: phoneVerify result:', result)
    
    // API çağrısı başarılı olursa countdown başlat
    verificationCodeSent.value = true
    
    // Start countdown (60 seconds)
    countdown.value = 60
    countdownInterval.value = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval.value!)
        countdownInterval.value = null
      }
    }, 1000)
    
    console.log('Modal: Verification code sent successfully')
    
    // Başarı mesajı emit et
    if (result?.message) {
      emit('success', result.message)
    } else {
      emit('success', 'Doğrulama kodu gönderildi')
    }
    
  } catch (error: any) {
    console.error('Modal: Error sending verification code:', error)
    
    // Hata mesajını emit et
    let errorMessage = 'Doğrulama kodu gönderilemedi'
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    emit('error', errorMessage)
  } finally {
    sendCodeLoading.value = false
  }
}

const updatePhone = async () => {
  if (!isVerificationFormValid.value || updatePhoneLoading.value) return
  
  updatePhoneLoading.value = true
  
  try {
    console.log('Modal: Verifying phone with code')
    
    const verifyResult = await phoneVerifyCheck({
      phone: formData.value.phone.replace(/\s/g, ''),
      code: verificationCode.value
    })
    
    console.log('Modal: phoneVerifyCheck result:', verifyResult)
    
    if (verifyResult) {
      // API'den dönen mesajı kullan
      const message = verifyResult.message || 'Telefon numaranız başarıyla doğrulandı.'
      
      // Başarı emit et
      emit('success', message)
      
      // Modal'ı kapat
      emit('update:modelValue', false)
      
      console.log('Modal: Phone verification successful')
    } else {
      emit('error', 'Doğrulama kodu geçersiz. Lütfen tekrar deneyin.')
    }
    
  } catch (error: any) {
    console.error('Modal: Error verifying phone:', error)
    
    // Hata mesajını emit et
    let errorMessage = 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.'
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    emit('error', errorMessage)
  } finally {
    updatePhoneLoading.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
</script>

<style scoped>
.phone-modal-card {
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  background: white;
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
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

/* Content */
.modal-content {
  padding: 2rem !important;
  background: white;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-section:last-child {
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

/* Custom Input Styling - Matching the design */
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
}

/* Verification Section */
.verification-section {
  margin-top: 1.5rem;
}

/* Section Divider */
.section-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0 1rem 0;
  gap: 1rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: white;
  padding: 0 1rem;
}

/* Resend Options */
.resend-options {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.resend-btn {
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  font-weight: 500 !important;
  color: #8B2865 !important;
}

.resend-btn:disabled {
  color: #94a3b8 !important;
}

/* Actions - Matching design simplicity */
.modal-actions {
  padding: 1rem 2rem 2rem 2rem !important;
  background: white;
  gap: 1rem;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f1f5f9;
}

.cancel-btn {
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  color: #64748b !important;
  padding: 0.5rem 1rem !important;
}

.cancel-btn:hover {
  color: #475569 !important;
  background: #f8fafc !important;
}

.update-btn {
  border-radius: 12px !important;
  padding: 0.75rem 2rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  background: #8B2865 !important;
  color: white !important;
  transition: all 0.2s ease !important;
  min-width: 100px;
}

.update-btn:hover {
  background: #7C2456 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 40, 101, 0.3) !important;
}

.update-btn:disabled {
  opacity: 0.5 !important;
  transform: none !important;
  box-shadow: none !important;
  background: #94a3b8 !important;
}

/* Dialog Animation */
:deep(.phone-update-dialog .v-overlay__content) {
  animation: modalSlideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .modal-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .header-icon {
    align-self: center;
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
  
  .section-divider {
    margin: 1rem 0 0.75rem 0;
  }
}
</style>
