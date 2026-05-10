<script setup lang="ts">
const { $tracker, $setTrackerMode } = useNuxtApp();

const hashMode = ref(false);
const customEventLog = ref<
  { id: number; ts: string; action: string; data: Record<string, unknown> }[]
>([]);

let logId = 0;

const timerKey = ref('');
const timerStart = ref(0);
const timerElapsed = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const hashRoutes = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/products', label: 'Products' },
  { path: '/products/alpha', label: 'Product Alpha' },
  { path: '/products/beta', label: 'Product Beta' },
];

const currentHashRoute = ref('');

function getRandomQuery() {
  const q = [
    'how to track analytics',
    'vue performance tips',
    'best SSR framework 2025',
    'javascript SPA tracking',
  ];
  return q[Math.floor(Math.random() * q.length)];
}

function toggleHashMode() {
  hashMode.value = !hashMode.value;
  $setTrackerMode(hashMode.value ? 'hash' : 'history');
  if (hashMode.value) {
    navigateHash('/');
  }
}

function navigateHash(path: string) {
  location.hash = `#${path}`;
}

function trackClick(action: string, extra?: Record<string, unknown>) {
  $tracker.value.track(action, { type: action, source: 'home', ...extra, ts: Date.now() });
  customEventLog.value.push({
    id: logId++,
    ts: new Date().toLocaleTimeString(),
    action,
    data: { source: 'home', ...extra },
  });
}

async function startTimer(action: string) {
  timerKey.value = action;
  timerStart.value = Date.now();
  timerElapsed.value = 0;
  await $tracker.value.track(action, { type: action, label: 'started' }, { withDuration: true });
  customEventLog.value.push({
    id: logId++,
    ts: new Date().toLocaleTimeString(),
    action,
    data: { label: 'started (timed)' },
  });
  timerInterval = setInterval(() => {
    timerElapsed.value = Date.now() - timerStart.value;
  }, 100);
}

async function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const key = timerKey.value;
  timerKey.value = '';
  await $tracker.value.trackEndOf(key);
  customEventLog.value.push({
    id: logId++,
    ts: new Date().toLocaleTimeString(),
    action: key,
    data: { label: 'stopped', elapsedMs: Date.now() - timerStart.value },
  });
  timerElapsed.value = Date.now() - timerStart.value;
}

function clearLogs() {
  customEventLog.value = [];
}

function typeBadge(type: string | null | undefined) {
  if (!type || type === 'pageview') return 'badge-load';
  if (type === 'unload') return 'badge-unload';
  return 'badge-custom';
}

