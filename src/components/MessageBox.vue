<template>
  <div
    class="relative border-t border-gray-200/60 py-4 px-3 bottom-0 w-full flex justify-between items-end space-x-3.5"
  >
    <textarea
      v-model="message"
      class="w-full overflow-auto resize-none !max-h-72 bg-indigo-200/20 focus:border-0 outline-2 outline-indigo-800/30 focus:outline-indigo-700/40 !p-2 rounded-md placeholder:font-semibold placeholder:text-[16px]"
      :style="{ height: `${height}px` }"
      @keydown.enter.exact.prevent="handleSendMessage"
      @input="handleInput"
      placeholder="Write your message here..."
    ></textarea>
    <div class="flex flex-col items-stretch h-full justify-around">
      <div class="relative" ref="emojiRef">
        <button @click="toggleEmojiPicker">
          <Face/>
        </button>
        <EmojiPicker
          v-if="isOpen"
          class="absolute bottom-0 right-0"
          :native="true"
          @select="onSelectEmoji"
        />
      </div>
      <button
        class="hover:cursor-pointer"
        @click="handleSendMessage"
        :disabled="message.length < 1"
      >
        <Send
          class="transition-all duration-300 ease-linear"
          :class="{
            'fill-gray-100': message.length <= 0,
            'hover:fill-violet-500 hover:text-gray-100 hover:scale-150':
              message.length > 0,
          }"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import Send from "./icons/Send.vue";
import { sendMessage } from "@/api/chat";
import { useRoute } from "vue-router";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import Face from "./icons/Face.vue";
const emit = defineEmits(["onHeightChange", "onSendMessage"]);
const route = useRoute();
const message = ref("");
const emojiRef = ref(null);
const baseFontSize = 14;
const lineHeight = Math.ceil(baseFontSize * (1 / 0.7));
const minHeight = lineHeight * 3.2;
const height = ref(minHeight);
const isOpen = ref(false);
const handleInput = (event) => {
  const textarea = event.target;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
  height.value = textarea.scrollHeight;
};
watch(
  () => route.params.id,
  () => {
    message.value = "";
  }
);
const handleClickOutside = (event) => {
  if (
    emojiRef.value &&
    isOpen.value &&
    !emojiRef.value.contains(event.target)
  ) {
    isOpen.value = false;
  }
};
const toggleEmojiPicker = () => {
  isOpen.value = !isOpen.value;
};
const onSelectEmoji = (emoji) => {
  const textarea = document.querySelector("textarea");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  message.value = message.value.substring(0, start) + emoji.i + message.value.substring(end);
  setTimeout(() => {
    textarea.setSelectionRange(start + emoji.i.length, start + emoji.i.length);
    textarea.focus();
  }, 0);
};
onMounted(() => {
  height.value = minHeight;
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
const formattedText = computed(() => {
  return message.value.replace(/ /g, "&nbsp;").replace(/\n/g, "<br>");
});
const handleSendMessage = async () => {
  const textToSend = formattedText.value;
  message.value = "";
  height.value = minHeight;
  if (textToSend.length > 0) {
    await sendMessage({ message: textToSend, sendTo: route.params.id });
  }
};
</script>

<style lang="scss" scoped></style>
