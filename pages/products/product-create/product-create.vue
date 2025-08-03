

<template>
  <div class="product-create-page">
    <!-- Header -->
    <div class="page-header">
      <v-container class="py-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-btn 
              icon 
              variant="text" 
              class="mr-4"
              @click="navigateTo('/products/product-create/product-create-main-categories')"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div>
              <h1 class="text-h4 font-weight-bold text-primary mb-1">İlan Oluştur</h1>
              <p class="text-body-2 text-grey-darken-1 mb-0">Ürününüzü satışa çıkarın</p>
            </div>
          </div>
          <div class="d-flex align-center gap-2">
            <v-btn icon variant="text">
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text">
              <v-icon>mdi-cart-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text">
              <v-icon>mdi-chat-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Breadcrumbs -->
    <div v-if="currentCategory" class="breadcrumb-section">
      <v-container class="py-2">
        <v-breadcrumbs :items="breadcrumbItems" class="px-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="py-6">
      <v-row>
        <v-col cols="12" lg="8" md="10" class="mx-auto">
          <!-- Image Upload Section -->
          <ImageUploader
            v-model="formData.showcase_image"
            :max-images="10"
            :max-file-size="15 * 1024 * 1024"
            @upload-complete="onUploadComplete"
            @upload-error="onUploadError"
            class="mb-8"
          />

          <!-- Form -->
          <v-form ref="form" class="product-form">
            <!-- İlan Başlığı -->
            <div class="form-row">
              <label class="form-label">İlan Başlığı</label>
              <v-text-field
                v-model="formData.name"
                placeholder="Başlık giriniz"
                variant="outlined"
                density="compact"
                hide-details
              />
            </div>

            <!-- Fiyat -->
            <div class="form-row">
              <label class="form-label">Fiyat</label>
              <div class="price-input-container">
                <v-text-field
                  v-model="formData.price"
                  placeholder="Fiyat Giriniz"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-currency-try"
                />
                <v-icon class="info-icon" color="grey">mdi-information</v-icon>
              </div>
            </div>

            <!-- Açıklama -->
            <div class="form-row">
              <label class="form-label">Açıklama</label>
              <v-textarea
                v-model="formData.description"
                placeholder="Açıklama giriniz"
                variant="outlined"
                rows="4"
                hide-details
              />
            </div>

            <!-- Takas Teklifi -->
            <div class="form-row">
              <label class="form-label">Takas Teklifi</label>
              <v-switch
                v-model="formData.swap"
                color="primary"
                hide-details
              />
            </div>

            <!-- Durumu -->
            <div class="form-row">
              <label class="form-label">Durumu</label>
              <v-select
                v-model="formData.condition"
                :items="conditionOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </div>

            <!-- İletişim Seçenekleri -->
            <div class="form-row">
              <label class="form-label">İletişim Seçenekleri</label>
              <v-select
                v-model="formData.accepted_communication_types"
                :items="communicationOptions"
                variant="outlined"
                density="compact"
                hide-details
                multiple
              />
            </div>

            <!-- Ödeme Yöntemi -->
            <div class="form-row">
              <label class="form-label">Ödeme Yöntemi</label>
              <v-select
                v-model="formData.accepted_payment_types"
                :items="paymentOptions"
                variant="outlined"
                density="compact"
                hide-details
                multiple
              />
            </div>

            <!-- Miktar -->
            <div class="form-row">
              <label class="form-label">Miktar</label>
              <v-text-field
                v-model="formData.quantity"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
                min="1"
              />
            </div>

            <!-- İl -->
            <div class="form-row">
              <label class="form-label">İl</label>
              <v-select
                v-model="formData.city"
                :items="cityOptions"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="onCityChange"
              />
            </div>

            <!-- İlçe -->
            <div class="form-row">
              <label class="form-label">İlçe</label>
              <v-select
                v-model="formData.district"
                :items="districtOptions"
                variant="outlined"
                density="compact"
                hide-details
                :disabled="!formData.city"
                @update:model-value="onDistrictChange"
              />
            </div>

            <!-- Mahalle -->
            <div class="form-row">
              <label class="form-label">Mahalle</label>
              <v-select
                v-model="formData.localities"
                :items="localityOptions"
                variant="outlined"
                density="compact"
                hide-details
                :disabled="!formData.district"
              />
            </div>

            <!-- Adres Detayı -->
            <div class="form-row">
              <label class="form-label">
                Adres Detayı
                <span class="required-text">(Bu alan iade işlemleri için gereklidir)*</span>
              </label>
              <v-textarea
                v-model="formData.full_address"
                placeholder="Adres detayını giriniz"
                variant="outlined"
                rows="3"
                hide-details
              />
            </div>
          </v-form>

          <!-- Footer -->
          <div class="form-footer">
            <div class="terms-section">
              <v-checkbox
                v-model="acceptTerms"
                label="İlan verme kurallarını kabul ediyorum"
                color="primary"
                hide-details
              />
              <div class="privacy-link">
                <a href="#" class="text-decoration-none">Kişisel Verilerin İşlenmesine dair Aydınlatma Metni</a>
              </div>
            </div>
            
            <v-btn
              color="primary"
              size="large"
              block
              :disabled="!acceptTerms"
              @click="submitForm"
              class="submit-btn"
            >
              İlan Oluştur
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Toast Messages -->
    <v-snackbar v-model="showToast" :color="toastColor" :timeout="3000" location="top">
      {{ toastMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showToast = false">Kapat</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesApi, useProductsApi } from '~/composables/api'

const route = useRoute()

const categoryCode = computed(() => route.params?.id as string || '')
const { getProductById } = useProductsApi()

const formData = ref<any>({
  category_code: '',
  name: null,
  price: '',
  quantity: 1,
  swap: true,
  description: null,
  currency: 'TRY',
  showcase_image: [],
  accepted_communication_types: [],
  city: null,
  district: null,
  localities: null,
  full_address: null,
  lat: 1,
  lng: 1,
  accepted_payment_types: ['PAYMENT_BY_HAND'],
  condition:'new'
})

// Form refs
const form = ref()
const acceptTerms = ref(false)

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('info')

// Current category for breadcrumbs
const currentCategory = ref<any>(null)

// Options for form fields
const conditionOptions = [
  { title: 'Sıfır Ürün', value: 'new' },
  { title: 'İkinci El', value: 'second_hand' },
]

const communicationOptions = [
  { title: 'Mesaj', value: 'MESSAGE' },
  { title: 'Telefon', value: 'PHONE' },
  { title: 'İleişim ercihlerimi belimek istemiyorum', value: 'None' }
]

const paymentOptions = [
  { title: 'Banka / Kredi Kartı', value: 'BANK_CARD' },
  { title: 'Elden Ödeme', value: 'CASH' },
  { title: 'Havale / EFT', value: 'BANK_TRANSFER' }
]

const cityOptions = [
  { title: 'İstanbul', value: 'istanbul' },
  { title: 'Ankara', value: 'ankara' },
  { title: 'İzmir', value: 'izmir' },
  { title: 'Bitlis', value: 'bitlis' }
]

const districtOptions = ref([
  { title: 'Merkez', value: 'merkez' },
  { title: 'Kadıköy', value: 'kadikoy' },
  { title: 'Beşiktaş', value: 'besiktas' }
])

const localityOptions = ref([
  { title: 'Beş Minare Mah.', value: 'bes_minare' },
  { title: 'Fatih Mah.', value: 'fatih' },
  { title: 'Yeni Mah.', value: 'yeni' }
])

// Computed breadcrumb items
const breadcrumbItems = computed(() => {
  if (!currentCategory.value) return []
  
  return [
    { title: currentCategory.value.name, disabled: false },
    { title: 'Ürün Oluştur', disabled: true }
  ]
})

const initializeData = async () => {
  try {
    const categoryId = route.params?.id as string
    console.log('📝 Product create - Category ID:', categoryId)
    
    if (categoryId) {
      formData.value.category_code = categoryId
      
      const subCategoriesResponse = await getProductById(categoryId) as any
      console.log("📂 SubCategories Response:", subCategoriesResponse)
      
      if (subCategoriesResponse && subCategoriesResponse.data) {
        console.log("✅ Kategori verileri başarıyla yüklendi:", subCategoriesResponse.data)
        currentCategory.value = subCategoriesResponse.data
      } else {
        console.log("⚠️ Kategori verisi bulunamadı")
      }
    } else {
      console.log("⚠️ URL'de kategori ID bulunamadı")
    }
  } catch (error) {
    console.error('❌ Initialization error:', error)
  }
}

// Image upload event handlers
const onUploadComplete = (images: string[]) => {
  console.log('📸 Upload completed:', images)
  showToastMessage(`${images.length} görsel başarıyla yüklendi`, 'success')
}

const onUploadError = (error: string) => {
  console.error('❌ Upload error:', error)
  showToastMessage(error, 'error')
}

// Form submission
const submitForm = async () => {
  try {
    if (!acceptTerms.value) {
      showToastMessage('Lütfen ilan verme kurallarını kabul edin', 'error')
      return
    }

    console.log('📝 Form data:', formData.value)
    showToastMessage('İlan oluşturuluyor...', 'info')
    
    // API call would go here
    // await createProduct(formData.value)
    
    setTimeout(() => {
      showToastMessage('İlan başarıyla oluşturuldu!', 'success')
      navigateTo('/account')
    }, 2000)
    
  } catch (error) {
    console.error('❌ Form submission error:', error)
    showToastMessage('İlan oluşturulurken bir hata oluştu', 'error')
  }
}

// Location change handlers
const onCityChange = () => {
  formData.value.district = null
  formData.value.localities = null
  // Load districts for selected city
}

const onDistrictChange = () => {
  formData.value.localities = null
  // Load localities for selected district
}

const showToastMessage = (message: string, color = 'info') => {
  toastMessage.value = message
  toastColor.value = color
  showToast.value = true
}

onMounted(()=>{
  initializeData()
})

// Route değişikliklerini dinle
watch(() => route.params.id, (newCategoryId) => {
  if (newCategoryId) {
    console.log('🔄 Route değişti, yeni kategori ID:', newCategoryId)
    initializeData()
  }
}, { immediate: true })
</script>

<style scoped>
.product-create-page {
  background: #f8fafc;
  min-height: 100vh;
}

/* Header */
.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Breadcrumbs */
.breadcrumb-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

/* Form styles remain the same */

/* Form */
.product-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  margin-bottom: 24px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.form-label {
  min-width: 140px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.required-text {
  font-size: 12px;
  color: #ef4444;
  font-weight: normal;
}

.price-input-container {
  position: relative;
  flex: 1;
}

.info-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

/* Footer */
.form-footer {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.terms-section {
  margin-bottom: 24px;
}

.privacy-link {
  margin-top: 8px;
  text-align: center;
}

.privacy-link a {
  color: #8b2865;
  font-size: 14px;
}

.submit-btn {
  height: 48px;
  font-weight: 600;
  font-size: 16px;
  text-transform: none;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .form-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .form-label {
    min-width: auto;
    margin-bottom: 4px;
  }
}

@media (max-width: 600px) {
  .product-form,
  .form-footer {
    padding: 16px;
  }
}
</style>