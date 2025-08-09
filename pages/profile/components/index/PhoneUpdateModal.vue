<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5">Cep Telefonu</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <!-- Telefon Numarası Girişi -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.phone"
                label="Telefon Numaranızı giriniz"
                variant="outlined"
                placeholder="5453632125"
                :rules="phoneRules"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <p class="text-body-2 text-grey-darken-1 mb-3">
                Yeni Telefon numaranıza gönderdiğimiz doğrulama kodunu aşağıdaki alana giriniz.
              </p>
            </v-col>
          </v-row>

          <!-- Doğrulama Kodu Gönder -->
          <v-row>
            <v-col cols="12">
              <v-btn 
                color="primary"
                variant="outlined"
                block
                size="large"
                :loading="loading"
                :disabled="!isPhoneFormValid || loading || verificationCodeSent"
                @click="sendVerificationCode"
                class="mb-4"
              >
                {{ verificationCodeSent ? 'Doğrulama Kodu Gönderildi' : 'Telefonuma Doğrulama Kodu Gönder' }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- Doğrulama Kodu Girişi -->
          <div class="verification-section">
            <h3 class="text-h6 mb-3">Doğrulama Kodu</h3>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.verification_code"
                  label="Doğrulama Kodunuzu Giriniz"
                  variant="outlined"
                  placeholder="123456"
                  :rules="verificationCodeRules"
                  maxlength="6"
                  required
                />
              </v-col>
            </v-row>
          </div>

          <!-- Buttons -->
          <v-row v-if="verificationCodeSent">
            <v-col cols="6">
              <v-btn 
                variant="outlined"
                block
                @click="sendVerificationCode"
                :disabled="!isPhoneFormValid || countdown > 0"
                class="text-primary"
              >
                Gönder
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn 
                variant="outlined"
                block
                @click="sendVerificationCode"
                :disabled="!isPhoneFormValid || countdown > 0"
                class="text-primary"
              >
                {{ countdown > 0 ? `Yeni Kod Al (${countdown}s)` : 'Yeni Kod Al' }}
              </v-btn>
            </v-col>
          </v-row>
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
          :disabled="!isVerificationFormValid || loading"
          @click="updatePhone"
        >
          Güncelle
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
/* Modal override for consistent styling */
:deep(.v-dialog .v-card) {
  border-radius: 12px !important;
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

:deep(.v-dialog .v-text-field) {
  margin-bottom: 1rem;
}

:deep(.v-dialog .v-text-field .v-field) {
  border-radius: 8px !important;
}

/* Phone modal specific styles */
.verification-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.verification-section h3 {
  color: #374151;
  font-weight: 600;
}
</style>
