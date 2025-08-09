<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5">İsim Güncelle</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Ad Soyad"
                variant="outlined"
                :rules="nameRules"
                required
              />
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
          :disabled="!isFormValid || loading"
          @click="updateName"
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
</style>
