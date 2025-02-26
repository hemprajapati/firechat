<template>
  <div class="relative">
      <Toast v-if="copied" message="Message Copied Successfully ✅  !!"/>
    <div
      class="bg-violet-500/75 px-4 py-3 text-stone-100 font-semibold rounded-t-xl rounded-r-xl"
    >
      <span class="word-erp" v-html="message"></span>
      <div
        class="flex justify-end items-center !text-stone-100 space-x-1  mt-0.5"
      >
        <Clock class="text-xs font-normal" />
        <span class="text-xs font-normal">{{ getTime() }}</span>
      </div>
    </div>

    <div class="absolute top-1 -right-7">
      <DropDown
      classes="left-0"
      :options="options"
      @onClick="handleOnClick" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import Clock from "./icons/Clock.vue";
import DropDown from "./DropDown.vue";
import { useClipboard } from '@/composables/CopyText';
import Toast from "./Toast.vue";
const { copied, error, copyToClipboard } = useClipboard();
const options = [
  {
    u_id: 1,
    label: "Copy",
  },
];
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});
const handleOnClick = async(id) =>{
  if (id ===1) {
    await copyToClipboard(props.message)
  }
}
const getTime = () => {
  const date = new Date(props.time);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
</script>

<style scoped></style>
