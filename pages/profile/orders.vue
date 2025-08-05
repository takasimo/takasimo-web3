<template>
  <div class="orders-page">
    <div class="orders-header">
      <v-icon class="orders-icon">mdi-shopping</v-icon>
      <h2>Siparişlerim</h2>
    </div>
    
    <!-- Sipariş Listesi -->
    <div class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <!-- Sipariş Header -->
        <div class="order-header">
          <v-chip 
            :color="getStatusColor(order.status)" 
            size="small" 
            class="status-chip"
          >
            {{ order.status }}
          </v-chip>
          <span class="order-date">{{ formatDate(order.date) }}</span>
          <v-btn 
            variant="text" 
            color="primary" 
            size="small" 
            class="details-btn"
            @click="viewOrder(order.id)"
          >
            Detaylar
            <v-icon right size="small">mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <!-- Ürün Bilgileri -->
        <div class="product-info">
          <v-icon class="product-icon">mdi-information-outline</v-icon>
          <div class="product-details">
            <div class="product-meta">
              <span class="product-status">{{ order.deliveryStatus || 'İptal' }}</span>
              <span class="product-name">{{ order.productName }}</span>
            </div>
            <div class="product-extra">
              <span class="product-quantity">{{ order.quantity }} ürün</span>
              <span class="product-count">({{ order.itemCount }} adet)</span>
            </div>
          </div>
        </div>

        <!-- Ürün Görseli ve Detayları -->
        <div class="product-display">
          <img 
            :src="order.productImage" 
            :alt="order.productName"
            class="product-image"
          >
          <div class="product-info-text">
            <div class="product-quantity-text">{{ order.quantity }} ürün</div>
            <div class="product-count-text">({{ order.itemCount }} adet)</div>
          </div>
        </div>

        <!-- Sipariş Footer -->
        <div class="order-footer">
          <div class="order-meta">
            <span class="order-date-full">Sipariş Tarihi</span>
            <span class="order-date-value">{{ formatDate(order.date) }}</span>
          </div>
          <div class="order-total">
            <span class="total-label">Toplam</span>
            <span class="total-amount">{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Boş durum -->
      <div v-if="orders.length === 0" class="empty-state">
        <v-icon size="48" color="grey-lighten-2">mdi-shopping</v-icon>
        <p>Henüz siparişiniz bulunmamaktadır.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock sipariş verileri - resme uygun
const orders = ref([
  {
    id: '1',
    date: '2025-06-27',
    status: 'SİPARİŞ',
    deliveryStatus: 'İptal',
    productName: 'Surat Kargo',
    quantity: '1 ürün',
    itemCount: '1 adet',
    total: 1.00,
    productImage: '/assets/images/products/baby_car.svg'
  },
  {
    id: '2', 
    date: '2025-06-14',
    status: 'SİPARİŞ',
    deliveryStatus: 'İptal',
    productName: 'Surat Kargo',
    quantity: '1 ürün',
    itemCount: '1 adet',
    total: 639900,
    productImage: '/assets/images/products/baby_car.svg'
  },
  {
    id: '3',
    date: '2025-06-04',
    status: 'SİPARİŞ',
    deliveryStatus: 'Teslim Edildi',
    productName: 'Surat Kargo',
    quantity: '1 ürün', 
    itemCount: '1 adet',
    total: 12000,
    productImage: '/assets/images/products/baby_car.svg'
  }
])

// Durum rengi
const getStatusColor = (status: string) => {
  switch (status) {
    case 'SİPARİŞ': return 'purple'
    case 'HAZIRDA': return 'orange'
    case 'KARGODA': return 'blue'
    case 'TESLİM': return 'green'
    default: return 'purple'
  }
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
  if (price < 100) {
    return `₺${price.toFixed(2)}`
  }
  return `₺${price.toLocaleString('tr-TR')}`
}

// Sipariş detayları
const viewOrder = (orderId: string) => {
  console.log('Sipariş detayı:', orderId)
  // Detay sayfasına yönlendir
}
</script>

<style scoped>
.orders-page {
  padding: 0;
  max-width: 800px;
}

.orders-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.orders-icon {
  color: #666;
}

.orders-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
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

.order-date {
  color: #666;
  font-size: 0.9rem;
}

.details-btn {
  text-transform: none;
  font-weight: 500;
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

.product-status {
  color: #28a745;
  font-weight: 500;
  font-size: 0.9rem;
}

.product-status:before {
  content: '✓';
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

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  background: white;
  padding: 0.5rem;
}

.product-info-text {
  flex: 1;
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

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.order-meta {
  display: flex;
  flex-direction: column;
}

.order-date-full {
  color: #666;
  font-size: 0.85rem;
}

.order-date-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.order-total {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.total-label {
  color: #666;
  font-size: 0.85rem;
}

.total-amount {
  color: #e91e63;
  font-weight: 600;
  font-size: 1.1rem;
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
  .order-header {
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
  
  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .order-total {
    align-self: flex-end;
  }
}
</style>