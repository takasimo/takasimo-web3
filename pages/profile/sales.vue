<template>
  <div class="sales-page">
    <div class="sales-header">
      <v-icon class="sales-icon">mdi-shopping-outline</v-icon>
      <h2>Satışlarım</h2>
    </div>
    
    <!-- Satış Listesi -->
    <div class="sales-list">
      <div v-for="sale in sales" :key="sale.id" class="sale-item">
        <!-- Satış Header -->
        <div class="sale-header">
          <v-chip 
            :color="getStatusColor(sale.status)" 
            size="small" 
            class="status-chip"
          >
            {{ sale.status }}
          </v-chip>
          <span class="sale-date">{{ formatDate(sale.date) }}</span>
          <v-btn 
            variant="text" 
            color="primary" 
            size="small" 
            class="details-btn"
            @click="viewSale(sale.id)"
          >
            Detaylar
            <v-icon right size="small">mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <!-- Alıcı Bilgileri -->
        <div class="buyer-info">
          <span class="buyer-label">Alıcı:</span>
          <span class="buyer-name">{{ sale.buyer.name }}</span>
        </div>

        <!-- Ürün Bilgileri -->
        <div class="product-info">
          <v-icon class="product-icon">mdi-information-outline</v-icon>
          <div class="product-details">
            <div class="product-meta">
              <span 
                class="delivery-status" 
                :class="getDeliveryStatusClass(sale.deliveryStatus)"
              >
                {{ sale.deliveryStatus }}
              </span>
              <span class="product-name">{{ sale.productName }}</span>
            </div>
            <div class="product-extra">
              <span class="product-quantity">{{ sale.quantity }}</span>
              <span class="product-count">({{ sale.itemCount }})</span>
            </div>
          </div>
        </div>

        <!-- Ürün Görselleri -->
        <div class="product-display">
          <div class="product-images">
            <img 
              v-for="(image, index) in sale.productImages" 
              :key="index"
              :src="image" 
              :alt="`Ürün ${index + 1}`"
              class="product-image"
            >
          </div>
          <div class="product-info-text">
            <div class="product-quantity-text">{{ sale.quantity }}</div>
            <div class="product-count-text">({{ sale.itemCount }})</div>
          </div>
        </div>

        <!-- Satış Footer -->
        <div class="sale-footer">
          <div class="sale-meta">
            <span class="sale-date-label">Satış Tarihi</span>
            <span class="sale-date-value">{{ formatDate(sale.date) }}</span>
          </div>
          <div class="sale-earnings">
            <div class="commission-info">
              <span class="commission-label">Komisyon</span>
              <span class="commission-amount">{{ formatPrice(sale.commission) }}</span>
            </div>
            <div class="net-info">
              <span class="net-label">Net Kazanç</span>
              <span class="net-amount">{{ formatPrice(sale.netEarnings) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Boş durum -->
      <div v-if="sales.length === 0" class="empty-state">
        <v-icon size="48" color="grey-lighten-2">mdi-shopping-outline</v-icon>
        <p>Henüz satışınız bulunmamaktadır.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section" v-if="sales.length > 0">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        color="primary"
        class="custom-pagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock satış verileri - resme uygun
const sales = ref([
  {
    id: '1',
    date: '2025-06-24',
    status: 'SATIŞ',
    buyer: {
      name: 'Enes Pazar'
    },
    deliveryStatus: 'İptal',
    productName: 'Surat Kargo',
    quantity: '1 ürün',
    itemCount: '1 adet',
    productImages: [
      '/assets/images/products/baby_car.svg'
    ],
    commission: 0.25,
    netEarnings: 4.75
  },
  {
    id: '2', 
    date: '2025-06-18',
    status: 'SATIŞ',
    buyer: {
      name: 'Enes Pazar'
    },
    deliveryStatus: 'Teslim Alınacak',
    productName: 'Surat Kargo',
    quantity: '4 ürün',
    itemCount: '10 adet',
    productImages: [
      '/assets/images/products/baby_car.svg',
      '/assets/images/products/baby_car.svg',
      '/assets/images/products/baby_car.svg',
      '/assets/images/products/baby_car.svg'
    ],
    commission: 25.00,
    netEarnings: 475.00
  }
])

// Pagination
const currentPage = ref(1)
const totalPages = ref(14)

// Durum rengi
const getStatusColor = (status: string) => {
  switch (status) {
    case 'SATIŞ': return 'purple'
    case 'HAZIRDA': return 'orange'
    case 'KARGODA': return 'blue'
    case 'TESLİM': return 'green'
    default: return 'purple'
  }
}

// Teslimat durum sınıfı
const getDeliveryStatusClass = (status: string) => {
  if (status === 'Teslim Alınacak') {
    return 'delivery-received'
  }
  return 'delivery-cancelled'
}

// Tarih formatlama
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  })
}

// Fiyat formatlama
const formatPrice = (price: number) => {
  return `₺${price.toFixed(2)}`
}

// Satış detayları
const viewSale = (saleId: string) => {
  console.log('Satış detayı:', saleId)
  // Detay sayfasına yönlendir
}
</script>

<style scoped>
.sales-page {
  padding: 0;
  max-width: 800px;
}

.sales-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.sales-icon {
  color: #666;
}

.sales-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.sales-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.sale-item {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.status-chip {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sale-date {
  color: #666;
  font-size: 0.9rem;
}

.details-btn {
  text-transform: none;
  font-weight: 500;
}

.buyer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.buyer-label {
  font-weight: 500;
}

.buyer-name {
  color: #333;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.product-icon {
  color: #666;
  flex-shrink: 0;
}

.product-details {
  flex: 1;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.delivery-status {
  font-weight: 500;
  font-size: 0.9rem;
}

.delivery-received {
  color: #28a745;
}

.delivery-received:before {
  content: '✓';
  margin-right: 0.25rem;
}

.delivery-cancelled {
  color: #dc3545;
}

.delivery-cancelled:before {
  content: '✗';
  margin-right: 0.25rem;
}

.product-name {
  color: #333;
  font-weight: 500;
}

.product-extra {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.product-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-images {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  background: white;
  padding: 0.5rem;
  border: 1px solid #e5e5e5;
}

.product-info-text {
  flex: 1;
  margin-left: auto;
}

.product-quantity-text {
  color: #333;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.product-count-text {
  color: #666;
  font-size: 0.9rem;
}

.sale-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.sale-meta {
  display: flex;
  flex-direction: column;
}

.sale-date-label {
  color: #666;
  font-size: 0.85rem;
}

.sale-date-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.sale-earnings {
  display: flex;
  flex-direction: column;
  text-align: right;
  gap: 0.25rem;
}

.commission-info, .net-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.commission-label, .net-label {
  color: #666;
  font-size: 0.85rem;
}

.commission-amount {
  color: #666;
  font-weight: 500;
}

.net-amount {
  color: #28a745;
  font-weight: 600;
  font-size: 1.1rem;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.custom-pagination {
  /* Vuetify pagination özelleştirmeleri */
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .sale-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .details-btn {
    align-self: flex-end;
  }
  
  .product-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .product-display {
    flex-direction: column;
    text-align: center;
  }
  
  .product-images {
    justify-content: center;
  }
  
  .sale-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .sale-earnings {
    align-self: flex-end;
  }
}
</style>