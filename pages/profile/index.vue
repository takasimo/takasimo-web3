<template>
  <div class="profile-content">
    <h2>Profil Bilgileri</h2>
    <v-card class="pa-4">
      <v-form>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Ad"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Soyad"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="E-posta"
              type="email"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Telefon"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              label="Hakkında"
              variant="outlined"
              rows="3"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn color="primary" size="large">
              Bilgileri Güncelle
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>
.profile-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
</style>
