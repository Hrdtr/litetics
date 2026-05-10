<script setup lang="ts">
const route = useRoute();
const { $tracker } = useNuxtApp();

const id = route.params.id as string;

const details: Record<string, { name: string; price: string; desc: string }> = {
  alpha: {
    name: 'Alpha Widget',
    price: '$29',
    desc: 'The flagship product. Fast, reliable, and loved by devs worldwide.',
  },
  beta: {
    name: 'Beta Engine',
    price: '$49',
    desc: 'Advanced analytics engine for enterprise workloads with sub-ms latency.',
  },
  gamma: {
    name: 'Gamma Toolkit',
    price: '$19',
    desc: 'Lightweight toolkit for quick integrations. Works with any stack.',
  },
  delta: {
    name: 'Delta DB',
    price: '$79',
    desc: 'High-performance database with real-time sync and automatic failover.',
  },
  epsilon: {
    name: 'Epsilon AI',
    price: '$99',
    desc: 'AI-powered insights and recommendations. Built for scale.',
  },
};

const product = computed(() => details[id] ?? { name: id, price: '—', desc: 'Unknown product.' });

const viewedFeatures = ref<string[]>([]);
let featureTimerKey = '';

async function trackFeature(feature: string) {
  viewedFeatures.value.push(feature);
  $tracker.value.track('feature_view', { type: 'feature_view', feature, productId: id });
}

let cartCount = 0;

async function addToCart() {
  cartCount += 1;
  $tracker.value.track('add_to_cart', {
    type: 'add_to_cart',
    productId: id,
    productName: product.value.name,
    price: product.value.price,
    quantity: 1,
  });
  alert(`Added ${product.value.name} to cart! (${cartCount} items)`);
}

async function startPurchase() {
  featureTimerKey = `purchase_${id}`;
  await $tracker.value.track(
    featureTimerKey,
    { type: 'purchase_start', productId: id },
    { withDuration: true },
  );
  alert('Purchase flow started! (Timer is running — completing after 3 seconds)');
  setTimeout(async () => {
    await $tracker.value.trackEndOf(featureTimerKey);
    alert('Purchase completed! Duration beacon sent.');
    featureTimerKey = '';
  }, 3000);
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/products" class="back">&larr; All Products</NuxtLink>

    <div class="detail-card">
      <h1>{{ product.name }}</h1>
      <span class="price">{{ product.price }}</span>
      <p class="desc">{{ product.desc }}</p>

      <div class="actions">
        <button class="btn btn-primary" @click="addToCart">Add to Cart</button>
        <button class="btn btn-accent" @click="startPurchase">Start Purchase Flow (timed)</button>
      </div>
    </div>

    <section class="section">
      <h2>Feature Exploration</h2>
      <p>Each click sends a <code>feature_view</code> custom event with the feature name.</p>
      <div class="btn-grid">
        <button class="btn btn-secondary" @click="trackFeature('overview')">Overview</button>
        <button class="btn btn-secondary" @click="trackFeature('specs')">Specifications</button>
        <button class="btn btn-secondary" @click="trackFeature('reviews')">Reviews</button>
        <button class="btn btn-secondary" @click="trackFeature('pricing')">Pricing</button>
        <button class="btn btn-secondary" @click="trackFeature('docs')">Documentation</button>
        <button class="btn btn-secondary" @click="trackFeature('support')">Support</button>
      </div>
      <p v-if="viewedFeatures.length" class="viewed">Explored: {{ viewedFeatures.join(', ') }}</p>
    </section>

    <section class="section">
      <h2>Navigation Test</h2>
      <p>
        Navigate to another product detail page. The tracker will fire an unload beacon for
        <strong>/products/{{ id }}</strong> and a load beacon for the new page.
      </p>
      <div class="btn-grid">
        <NuxtLink
          v-for="pid in ['alpha', 'beta', 'gamma', 'delta', 'epsilon']"
          :key="pid"
          v-show="pid !== id"
          :to="`/products/${pid}`"
          class="btn btn-outline"
        >
          {{ pid }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
  color: #1a1a2e;
}
.back {
  display: inline-block;
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.back:hover {
  text-decoration: underline;
}

.detail-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.detail-card h1 {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}
.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #4f46e5;
  display: block;
  margin-bottom: 0.75rem;
}
.desc {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
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
  line-height: 1.6;
}
.section p code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82rem;
}
.viewed {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.5rem;
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
  transition: background 0.15s;
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
}
.btn-outline:hover {
  background: #eef2ff;
}
.btn-accent {
  background: #0d9488;
  color: #fff;
}
.btn-accent:hover {
  background: #0f766e;
}
</style>
