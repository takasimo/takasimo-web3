<template>
  <div class="help-page">
    <h2>Nasıl Çalışır</h2>
    
    <!-- Arama -->
    <div class="section">
      <v-text-field
        v-model="searchQuery"
        label="Yardım konularında ara..."
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        clearable
      />
    </div>

    <!-- Hızlı Linkler -->
    <div class="section">
      <h3>Sık Kullanılan Konular</h3>
      <div class="quick-links">
        <v-chip-group>
          <v-chip 
            v-for="topic in quickTopics" 
            :key="topic"
            @click="searchQuery = topic"
            variant="outlined"
          >
            {{ topic }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>

    <!-- Yardım Kategorileri -->
    <div class="section">
      <div class="help-categories">
        <v-card 
          v-for="category in filteredCategories" 
          :key="category.id" 
          class="category-card"
          @click="toggleCategory(category.id)"
        >
          <v-card-text>
            <div class="category-header">
              <div class="category-info">
                <v-icon :color="category.color" class="category-icon">{{ category.icon }}</v-icon>
                <div>
                  <h4>{{ category.title }}</h4>
                  <p>{{ category.description }}</p>
                </div>
              </div>
              <v-icon>{{ expandedCategories.includes(category.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>
            
            <v-expand-transition>
              <div v-show="expandedCategories.includes(category.id)" class="category-content">
                <div v-for="item in category.items" :key="item.id" class="help-item">
                  <h5 @click="toggleItem(item.id)">
                    {{ item.question }}
                    <v-icon size="small">{{ expandedItems.includes(item.id) ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
                  </h5>
                  <v-expand-transition>
                    <div v-show="expandedItems.includes(item.id)" class="help-answer">
                      {{ item.answer }}
                    </div>
                  </v-expand-transition>
                </div>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- İletişim -->
    <div class="section">
      <v-card class="contact-card">
        <v-card-text>
          <h3>Sorunuz mu var?</h3>
          <p>Aradığınız cevabı bulamadıysanız bizimle iletişime geçin.</p>
          <div class="contact-actions">
            <v-btn color="primary" @click="contactSupport">
              Destek Ekibi
            </v-btn>
            <v-btn variant="outlined" @click="sendFeedback">
              Geri Bildirim Gönder
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Arama
const searchQuery = ref('')

// Hızlı konular
const quickTopics = ref([
  'Nasıl satış yaparım',
  'Ödeme nasıl alırım',
  'Hesap güvenliği',
  'İlan verme',
  'Komisyon oranları'
])

// Genişletilmiş kategoriler ve öğeler
const expandedCategories = ref<string[]>([])
const expandedItems = ref<string[]>([])

// Yardım kategorileri
const categories = ref([
  {
    id: 'selling',
    title: 'Satış Yapmak',
    description: 'Ürün satışı hakkında bilmeniz gerekenler',
    icon: 'mdi-store',
    color: 'green',
    items: [
      {
        id: 'how-to-sell',
        question: 'Nasıl ürün satarım?',
        answer: 'Ürün satmak için önce hesabınıza giriş yapın, "İlan Ver" butonuna tıklayın, ürününüzün fotoğraflarını ekleyin, açıklama yazın ve fiyatını belirleyin. İlanınız onaylandıktan sonra yayınlanacaktır.'
      },
      {
        id: 'commission-rates',
        question: 'Komisyon oranları nedir?',
        answer: 'Takasimo, tamamlanan satışlardan %10 komisyon alır. Örneğin 100 TL\'lik bir satıştan 90 TL alırsınız. Komisyon sadece başarılı satışlardan alınır.'
      },
      {
        id: 'payment-process',
        question: 'Ödeme nasıl alırım?',
        answer: 'Satış tamamlandıktan sonra ödeme otomatik olarak hesabınıza geçer. IBAN bilgilerinizi profil ayarlarından güncelleyebilirsiniz.'
      }
    ]
  },
  {
    id: 'buying',
    title: 'Alışveriş Yapmak',
    description: 'Güvenli alışveriş için ipuçları',
    icon: 'mdi-shopping',
    color: 'blue',
    items: [
      {
        id: 'how-to-buy',
        question: 'Nasıl ürün satın alırım?',
        answer: 'Beğendiğiniz ürüne tıklayın, "Satın Al" butonuna basın ve ödeme işlemini tamamlayın. Satıcı ile mesajlaşarak detayları konuşabilirsiniz.'
      },
      {
        id: 'safe-shopping',
        question: 'Güvenli alışveriş nasıl yaparım?',
        answer: 'Sadece onaylanmış satıcılardan alışveriş yapın, ödeme işlemlerini platform üzerinden gerçekleştirin ve şüpheli durumları bildirin.'
      }
    ]
  },
  {
    id: 'account',
    title: 'Hesap Yönetimi',
    description: 'Hesap ayarları ve güvenlik',
    icon: 'mdi-account-cog',
    color: 'purple',
    items: [
      {
        id: 'account-security',
        question: 'Hesabımı nasıl güvende tutarım?',
        answer: 'Güçlü bir şifre kullanın, iki faktörlü doğrulamayı açın ve hesap bilgilerinizi kimseyle paylaşmayın.'
      },
      {
        id: 'profile-update',
        question: 'Profil bilgilerimi nasıl güncellerim?',
        answer: 'Profil sayfanıza giderek "Düzenle" butonlarına tıklayarak bilgilerinizi güncelleyebilirsiniz.'
      }
    ]
  },
  {
    id: 'support',
    title: 'Destek ve İletişim',
    description: 'Yardım alma ve iletişim',
    icon: 'mdi-help-circle',
    color: 'orange',
    items: [
      {
        id: 'contact-support',
        question: 'Destek ekibi ile nasıl iletişime geçerim?',
        answer: 'Destek sayfamızdan ticket oluşturabilir, canlı destek ile konuşabilir veya e-posta gönderebilirsiniz.'
      },
      {
        id: 'report-problem',
        question: 'Sorun nasıl bildiririm?',
        answer: 'Karşılaştığınız sorunları "Sorun Bildir" bölümünden detaylı şekilde açıklayarak bildirebilirsiniz.'
      }
    ]
  }
])

// Filtrelenmiş kategoriler
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category => 
    category.title.toLowerCase().includes(query) ||
    category.description.toLowerCase().includes(query) ||
    category.items.some(item => 
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    )
  )
})

// Kategori toggle
const toggleCategory = (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

// Öğe toggle
const toggleItem = (itemId: string) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemId)
  }
}

// İletişim fonksiyonları
const contactSupport = () => {
  console.log('Destek ekibi ile iletişim')
  navigateTo('/profile/support')
}

const sendFeedback = () => {
  console.log('Geri bildirim gönder')
}
</script>

<style scoped>
.help-page {
  padding: 0;
  max-width: 900px;
}

.help-page h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.quick-links {
  margin-bottom: 1rem;
}

.help-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  cursor: pointer;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon {
  font-size: 2rem;
}

.category-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.category-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.category-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.help-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.help-item h5 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help-answer {
  margin-top: 0.5rem;
  color: #666;
  line-height: 1.5;
}

.contact-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.contact-card h3 {
  margin-bottom: 0.5rem;
  color: white;
}

.contact-card p {
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.contact-actions {
  display: flex;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .category-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .contact-actions {
    flex-direction: column;
  }
}
</style>