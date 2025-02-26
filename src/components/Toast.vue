<template>
    <Transition name="slide-fade">
        <div class="fixed top-0 right-0 flex justify-end">
            <div class="!m-5 ">
                <div class="py-4 px-6 bg-green-700 rounded-md"
                  :class="{'bg-red-600': variant=== 'danger'}">
                    <h1 class="text-white text-base font-bold">{{ message }}</h1>
                </div>
            </div>
        </div>
      </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
const show =ref(false)
const props = defineProps({
    message: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
  }
});
onMounted(()=>{
  show.value = true
  setTimeout(() => (show.value = false), 2000); 

})
</script>

<style >
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>