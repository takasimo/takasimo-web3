
<!-- pages/profile.vue (Ana sayfa) -->
<template>
  <v-main class="settings-layout">
    <aside class="menu">
      <NuxtLink to="/profile">Profil</NuxtLink>
      <NuxtLink to="/profile/password">Şifre</NuxtLink>
    </aside>

    <main class="content">
      <!-- Sadece NuxtPage, default content yok -->
      <NuxtPage />
    </main>
  </v-main>
</template>

<script setup lang="ts">

</script>


<style scoped>
.settings-layout {
  display: flex;
  min-height: 100vh;
}

.menu {
  width: 250px;
  background-color: #f8f9fa;
  padding: 2rem 1rem;
  border-right: 1px solid #e9ecef;
}

.menu a {
  display: block;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: #495057;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.menu a:hover {
  background-color: #e9ecef;
  color: #212529;
}

.menu a.router-link-active {
  background-color: #007bff;
  color: white;
}

.content {
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
}

@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
  }

  .menu {
    width: 100%;
    padding: 1rem;
  }

  .menu a {
    display: inline-block;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>