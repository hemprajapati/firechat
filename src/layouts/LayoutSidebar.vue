<template>
  <div class="flex">
    <Sidebar />
    <slot />
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
</script>

<style scoped></style>
