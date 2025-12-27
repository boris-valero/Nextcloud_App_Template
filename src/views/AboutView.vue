<template>
  <div class="about-view">
    <div class="content-wrapper">
      <h1>À propos</h1>
      <div class="hello-world-card">
        <h2>Hello World!</h2>
        <p>Bienvenue dans la section À propos de Framaspace.</p>
        <p>
          Cette application est un exemple d'implémentation d'une application Nextcloud utilisant
          Vue.js et TypeScript.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Pas de logique nécessaire pour une page statique simple
</script>

<style scoped>
.about-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.content-wrapper {
  background: var(--color-main-background);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: var(--color-primary);
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-weight: 300;
}

.hello-world-card {
  background: var(--color-background-hover);
  padding: 24px;
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
  margin-top: 20px;
}

.hello-world-card h2 {
  color: var(--color-primary);
  margin-bottom: 16px;
  font-size: 1.8rem;
  font-weight: 500;
}

.hello-world-card p {
  color: var(--color-main-text);
  line-height: 1.6;
  margin-bottom: 12px;
}

.hello-world-card p:last-child {
  margin-bottom: 0;
}
</style>
