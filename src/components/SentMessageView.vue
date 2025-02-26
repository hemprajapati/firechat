<template>
  <div class="relative !p-0">
    <div class="absolute top-1 -left-7">
    <Transition name="slide-fade">
      <Toast v-if="copied" message="Message Copied Successfully ✅  !!"/>
      </Transition>
      <DropDown
        classes="right-0"
        :options="options"
        @onClick="handleDropDownClick"
      />
    </div>
    <div
      class="bg-slate-300/30 text-gray-600/80 px-4 py-3 font-semibold rounded-t-xl rounded-l-xl"
    >
      <span v-html="message"></span>
      <div
        class="flex justify-end items-center !text-gray-600/85 space-x-2 pe-1 mt-1.5"
      >
        <Clock class="text-xs font-normal !text-gray-600/85" />
        <span class="text-xs font-normal">{{ getTime() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import Clock from "./icons/Clock.vue";
import DropDown from "./DropDown.vue";
import { deleteMessage } from "@/api/chat";
import { useClipboard } from "@/composables/CopyText";
import Toast from "./Toast.vue";
const emit = defineEmits(["onMessageDelete"]);
const { copied, error, copyToClipboard } = useClipboard();

const options = [
  {
    u_id:1,
    label: "Copy",
  },
  {
    u_id:2,
    label: "Delete for Everyone",
    isDanger: true,
  },
];
const props = defineProps({
  messageId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },

});
const handleDropDownClick = async(actionId) =>{
  if (actionId ===1) {
    await copyToClipboard(props.message)
  }
  if(actionId== 2 ) {
    await deleteMessage(props.messageId);
    emit('onMessageDelete', props.messageId);
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
