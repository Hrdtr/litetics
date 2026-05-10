<script setup lang="ts">
const { $tracker } = useNuxtApp();

const lastTracked = ref('none');

function trigger(action: string, extra?: Record<string, unknown>) {
  $tracker.value.track(action, { type: action, page: 'about', ...extra, ts: Date.now() });
  lastTracked.value = `${action} @ ${new Date().toLocaleTimeString()}`;
}

onMounted(() => {
  lastTracked.value = 'pageview sent by tracker.register() (onNavigate)';
});
</script>

<template>
  <div class="page">
    <h1>About</h1>
    <p class="lead">
      This page demonstrates that <strong>pageviews are tracked automatically</strong>. The
      <code>createTracker</code> plugin registered on mount, wrapping
      <code>history.pushState / replaceState</code> and <code>popstate</code>. Every Nuxt navigation
      triggers the <code>onNavigate</code> hook, sending an unload beacon for the previous page and
      a fresh load beacon for this one.
    </p>

    <p class="lead">
      Last tracked: <code>{{ lastTracked }}</code>
    </p>

    <section class="section">
      <h2>About Page Custom Events</h2>
      <p>These buttons track custom events scoped to this page.</p>
      <div class="btn-grid">
        <button class="btn btn-primary" @click="trigger('subscribe', { source: 'about_page' })">
          Subscribe to Newsletter
        </button>
        <button class="btn btn-secondary" @click="trigger('contact_click', { method: 'email' })">
          Contact via Email
        </button>
        <button class="btn btn-secondary" @click="trigger('contact_click', { method: 'twitter' })">
          Contact via Twitter
        </button>
        <button class="btn btn-secondary" @click="trigger('scroll_depth', { pct: 50 })">
          50% Scrolled
        </button>
        <button class="btn btn-secondary" @click="trigger('scroll_depth', { pct: 90 })">
          90% Scrolled
        </button>
      </div>
    </section>

    <NuxtLink to="/" class="btn btn-outline">&larr; Back to Home</NuxtLink>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
  color: #1a1a2e;
}
h1 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}
.lead {
  color: #555;
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
.lead code {
  background: #eef2ff;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.section h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.section p {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
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
.btn-outline {
  background: transparent;
  color: #4f46e5;
  border: 1.5px solid #4f46e5;
  margin-top: 1rem;
}
.btn-outline:hover {
  background: #eef2ff;
}
</style>
