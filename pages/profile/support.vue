<template>
  <div class="support-page">
    <h2>Takasimo Destek</h2>
    
    <!-- İletişim Seçenekleri -->
    <div class="section">
      <h3>Size Nasıl Yardımcı Olabiliriz?</h3>
      
      <div class="contact-options">
        <v-card class="contact-card" @click="openChat">
          <v-card-text>
            <div class="contact-content">
              <v-icon class="contact-icon" color="green" size="48">mdi-chat</v-icon>
              <div class="contact-info">
                <h4>Canlı Destek</h4>
                <p>Anında yardım alın</p>
                <span class="contact-status online">• Çevrimiçi</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="contact-card" @click="sendEmail">
          <v-card-text>
            <div class="contact-content">
              <v-icon class="contact-icon" color="blue" size="48">mdi-email</v-icon>
              <div class="contact-info">
                <h4>E-posta Desteği</h4>
                <p>24 saat içinde yanıt</p>
                <span class="contact-status">destek@takasimo.com</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <v-card class="contact-card" @click="callSupport">
          <v-card-text>
            <div class="contact-content">
              <v-icon class="contact-icon" color="orange" size="48">mdi-phone</v-icon>
              <div class="contact-info">
                <h4>Telefon Desteği</h4>
                <p>Hafta içi 09:00-18:00</p>
                <span class="contact-status">0850 123 45 67</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Destek Talebi Formu -->
    <div class="section">
      <h3>Destek Talebi Oluştur</h3>
      
      <v-card class="support-form-card">
        <v-card-text>
          <v-form ref="supportForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="supportTicket.category"
                  :items="categoryOptions"
                  label="Konu Kategorisi"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="supportTicket.priority"
                  :items="priorityOptions"
                  label="Öncelik"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="supportTicket.subject"
                  label="Konu Başlığı"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="supportTicket.message"
                  label="Mesajınız"
                  variant="outlined"
                  rows="5"
                  density="comfortable"
                  placeholder="Sorununuzu detaylı olarak açıklayın..."
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-file-input
                  v-model="supportTicket.attachments"
                  label="Dosya Ekle (Opsiyonel)"
                  variant="outlined"
                  density="comfortable"
                  accept="image/*,.pdf,.doc,.docx"
                  multiple
                  prepend-icon="mdi-paperclip"
                />
                <small class="text-grey">Maksimum 5MB, desteklenen formatlar: JPG, PNG, PDF, DOC</small>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-btn 
                  color="primary" 
                  size="large" 
                  @click="submitTicket"
                  :disabled="!isFormValid"
                  :loading="isSubmitting"
                >
                  Destek Talebi Gönder
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- Mevcut Talepler -->
    <div class="section" v-if="supportTickets.length > 0">
      <h3>Mevcut Destek Talepleriniz</h3>
      
      <div class="tickets-list">
        <v-card v-for="ticket in supportTickets" :key="ticket.id" class="ticket-card">
          <v-card-text>
            <div class="ticket-header">
              <div class="ticket-info">
                <h4>#{{ ticket.id }} - {{ ticket.subject }}</h4>
                <p class="ticket-date">{{ formatDate(ticket.createdAt) }}</p>
              </div>
              <v-chip :color="getStatusColor(ticket.status)" size="small">
                {{ ticket.status }}
              </v-chip>
            </div>
            
            <div class="ticket-content">
              <p><strong>Kategori:</strong> {{ ticket.category }}</p>
              <p><strong>Öncelik:</strong> {{ ticket.priority }}</p>
              <p class="ticket-message">{{ ticket.message }}</p>
            </div>
            
            <div class="ticket-footer">
              <v-btn variant="outlined" size="small" @click="viewTicket(ticket.id)">
                Detaylar
              </v-btn>
              <v-btn 
                v-if="ticket.status !== 'Kapatıldı'" 
                variant="outlined" 
                size="small" 
                @click="addMessage(ticket.id)"
              >
                Mesaj Ekle
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- SSS -->
    <div class="section">
      <h3>Sık Sorulan Sorular</h3>
      
      <div class="faq-list">
        <v-expansion-panels>
          <v-expansion-panel v-for="faq in faqList" :key="faq.id">
            <v-expansion-panel-title>{{ faq.question }}</v-expansion-panel-title>
            <v-expansion-panel-text>{{ faq.answer }}</v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Form data
