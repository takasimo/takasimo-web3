<template>
  <div class="password-content">
    <h2>Şifre Değiştir</h2>
    <v-card class="pa-4">
      <v-form>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Mevcut Şifre"
              type="password"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Yeni Şifre"
              type="password"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Yeni Şifre Tekrar"
              type="password"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn color="primary" size="large">
              Şifreyi Güncelle
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>
.password-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
</style>