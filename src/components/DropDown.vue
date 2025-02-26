<template>
  <div class="" ref="dropdownRef">
    <div class="py-0.5 hover:cursor-pointer relative" @click="isOpen = !isOpen">
      <Ellipsis />
    </div>
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="min-w-max bg-white border border-gray-300/40 z-20 rounded-md absolute top-4 shadow-lg"
        :class="classes"
      >
        <div
          v-for="(item, index) in options"
          :key="index"
          class="hover:bg-gray-200/70 hover:cursor-pointer"
          :class="{ 'hover:bg-red-200/50': item.isDanger }"
          @click="handleClick(item.u_id)"
        >
          <span
            class="block px-6 py-2 text-sm font-medium"
            :class="{ 'font-semibold text-red-700': item.isDanger }"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import Ellipsis from "./icons/Ellipsis.vue";
const dropdownRef = ref(null);
const isOpen = ref(false);
const emit = defineEmits(["onClick"]);

const props = defineProps({
  classes: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});
const handleClickOutside = (event) => {
  if (
    dropdownRef.value &&
    isOpen.value &&
    !dropdownRef.value.contains(event.target)
  ) {
    isOpen.value = false;
  }
};
const handleClick =(id)=>{
  isOpen.value = false;
  emit('onClick',id)
}
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped></style>