const supportTicket = ref({
  category: '',
  priority: '',
  subject: '',
  message: '',
  attachments: []
})

const isSubmitting = ref(false)

// Form seçenekleri
const categoryOptions = ref([
  'Hesap Problemi',
  'Ödeme Sorunu',
  'Teknik Destek',
  'İlan Problemi',
  'Dolandırıcılık Bildirimi',
  'Diğer'
])

const priorityOptions = ref([
  'Düşük',
  'Orta',
  'Yüksek',
  'Acil'
])

// Mevcut destek talepleri
const supportTickets = ref([
  {
    id: '2024001',
    subject: 'Ödeme problemi',
    category: 'Ödeme Sorunu',
    priority: 'Yüksek',
    status: 'Açık',
    message: 'Satışımın ödemesi hesabıma geçmedi...',
    createdAt: '2024-01-15'
  },
  {
    id: '2024002',
    subject: 'İlan yayınlanmıyor',
    category: 'Teknik Destek',
    priority: 'Orta',
    status: 'Yanıtlandı',
    message: 'İlanım 2 gündür beklemede...',
    createdAt: '2024-01-12'
  }
])

// SSS
const faqList = ref([
  {
    id: 1,
    question: 'Satış ödemem ne zaman hesabıma geçer?',
    answer: 'Satış tamamlandıktan sonra ödemeniz 1-2 iş günü içinde hesabınıza geçer.'
  },
  {
    id: 2,
    question: 'İlanım neden yayınlanmıyor?',
    answer: 'İlanlar moderasyon sürecinden geçer. Bu süreç genellikle 24 saat sürer.'
  },
  {
    id: 3,
    question: 'Hesabımı nasıl silebilirim?',
    answer: 'Hesap ayarlarından "Hesabı Sil" seçeneğini kullanabilirsiniz.'
  }
])

// Form validation
const isFormValid = computed(() => {
  return supportTicket.value.category && 
         supportTicket.value.priority && 
         supportTicket.value.subject && 
         supportTicket.value.message
})

// Durum rengi
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Açık': return 'orange'
    case 'Yanıtlandı': return 'blue'
    case 'Çözüldü': return 'green'
    case 'Kapatıldı': return 'grey'
    default: return 'grey'
  }
}

// Tarih formatlama
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

// İletişim fonksiyonları
const openChat = () => {
  console.log('Canlı destek açılıyor...')
  // Canlı destek widget'ı açılacak
}

const sendEmail = () => {
  console.log('E-posta uygulaması açılıyor...')
  window.open('mailto:destek@takasimo.com')
}

const callSupport = () => {
  console.log('Telefon uygulaması açılıyor...')
  window.open('tel:+908501234567')
}

// Form işlemleri
const submitTicket = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  try {
    // API çağrısı simülasyonu
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Destek talebi gönderildi:', supportTicket.value)
    
    // Form'u temizle
    supportTicket.value = {
      category: '',
      priority: '',
      subject: '',
      message: '',
      attachments: []
    }
    
    // Başarı mesajı
    alert('Destek talebiniz başarıyla gönderildi!')
    
  } catch (error) {
    console.error('Hata:', error)
    alert('Bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isSubmitting.value = false
  }
}

// Ticket işlemleri
const viewTicket = (ticketId: string) => {
  console.log('Ticket detayı:', ticketId)
}

const addMessage = (ticketId: string) => {
  console.log('Ticket\'a mesaj ekle:', ticketId)
}
</script>

<style scoped>
.support-page {
  padding: 0;
  max-width: 1000px;
}

.support-page h2 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.section {
  margin-bottom: 3rem;
}

.section h3 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

/* İletişim Seçenekleri */
.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.contact-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.contact-card:hover {
  transform: translateY(-2px);
}

.contact-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contact-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.contact-info p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.contact-status {
  font-size: 0.875rem;
  color: #666;
}

.contact-status.online {
  color: #10b981;
  font-weight: 600;
}

/* Form */
.support-form-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

/* Ticket Listesi */
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.ticket-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 600;
}

.ticket-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.ticket-content p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.ticket-message {
  margin-top: 0.5rem;
  color: #555 !important;
  line-height: 1.4;
}

.ticket-footer {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

/* SSS */
.faq-list {
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-options {
    grid-template-columns: 1fr;
  }
  
  .contact-content {
    flex-direction: column;
    text-align: center;
  }
  
  .ticket-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .ticket-footer {
    flex-direction: column;
  }
}
</style>