function resolveHashRoute() {
  const h = location.hash.replace(/^#/, '') || '/';
  currentHashRoute.value = h;
}

onMounted(() => {
  resolveHashRoute();
  addEventListener('hashchange', resolveHashRoute);
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
  removeEventListener('hashchange', resolveHashRoute);
});

const currentLocationHref = computed(() => (import.meta.server ? '' : location.href));
</script>

<template>
  <div class="page">
    <section class="hero">
      <h1>Litetics Tracker Playground</h1>
      <p class="subtitle">
        Real SPA tracking powered by <code>createTracker</code>. Navigate pages, trigger custom
        events, test hash routing, and watch every beacon land on the server.
      </p>
      <div class="hero-actions">
        <NuxtLink to="/about" class="btn btn-primary">Go to About &rarr;</NuxtLink>
        <NuxtLink to="/products" class="btn btn-secondary">Browse Products &rarr;</NuxtLink>
      </div>
    </section>

    <section class="section" id="hash-spa">
      <h2>
        Hash-Based SPA Simulation
        <span class="mode-badge" :class="hashMode ? 'on' : 'off'">{{
          hashMode ? 'HASH MODE' : 'HISTORY MODE'
        }}</span>
      </h2>
      <p>
        When <strong>Hash Mode</strong> is ON, the tracker uses
        <code>createBrowserAdapter({{ '{' }} mode: 'hash' {{ '}' }})</code>. Clicking the navigation
        links below changes <code>location.hash</code> &mdash; exactly how a Vue Router app with
        <code>createWebHashHistory()</code> works. The browser fires <code>hashchange</code>, the
        tracker's <code>onNavigate</code> hook sends an unload beacon for the previous hash
        &ldquo;page&rdquo; and a load beacon for the new one.
        <strong>Every hash route is tracked as a pageview.</strong>
      </p>
      <div class="toggle-row">
        <button class="toggle-btn" :class="{ on: hashMode }" @click="toggleHashMode">
          {{ hashMode ? 'Switch to History Mode' : 'Enable Hash Mode (simulate hash-based SPA)' }}
        </button>
      </div>

      <template v-if="hashMode">
        <nav class="hash-navbar">
          <a
            v-for="r in hashRoutes"
            :key="r.path"
            :class="{ active: currentHashRoute === r.path }"
            :href="`#${r.path}`"
            @click.prevent="navigateHash(r.path)"
          >
            {{ r.label }}
          </a>
        </nav>
        <div class="current-route">
          Active route: <strong>#{{ currentHashRoute }}</strong>
          <span class="tracking-on">&mdash; tracker will fire onNavigate</span>
        </div>

        <div class="hash-page-content" :key="currentHashRoute">
          <div v-if="currentHashRoute === '/' || currentHashRoute === ''" class="hash-page">
            <h3>Home</h3>
            <p>
              Welcome to the simulated hash-based SPA. This is the Home "page" rendered when the
              hash is <code>#/</code>. Navigate to other pages to see the tracker fire beacons.
            </p>
          </div>
          <div v-else-if="currentHashRoute === '/about'" class="hash-page">
            <h3>About</h3>
            <p>
              This is the About page, rendered when the hash is <code>#/about</code>. In a real Vue
              Router hash-mode app, this would be the About component.
            </p>
          </div>
          <div v-else-if="currentHashRoute === '/products'" class="hash-page">
            <h3>Products</h3>
            <p>Product listing page. Click a product below to navigate to its detail view.</p>
            <div class="hash-products">
              <a
                href="#/products/alpha"
                @click.prevent="navigateHash('/products/alpha')"
                class="hash-product-link"
                >Alpha Widget &mdash; $29</a
              >
              <a
                href="#/products/beta"
                @click.prevent="navigateHash('/products/beta')"
                class="hash-product-link"
                >Beta Engine &mdash; $49</a
              >
            </div>
          </div>
          <div v-else-if="currentHashRoute === '/products/alpha'" class="hash-page">
            <h3>
              <a href="#/products" @click.prevent="navigateHash('/products')" class="back-link"
                >&larr; Products</a
              >
              &nbsp; Alpha Widget
            </h3>
            <p><strong>Price:</strong> $29</p>
            <p>The flagship product. Fast, reliable, and loved by devs worldwide.</p>
            <button
              class="btn btn-accent"
              @click="trackClick('add_to_cart', { productId: 'alpha', source: 'hash_spa' })"
            >
              Add to Cart (custom event)
            </button>
          </div>
          <div v-else-if="currentHashRoute === '/products/beta'" class="hash-page">
            <h3>
              <a href="#/products" @click.prevent="navigateHash('/products')" class="back-link"
                >&larr; Products</a
              >
              &nbsp; Beta Engine
            </h3>
            <p><strong>Price:</strong> $49</p>
            <p>Advanced analytics engine for enterprise workloads with sub-ms latency.</p>
            <button
              class="btn btn-accent"
              @click="trackClick('add_to_cart', { productId: 'beta', source: 'hash_spa' })"
            >
              Add to Cart (custom event)
            </button>
          </div>
          <div v-else class="hash-page">
            <h3>404 &mdash; Hash route not found</h3>
            <p>
              <code>#{{ currentHashRoute }}</code> does not match any page. Try navigating to a
              known route.
            </p>
          </div>
        </div>
      </template>

      <div v-else class="hash-disabled-note">
        Hash mode is disabled. Enable it above to simulate a hash-based SPA with full pageview
        tracking.
      </div>
    </section>

    <section class="section">
      <h2>Custom Event Tracking</h2>
      <p>
        Buttons call <code>$tracker.track(key, data)</code> with different action types and
        payloads.
      </p>
      <div class="btn-grid">
        <button class="btn btn-primary" @click="trackClick('signup', { method: 'email' })">
          Sign Up (email)
        </button>
        <button
          class="btn btn-primary"
          @click="trackClick('signup', { method: 'google', provider: 'oauth' })"
        >
          Sign Up (Google)
        </button>
        <button
          class="btn btn-secondary"
          @click="trackClick('share', { platform: 'twitter', url: currentLocationHref })"
        >
          Share on Twitter
        </button>
        <button class="btn btn-secondary" @click="trackClick('share', { platform: 'copy_link' })">
          Copy Link
        </button>
        <button
          class="btn btn-secondary"
          @click="trackClick('search', { query: getRandomQuery() })"
        >
          Search (random query)
        </button>
        <button
          class="btn btn-secondary"
          @click="trackClick('download', { file: 'report.pdf', size: '2.4MB' })"
        >
          Download Report
        </button>
        <button
          class="btn btn-secondary"
          @click="trackClick('feedback', { rating: Math.ceil(Math.random() * 5) })"
        >
          Rate this page
        </button>
        <button
          class="btn btn-secondary"
          @click="trackClick('error', { code: 500, message: 'simulated crash' })"
        >
          Simulate Error
        </button>
      </div>
    </section>

    <section class="section">
      <h2>Timed Event Tracking</h2>
      <p>
        Uses <code>$tracker.track(key, data, {{ '{' }} withDuration: true {{ '}' }})</code> and
        <code>$tracker.trackEndOf(key)</code>.
      </p>

      <div v-if="!timerKey" class="btn-grid">
        <button class="btn btn-accent" @click="startTimer('video_watch')">
          Start Watching Video
        </button>
        <button class="btn btn-accent" @click="startTimer('form_fill')">Start Filling Form</button>
        <button class="btn btn-accent" @click="startTimer('reading')">Start Reading Article</button>
        <button class="btn btn-accent" @click="startTimer('checkout_flow')">
          Start Checkout Flow
        </button>
      </div>

      <div v-else class="timer-card">
        <span class="timer-badge">TIMED</span>
        <strong>{{ timerKey }}</strong> running for
        <span class="timer-value">{{ (timerElapsed / 1000).toFixed(1) }}s</span>
        <button class="btn btn-danger" @click="stopTimer()">Stop &amp; Send Duration</button>
      </div>
    </section>

    <section class="section">
      <h2>History-Mode SPA Pageview Tracking</h2>
      <p>
        These Nuxt links use the history-mode tracker
        (<code>pushState</code>/<code>popstate</code>). Opens in <strong>Events panel</strong>.
      </p>
      <div class="btn-grid">
        <NuxtLink to="/" class="btn btn-primary">Home</NuxtLink>
        <NuxtLink to="/about" class="btn btn-secondary">About</NuxtLink>
        <NuxtLink to="/products" class="btn btn-secondary">Products</NuxtLink>
        <NuxtLink to="/products/alpha" class="btn btn-secondary">Product: Alpha</NuxtLink>
        <NuxtLink to="/products/beta" class="btn btn-secondary">Product: Beta</NuxtLink>
      </div>
    </section>

    <section class="section">
      <div class="log-header">
        <h2>
          Custom Event Log <span class="count">{{ customEventLog.length }} events</span>
        </h2>
        <button class="btn btn-danger btn-sm" @click="clearLogs">Clear</button>
      </div>
      <div v-if="customEventLog.length === 0" class="empty">No custom events tracked yet.</div>
      <div v-else class="log-table">
        <div class="log-row log-row-header">
          <span>Time</span><span>Action</span><span>Data</span>
        </div>
        <div v-for="entry in customEventLog" :key="entry.id" class="log-row">
          <span class="log-ts">{{ entry.ts }}</span>
          <span class="log-action"
            ><span class="badge" :class="typeBadge(entry.action)">{{ entry.action }}</span></span
          >
          <span class="log-data">{{ JSON.stringify(entry.data) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
  color: #1a1a2e;
}
.hero {
  text-align: center;
  padding: 3rem 1rem 2rem;
}
.hero h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #555;
  max-width: 680px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}
.subtitle code {
  background: #eef2ff;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.85rem;
}
.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1.2rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition:
    background 0.15s,
    transform 0.1s;
}
.btn:active {
  transform: scale(0.97);
}
.btn-primary {
  background: #4f46e5;
  color: #fff;
}
.btn-primary:hover {
  background: #4338ca;
}
.btn-secondary {
  background: #e5e7eb;
  color: #1a1a2e;
}
.btn-secondary:hover {
  background: #d1d5db;
}
.btn-accent {
  background: #0d9488;
  color: #fff;
}
.btn-accent:hover {
  background: #0f766e;
}
.btn-danger {
  background: #ef4444;
  color: #fff;
}
.btn-danger:hover {
  background: #dc2626;
}
.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}

