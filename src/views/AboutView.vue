<script setup>
// Composant Vue 3 pour afficher les icônes des apps Nextcloud installées/activées.
// - Récupère la liste via OCS: /ocs/v2.php/cloud/apps?format=json
// - Fallback: /ocs/v2.php/cloud/capabilities si la liste des apps est restreinte
// - Icônes: /apps/{appId}/img/app.svg -> app-dark.svg -> /core/img/app.svg
//
// Utilisation typique dans l'interface Nextcloud (session existante):
// <AppIcons basePath="" />
//
// Utilisation hors Nextcloud (page externe) avec Basic Auth (mot de passe d'application):
// <AppIcons basePath="https://cloud.example.com" username="login" appPassword="app_password" :useSession="false" />
//
// Note: pour Nextcloud sous un sous-répertoire, ex: basePath="/nextcloud"

import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  // Préfixe base, ex: "" (racine), "/nextcloud" (sous-répertoire) ou "https://cloud.example.com"
  basePath: { type: String, default: '' },
  // Taille des icônes (px)
  size: { type: Number, default: 48 },
  // Afficher le label (nom technique de l'app)
  showLabels: { type: Boolean, default: true },
  // Si le composant tourne dans l'UI Nextcloud, garder la session (cookies)
  useSession: { type: Boolean, default: true },
  // Auth externe: login Nextcloud (optionnel)
  username: { type: String, default: '' },
  // Auth externe: mot de passe d'application Nextcloud (optionnel)
  appPassword: { type: String, default: '' },
})

const apps = ref([]) // liste des appIds (strings)
const loading = ref(true)
const error = ref('')

// Construit une URL en ajoutant correctement basePath
function ncUrl(path) {
  const base = (props.basePath || '').replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function buildFetchInit() {
  const headers = {
    'OCS-APIRequest': 'true',
    Accept: 'application/json',
  }
  // Auth Basic si username + appPassword fournis (usage externe)
  if (props.username && props.appPassword) {
    // Attention: btoa nécessite des caractères ASCII; pour UTF-8, adapter au besoin.
    headers['Authorization'] = 'Basic ' + btoa(`${props.username}:${props.appPassword}`)
  }
  return {
    headers,
    credentials: props.useSession ? 'include' : 'omit',
  }
}

async function fetchApps() {
  loading.value = true
  error.value = ''
  const init = buildFetchInit()

  try {
    // Utiliser l'endpoint qui fonctionne selon votre test curl
    const res = await fetch(ncUrl('/ocs/v2.php/cloud/apps?format=json'), init)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

    const data = await res.json()
    console.log('Données reçues:', data)

    const statusCode = data?.ocs?.meta?.statuscode
    const status = data?.ocs?.meta?.status
    const appsData = data?.ocs?.data?.apps

    if ((statusCode === 100 || statusCode === 200 || status === 'ok') && appsData) {
      if (Array.isArray(appsData)) {
        apps.value = appsData
      } else if (typeof appsData === 'object') {
        apps.value = Object.keys(appsData)
      }
      return
    }
    // Certains Nextcloud renvoient directement un tableau dans data
    if (Array.isArray(data?.ocs?.data)) {
      apps.value = data.ocs.data
      return
    }

    throw new Error(`API returned statuscode: ${statusCode ?? 'unknown'}`)
  } catch (e) {
    console.error('Erreur lors de la récupération des apps:', e)
    error.value = `Erreur: ${e.message}`

    // Pas de fallback, on montre l'erreur pour debug
    apps.value = []
  } finally {
    loading.value = false
  }
}

function iconUrl(appId) {
  // Icône principale (peut ne pas exister pour certaines apps)
  return ncUrl(`/apps/${appId}/img/app.svg`)
}

function onIconError(appId, ev) {
  const img = ev.target
  // Essayer la variante sombre
  if (img.dataset.tryDark !== '1') {
    img.dataset.tryDark = '1'
    img.src = ncUrl(`/apps/${appId}/img/app-dark.svg`)
    return
  }
  // Fallback générique
  img.src = ncUrl('/core/img/app.svg')
}

function appLink(appId) {
  return ncUrl(`/apps/${appId}/`)
}

onMounted(fetchApps)

const gridStyle = computed(() => ({
  '--icon-size': `${props.size}px`,
}))
</script>

<template>
  <div class="app-icons" :style="gridStyle">
    <div v-if="loading" class="status">Chargement…</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <div v-else class="grid">
      <a v-for="app in apps" :key="app" :href="appLink(app)" class="item" :title="`Ouvrir ${app}`">
        <img
          :src="iconUrl(app)"
          :alt="app"
          @error="onIconError(app, $event)"
          class="icon"
          width="0"
          height="0"
          aria-hidden="true"
        />
        <span v-if="showLabels" class="label">{{ app }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.app-icons {
  display: block;
}

.status {
  padding: 8px 0;
  color: var(--color-text, #222);
  font-size: 14px;
}
.status.error {
  color: #b00020;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 12px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.icon {
  width: var(--icon-size, 48px);
  height: var(--icon-size, 48px);
  display: block;
}

.label {
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text, #222);
  text-align: center;
  word-break: break-word;
}
</style>
