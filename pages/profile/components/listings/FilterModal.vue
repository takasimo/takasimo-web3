<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" max-width="420" persistent>
    <v-card class="filter-modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            <v-icon color="white" size="28">mdi-filter</v-icon>
          </div>
          <div class="header-text">
            <h2>Filtreler</h2>
            <p>Ürünlerinizi filtrelemek için aşağıdaki seçenekleri kullanın</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <v-card-text class="modal-content">
        <!-- Fiyat Aralığı -->
        <div class="filter-section">
          <label class="input-label">Fiyat Aralığı</label>
          <div class="price-inputs">
            <div class="price-input-group">
              <v-text-field
                v-model="localPriceRange.min"
                placeholder="Min Fiyat"
                variant="outlined"
                prepend-inner-icon="mdi-currency-try"
                class="custom-input"
                hide-details
                type="number"
              />
            </div>
            <div class="price-separator">-</div>
            <div class="price-input-group">
              <v-text-field
                v-model="localPriceRange.max"
                placeholder="Max Fiyat"
                variant="outlined"
                prepend-inner-icon="mdi-currency-try"
                class="custom-input"
                hide-details
                type="number"
              />
            </div>
          </div>
        </div>

        <!-- Takas -->
        <div class="filter-section">
          <label class="input-label">Takas Durumu</label>
          <div class="radio-options">
            <div class="radio-option" @click="localSelectedSwap = 'all'">
              <v-radio value="all" :model-value="localSelectedSwap" />
              <span class="radio-label">Tümü</span>
            </div>
            <div class="radio-option" @click="localSelectedSwap = 'true'">
              <v-radio value="true" :model-value="localSelectedSwap" />
              <span class="radio-label">Takas Var</span>
            </div>
            <div class="radio-option" @click="localSelectedSwap = 'false'">
              <v-radio value="false" :model-value="localSelectedSwap" />
              <span class="radio-label">Sadece Satış</span>
            </div>
          </div>
        </div>

        <!-- İlan Durumu -->
        <div class="filter-section">
          <label class="input-label">İlan Durumu</label>
          <div class="radio-options">
            <div class="radio-option" @click="localSelectedStatus = 'all'">
              <v-radio value="all" :model-value="localSelectedStatus" />
              <span class="radio-label">Tümü</span>
            </div>
            <div class="radio-option" @click="localSelectedStatus = 'active'">
              <v-radio value="active" :model-value="localSelectedStatus" />
              <span class="radio-label">Aktif</span>
            </div>
            <div class="radio-option" @click="localSelectedStatus = 'pending'">
              <v-radio value="pending" :model-value="localSelectedStatus" />
              <span class="radio-label">Onay Bekliyor</span>
            </div>
            <div class="radio-option" @click="localSelectedStatus = 'expired'">
              <v-radio value="expired" :model-value="localSelectedStatus" />
              <span class="radio-label">Süresi Dolmuş</span>
            </div>
            <div class="radio-option" @click="localSelectedStatus = 'doping'">
              <v-radio value="doping" :model-value="localSelectedStatus" />
              <span class="radio-label">Doping</span>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="modal-actions">
        <v-btn 
          variant="outlined" 
          color="grey-darken-1"
          size="large"
          @click="clearFilters"
          class="cancel-btn"
        >
          <v-icon left size="18">mdi-refresh</v-icon>
          Temizle
        </v-btn>
        <v-btn 
          size="large"
          @click="applyFilters"
          class="apply-btn"
        >
          <v-icon left size="18">mdi-check</v-icon>
          Uygula
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  priceRange: { min: number | null; max: number | null }
  selectedSwap: string
  selectedStatus: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:priceRange': [value: { min: number | null; max: number | null }]
  'update:selectedSwap': [value: string]
  'update:selectedStatus': [value: string]
  apply: []
  clear: []
}>()

// Local state for form inputs
const localPriceRange = ref({ ...props.priceRange })
const localSelectedSwap = ref(props.selectedSwap)
const localSelectedStatus = ref(props.selectedStatus)

// Watch for prop changes
watch(() => props.priceRange, (newVal) => {
  localPriceRange.value = { ...newVal }
}, { deep: true })

watch(() => props.selectedSwap, (newVal) => {
  localSelectedSwap.value = newVal
})

watch(() => props.selectedStatus, (newVal) => {
  localSelectedStatus.value = newVal
})

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value)
}

const clearFilters = () => {
  localPriceRange.value = { min: null, max: null }
  localSelectedSwap.value = 'all'
  localSelectedStatus.value = 'all'
  emit('clear')
}

const applyFilters = () => {
  emit('update:priceRange', { ...localPriceRange.value })
  emit('update:selectedSwap', localSelectedSwap.value)
  emit('update:selectedStatus', localSelectedStatus.value)
  emit('apply')
  updateModelValue(false)
}
</script>

<style scoped>
.filter-modal-card {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15) !important;
  border: none !important;
}

.modal-header {
  background: linear-gradient(135deg, #8B2865 0%, #7C2456 100%);
  padding: 2rem;
  position: relative;
}

.modal-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(139, 40, 101, 0.95) 0%, rgba(124, 36, 86, 0.95) 100%);
  backdrop-filter: blur(15px);
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.header-text {
  flex: 1;
}

.header-text h2 {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.header-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.modal-content {
  padding: 2rem !important;
  background: #fafbfc;
}

.filter-section {
  margin-bottom: 2.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-section:last-child {
  margin-bottom: 0;
}

.input-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-input-group {
  flex: 1;
}

.price-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  color: #64748b;
}

:deep(.custom-input .v-field) {
  border-radius: 14px !important;
  border: 2px solid #e2e8f0 !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
  background: #f8fafc;
  overflow: hidden;
}

:deep(.custom-input .v-field:hover) {
  border-color: #cbd5e1 !important;
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

:deep(.custom-input .v-field--focused) {
  border-color: #8B2865 !important;
  background: white;
  box-shadow: 0 0 0 4px rgba(139, 40, 101, 0.1) !important;
  transform: translateY(-2px);
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

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #fafbfc;
}

.radio-option:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.radio-option:active {
  background: #f8fafc;
  transform: translateY(0);
}

.radio-option:deep(.v-radio) {
  margin-top: 2px;
}

.radio-label {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}

.modal-actions {
  padding: 1.5rem 2rem 2rem 2rem !important;
  gap: 1rem;
  display: flex;
  justify-content: space-between;
  background: white;
  border-top: 1px solid #f1f5f9;
}

.cancel-btn {
  border-radius: 14px !important;
  padding: 0.875rem 1.75rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  border: 2px solid #e2e8f0 !important;
  color: #64748b !important;
  background: white !important;
  transition: all 0.3s ease !important;
  min-width: 120px;
}

.cancel-btn:hover {
  border-color: #cbd5e1 !important;
  color: #475569 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
}

.apply-btn {
  border-radius: 14px !important;
  padding: 0.875rem 1.75rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: -0.025em !important;
  background: linear-gradient(135deg, #8B2865 0%, #7C2456 100%) !important;
  color: white !important;
  transition: all 0.3s ease !important;
  min-width: 120px;
  box-shadow: 0 4px 16px rgba(139, 40, 101, 0.3) !important;
}

.apply-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(139, 40, 101, 0.4) !important;
  background: linear-gradient(135deg, #7C2456 0%, #6B1F4A 100%) !important;
}
</style>
