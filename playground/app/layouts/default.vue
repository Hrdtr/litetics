<script setup lang="ts">
import type { EventData } from '../../../src/types';

const events = ref<EventData[]>([]);
const showDashboard = ref(false);
let pollTimer: ReturnType<typeof setInterval> | null = null;

async function refresh() {
  try {
    events.value = await $fetch('/api/events');
  } catch {}
}

function typeBadge(t: string | null | undefined) {
  if (!t || t === 'pageview') return 'badge-load';
  if (t === 'unload') return 'badge-unload';
  return 'badge-custom';
}

function formatVal(v: unknown) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function durStr(ms: unknown) {
  if (ms == null) return '—';
  const n = Number(ms);
  if (n < 1000) return `${n}ms`;
  return `${(n / 1000).toFixed(2)}s`;
}

onMounted(() => {
  refresh();
  pollTimer = setInterval(refresh, 2000);
});
onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<template>
  <div class="layout">
    <nav class="navbar">
      <NuxtLink to="/" class="logo">Litetics Playground</NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/products">Products</NuxtLink>
        <button
          class="dashboard-toggle"
          :class="{ active: showDashboard }"
          @click="showDashboard = !showDashboard"
        >
          Events ({{ events.length }})
        </button>
      </div>
    </nav>

    <main>
      <slot />
    </main>

    <Teleport to="body">
      <div class="dashboard-panel" :class="{ open: showDashboard }">
        <div class="dashboard-header">
          <h3>Event Dashboard ({{ events.length }} events)</h3>
          <div class="dashboard-actions">
            <button class="btn-refresh" @click="refresh">Refresh</button>
            <button class="btn-close" @click="showDashboard = false">&times;</button>
          </div>
        </div>
        <div class="dashboard-table-wrap">
          <table v-if="events.length">
            <thead>
              <tr>
                <th v-for="col in tableColumns" :key="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ev in events" :key="ev.bid + String(ev.receivedAt)">
                <td v-for="col in tableColumns" :key="col">
                  <template v-if="col === 'type'">
                    <span
                      class="badge"
                      :class="typeBadge(ev.type === 'pageview' ? 'pageview' : ev.type || '')"
                      >{{ ev.type || 'unload' }}</span
                    >
                  </template>
                  <template v-else-if="col === 'durationMs'">{{ durStr(ev.durationMs) }}</template>
                  <template v-else-if="col === 'receivedAt'">{{
                    ev.receivedAt ? new Date(ev.receivedAt).toLocaleString() : '—'
                  }}</template>
                  <template v-else-if="col === 'bid'">{{ ev.bid.slice(0, 8) }}</template>
                  <template v-else-if="col === 'properties'">{{
                    ev.properties ? JSON.stringify(ev.properties).slice(0, 60) : '—'
                  }}</template>
                  <template v-else-if="typeof ev[col as keyof typeof ev] === 'boolean'">{{
                    ev[col as keyof typeof ev] ? '✓' : '—'
                  }}</template>
                  <template v-else>{{ formatVal(ev[col as keyof typeof ev]) }}</template>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="dashboard-empty">
            No events yet. Navigate the site or trigger custom events!
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
const tableColumns = [
  'type',
  'bid',
  'host',
  'path',
  'queryString',
  'hash',
  'isUniqueUser',
  'isUniquePage',
  'durationMs',
  'timeZone',
  'country',
  'userAgent',
  'browserName',
  'browserVersion',
  'browserEngineName',
  'browserEngineVersion',
  'deviceType',
  'deviceVendor',
  'deviceModel',
  'cpuArchitecture',
  'osName',
  'osVersion',
  'referrer',
  'referrerHost',
  'referrerPath',
  'referrerQueryString',
  'referrerKnown',
  'referrerMedium',
  'referrerName',
  'referrerSearchParameter',
  'referrerSearchTerm',
  'acceptLanguage',
  'languageCode',
  'languageScript',
  'languageRegion',
  'secondaryLanguageCode',
  'secondaryLanguageScript',
  'secondaryLanguageRegion',
  'utmCampaign',
  'utmMedium',
  'utmSource',
  'utmTerm',
  'utmContent',
  'utmId',
  'utmSourcePlatform',
  'properties',
  'receivedAt',
];
</script>

<style>
body {
  min-height: 100vh;
  background: #f8f9fb;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  font-weight: 700;
  font-size: 1rem;
  color: #4f46e5;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  padding: 0.25rem 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s;
}

.nav-links a:hover {
  color: #4f46e5;
}

.nav-links a.router-link-exact-active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.dashboard-toggle {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s;
}

.dashboard-toggle.active,
.dashboard-toggle:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

main {
  padding: 0;
}

.dashboard-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 1100px;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  transform: translateX(100%);
  transition: transform 0.25s ease;
  display: flex;
  flex-direction: column;
}

.dashboard-panel.open {
  transform: translateX(0);
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.dashboard-header h3 {
  font-size: 0.95rem;
  margin: 0;
  color: #1a1a2e;
}

.dashboard-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-refresh {
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 5px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
}

.btn-refresh:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.btn-close {
  font-size: 1.2rem;
  padding: 0 0.35rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  line-height: 1;
}

.btn-close:hover {
  color: #374151;
}

.dashboard-table-wrap {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.dashboard-table-wrap table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.68rem;
}

.dashboard-table-wrap thead {
  position: sticky;
  top: 0;
  z-index: 2;
}

.dashboard-table-wrap th {
  background: #f9fafb;
  text-align: left;
  padding: 0.5rem 0.6rem;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.62rem;
  text-transform: uppercase;
  white-space: nowrap;
  border-bottom: 2px solid #e5e7eb;
}

.dashboard-table-wrap td {
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-table-wrap tr:hover td {
  background: #fafbfd;
}

.dashboard-empty {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
}

.badge-load {
  background: #1d4ed8;
  color: #dbeafe;
}

.badge-unload {
  background: #d97706;
  color: #fef3c7;
}

.badge-custom {
  background: #16a34a;
  color: #dcfce7;
}
</style>
