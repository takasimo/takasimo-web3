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
        <h2>Telefon Güncelle</h2>
        <p>Telefon numaranızı güncellemek için aşağıdaki adımları takip edin</p>
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
          :loading="loading"
          :disabled="!isPhoneFormValid || loading || verificationCodeSent"
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
              v-model="formData.verification_code"
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
          :loading="loading"
          :disabled="!isVerificationFormValid || loading"
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
interface Props {
  modelValue: boolean
  currentPhone?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'sendCode', phone: string): void
  (e: 'update', phoneData: {
    phone: string
    verification_code: string
  }): void
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
  phone: '',
  verification_code: ''
})

// Phone update states
const verificationCodeSent = ref(false)
const countdown = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

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
  const code = formData.value.verification_code?.trim()
  return code && /^[0-9]{6}$/.test(code)
})

// Watch for modal opening to initialize form
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.value = {
      phone: props.currentPhone || '',
      verification_code: ''
    }
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
    phone: '',
    verification_code: ''
  }
}

const sendVerificationCode = async () => {
  if (!isPhoneFormValid.value) return
  
  emit('sendCode', formData.value.phone)
  
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
}

const updatePhone = async () => {
  if (!isVerificationFormValid.value) return
  
  emit('update', {
    phone: formData.value.phone.replace(/\s/g, ''),
    verification_code: formData.value.verification_code
  })
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

/* Header - Clean and simple */
.modal-header {
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.modal-header p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
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
  border-color: #8B5A9B !important;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 90, 155, 0.1) !important;
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
  color: #8B5A9B !important;
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
  border-color: #8B5A9B !important;
  color: #8B5A9B !important;
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
  color: #8B5A9B !important;
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
  background: #8B5A9B !important;
  color: white !important;
  transition: all 0.2s ease !important;
  min-width: 100px;
}

.update-btn:hover {
  background: #6B4C7A !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 90, 155, 0.3) !important;
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
