<template>
  <div class="flex flex-1 flex-col overflow-hidden relative">
    <div
      class="overflow-auto flex-1 py-4 px-5"
      ref="chatContainer"
      @scroll="handleScroll"
    >
      <div
        v-if="notification"
        class="absolute top-0 left-0 w-full p-2 z-10 text-center bg-indigo-400 text-base font-semibold text-white hover:cursor-pointer rounded-b-md shadow-gray-400/60 shadow-xl"
        @click="scrollToBottom"
      >
        You have a new messages
      </div>
      <TransitionGroup name="slide-up">
        <template v-for="(item, index) in chatMessages" :key="item.id">
          <div
            class="flex mt-1.5"
            :class="{
              'justify-end': item.senderId === currentUser,
              'justify-start': item.senderId !== currentUser,
              '!mt-10':
                index > 0 && chatMessages[index - 1].senderId !== item.senderId,
            }"
          >
            <SentMessageView
              v-if="item.senderId === currentUser"
              class="sm:max-w-3/5 word-erp px-4 py-3"
              :messageId="item.id"
              :message="item.message"
              :time="item.timestamp"
              @onMessageDelete="handleDeleteMessage"
            />
            <RecivedMessageView
              v-else
              class="max-w-3/5 word-erp"
              :message="item.message"
              :time="item.timestamp"
            />
          </div>
        </template>
      </TransitionGroup>
    </div>
  </div>
  <MessageBox
    @onHeightChange="scrollToBottom"
    @onSendMessage="handleSendMessage"
  />
</template>

<script setup>
import {
  ref,
  nextTick,
  onMounted,
  watch,
  watchEffect,
} from "vue";
import MessageBox from "./MessageBox.vue";
import SentMessageView from "./SentMessageView.vue";
import RecivedMessageView from "./RecivedMessageView.vue";
import { fetchMessages, listenForNewMessages, deleteMessage } from "@/api/chat";
import { getLoginUser } from "@/api/users";
import { useRoute } from "vue-router";

const chatContainer = ref(null);
const lastDoc = ref(null);
const route = useRoute();
const currentUser = ref(null);
const notification = ref(false);
const messageIds = new Set();
const isLoading = ref(false);

const props = defineProps({
  activeChatUserId: {
    type: String,
    required: true,
  },
});

watchEffect(async () => {
  const { user } = await getLoginUser();
  currentUser.value = user.uid;
});

const chatMessages = ref([]);

const scrollToBottom = () => {
  nextTick(() => {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    notification.value = false;
  });
};

const fetchAndSetMessages = async (userId) => {
  chatMessages.value = [];
  messageIds.clear();
  const { messages: newMessages, lastDoc: newLastDoc } = await fetchMessages(
    null,
    userId
  );
  chatMessages.value = newMessages;
  newMessages.forEach((message) => {
    if (!messageIds.has(message.id)) {
      messageIds.add(message.id);
    }
  });
  lastDoc.value = newLastDoc;
  nextTick(() => scrollToBottom());
};

const handleScroll = async () => {
  if(chatContainer.value.scrollTop+chatContainer.value.clientHeight >= chatContainer.value.scrollHeight-5) notification.value =false;
  
  if (chatContainer.value.scrollTop === 0 && !isLoading.value) {
    isLoading.value = true;
    await fetchMoreMessages(route.params.id);
    isLoading.value = false;
  }
};

const fetchMoreMessages = async (userId) => {
  const previousScrollHeight = chatContainer.value.scrollHeight;
  const { messages: newMessages, lastDoc: newLastDoc } = await fetchMessages(
    lastDoc.value,
    userId
  );
  newMessages.forEach((message) => {
    if (!messageIds.has(message.id)) {
      chatMessages.value.unshift(message);
      messageIds.add(message.id);
    }
  });
  lastDoc.value = newLastDoc;
  nextTick(() => {
    chatContainer.value.scrollTop =
      chatContainer.value.scrollHeight - previousScrollHeight;
  });
};

const handleDeleteMessage = async (messageId) => {
  chatMessages.value = chatMessages.value.filter(
    (message) => message.id !== messageId
  );
};

onMounted(async () => {
  let unsubscribe = listenForNewMessages(route.params.id, (change) => {
    const { type, message } = change;
    if (type === "added") {
      if (
        (message.sendTo === props.activeChatUserId &&
          message.senderId === currentUser.value) ||
        (message.sendTo === currentUser.value &&
          message.senderId === props.activeChatUserId)
      ) {
        if (!messageIds.has(message.id)) {
          chatMessages.value.push(message);
          messageIds.add(message.id);
          const isAtBottom =
            chatContainer.value.scrollHeight - chatContainer.value.scrollTop ===
            chatContainer.value.clientHeight;
          if (message.sendTo == currentUser.value && !isAtBottom) {
            notification.value = true;
          } else {
            scrollToBottom();
          }
        }
      }
    } else if (type === "removed") {
      chatMessages.value = chatMessages.value.filter(
        (msg) => msg.id !== message.id
      );
    }
  });

  watch(
    () => props.activeChatUserId,
    async (newUserId, oldUserId) => {
      if (oldUserId && unsubscribe) {
        unsubscribe();
      }
      chatMessages.value = [];
      messageIds.clear();
      lastDoc.value = null;
      await fetchAndSetMessages(newUserId);

      unsubscribe = listenForNewMessages(newUserId, (change) => {
        const { type, message } = change;
        if (type === "added") {
          if (
            (message.sendTo === newUserId &&
              message.senderId === currentUser.value) ||
            (message.sendTo === currentUser.value &&
              message.senderId === newUserId)
          ) {
            if (!messageIds.has(message.id)) {
              chatMessages.value.push(message);
              messageIds.add(message.id);
              scrollToBottom();
            }
          }
        } else if (type === "removed") {
          chatMessages.value = chatMessages.value.filter(
            (msg) => msg.id !== message.id
          );
        }
      });
    }
  );
});
</script>

<style></style>