.section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  scroll-margin-top: 6rem;
}
.section h2 {
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section p {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.section p code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82rem;
}

.toggle-row {
  margin-bottom: 1rem;
}
.toggle-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  background: #fff;
  color: #374151;
  transition: all 0.15s;
}
.toggle-btn.on {
  border-color: #16a34a;
  color: #16a34a;
  background: #f0fdf4;
}
.toggle-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.mode-badge {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.mode-badge.on {
  background: #dcfce7;
  color: #166534;
}
.mode-badge.off {
  background: #dbeafe;
  color: #1e40af;
}

.hash-navbar {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.hash-navbar a {
  flex: 1;
  text-align: center;
  padding: 0.55rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f9fafb;
  color: #374151;
  cursor: pointer;
  text-decoration: none;
  border-right: 1px solid #e5e7eb;
  transition: background 0.15s;
}
.hash-navbar a:last-child {
  border-right: none;
}
.hash-navbar a.active {
  background: #4f46e5;
  color: #fff;
}
.hash-navbar a:hover:not(.active) {
  background: #eef2ff;
}

.current-route {
  font-size: 0.82rem;
  color: #6b7280;
  margin-bottom: 1rem;
  padding: 0.35rem 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
}
.tracking-on {
  color: #16a34a;
  font-weight: 600;
}

.hash-page-content {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.hash-page {
  padding: 1.25rem;
  background: #fafbfd;
}
.hash-page h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.hash-page p {
  color: #555;
  font-size: 0.88rem;
  margin-bottom: 0.75rem;
}
.hash-page p code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.hash-products {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.hash-product-link {
  padding: 0.6rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #4f46e5;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 0.15s;
}
.hash-product-link:hover {
  border-color: #4f46e5;
  background: #eef2ff;
}

.back-link {
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
}
.back-link:hover {
  text-decoration: underline;
}

.hash-disabled-note {
  color: #9ca3af;
  text-align: center;
  padding: 3rem 1rem;
  font-size: 0.9rem;
}

.btn-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.timer-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: #fef9c3;
  border-radius: 8px;
  border: 1px solid #fde047;
}
.timer-badge {
  background: #eab308;
  color: #fff;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.timer-value {
  font-family: 'SF Mono', monospace;
  font-weight: 700;
  color: #92400e;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.log-header h2 {
  margin-bottom: 0;
}
.count {
  font-size: 0.8rem;
  font-weight: 400;
  color: #9ca3af;
}
.empty {
  color: #9ca3af;
  font-size: 0.875rem;
}

.log-table {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
.log-row {
  display: flex;
  border-bottom: 1px solid #f3f4f6;
  padding: 0.35rem 0.6rem;
  gap: 0.5rem;
}
.log-row:last-child {
  border-bottom: none;
}
.log-row-header {
  font-weight: 600;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.7rem;
  text-transform: uppercase;
}
.log-ts {
  width: 80px;
  flex-shrink: 0;
  color: #6a9955;
}
.log-action {
  width: 130px;
  flex-shrink: 0;
}
.log-data {
  flex: 1;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
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
