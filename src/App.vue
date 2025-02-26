<script setup>
import { RouterView, useRoute } from 'vue-router'
import LayoutSidebar from '@/layouts/LayoutSidebar.vue';
import LayoutDefault from '@/layouts/LayoutDefault.vue';

import { computed } from 'vue';
const route = useRoute();
const layout = computed(() => {
  return route.meta.layout === 'LayoutSidebar' ? LayoutSidebar : LayoutDefault;
});
</script>

<template>
  <component :is="layout">
    <!-- <router-view /> -->
    <RouterView />
  </component>
</template>

<style scoped>
</style>
