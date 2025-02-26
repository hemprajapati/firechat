<template>
    <div class="flex justify-center items-center gap-2">
      <div class="w-2 h-6 rounded-lg bg-indigo-300 animate-loading" style="animation-delay: 0s"></div>
      <div class="w-2 h-6 rounded-lg bg-indigo-300 animate-loading" style="animation-delay: 0.5s"></div>
      <div class="w-2 h-6 rounded-lg bg-indigo-300 animate-loading" style="animation-delay: 1s"></div>
    </div>
  </template>
  
  <script setup></script>
  
  <style scoped>
  @keyframes loading {
    20% {
      transform: scale(1.8);
    }
    40% {
      transform: scale(1);
    }
  }
  
  .animate-loading {
    animation: loading 1.8s ease-in-out infinite;
  }
  </style>