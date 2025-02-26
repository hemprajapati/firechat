<template>
  <div
    class="py-4 px-6 border-b border-gray-300/80 flex justify-between items-center"
  >
    <div class="flex justify-center items-center space-x-4">
      <div
        class="h-10 w-10 rounded-full overflow-hidden shrink-0 bg-indigo-300 border-2 border-indigo-400/20 flex justify-center items-center"
      >
        <span
          class="!tracking-tighter block font-extrabold text-base text-gray-800"
        >
          {{
            capitalize(
              activeChatUserInfo.firstName && activeChatUserInfo.firstName[0]
            )
          }}
          {{
            capitalize(
              activeChatUserInfo.lastName && activeChatUserInfo.lastName[0]
            )
          }}
        </span>
      </div>
      <h1 class="text-lg font-bold text-slate-700">
        {{ capitalize(activeChatUserInfo.firstName) }}
        {{ capitalize(activeChatUserInfo.lastName) }}
      </h1>
      <!-- <span
        class="-ms-1.5 mt-0.5 h-2 w-2 rounded-full inline-block bg-emerald-700"
      ></span> -->
    </div>
    <!-- <div class="flex space-x-4">
      <Phone
        class="hover:text-violet-500 hover:fill-violet-500 hover:cursor-pointer"
      />
      <Camera
        class="hover:text-violet-500 hover:fill-violet-500 hover:cursor-pointer"
      />
      <Group
        class="hover:text-violet-500 hover:fill-violet-500 hover:cursor-pointer"
      />
    </div> -->
  </div>
</template>

<script setup>
import Camera from "./icons/Camera.vue";
import Group from "./icons/Group.vue";
import Phone from "./icons/Phone.vue";
import { capitalize } from "@/utils/capitalize";

const props = defineProps({
  activeChatUserInfo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
