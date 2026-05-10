<script setup lang="ts">
const { $tracker } = useNuxtApp();

const products = [
  {
    id: 'alpha',
    name: 'Alpha Widget',
    price: '$29',
    desc: 'The flagship product. Fast, reliable, and loved by devs.',
  },
  {
    id: 'beta',
    name: 'Beta Engine',
    price: '$49',
    desc: 'Advanced analytics engine for enterprise workloads.',
  },
  {
    id: 'gamma',
    name: 'Gamma Toolkit',
    price: '$19',
    desc: 'Lightweight toolkit for quick integrations.',
  },
  {
    id: 'delta',
    name: 'Delta DB',
    price: '$79',
    desc: 'High-performance database with real-time sync.',
  },
  {
    id: 'epsilon',
    name: 'Epsilon AI',
    price: '$99',
    desc: 'AI-powered insights and recommendations.',
  },
];

const viewed = ref<string[]>([]);

function viewProduct(id: string) {
  if (!viewed.value.includes(id)) viewed.value.push(id);
  $tracker.value.track('product_view', {
    type: 'product_view',
    productId: id,
    list: 'products_page',
  });
}
</script>

<template>
  <div class="page">
    <h1>Products</h1>
    <p class="lead">
      Each product page navigation is detected by the tracker as a full SPA page transition (unload
      old page + load new page). Click on any product to navigate.
    </p>
    <p v-if="viewed.length" class="viewed">Viewed: {{ viewed.join(', ') }}</p>
    <div class="grid">
      <div v-for="p in products" :key="p.id" class="card">
        <h3>{{ p.name }}</h3>
        <span class="price">{{ p.price }}</span>
        <p>{{ p.desc }}</p>
        <NuxtLink :to="`/products/${p.id}`" class="btn btn-primary" @click="viewProduct(p.id)">
          View Details &rarr;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
  color: #1a1a2e;
}
h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.lead {
  color: #555;
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
.viewed {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card h3 {
  font-size: 1rem;
  margin: 0;
}
.card .price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4f46e5;
}
.card p {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0;
  flex: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
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
</style>
