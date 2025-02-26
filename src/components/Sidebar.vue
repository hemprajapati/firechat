<template>
  <div
    class="shrink-0 w-full sm:w-56 md:w-72 lg:w-96 h-screen pt-6 bg-indigo-50/60 flex flex-col border-r border-r-indigo-700/10"
  >
    <div class="px-3">
      <h2 class="text-lg font-bold">Chats</h2>
      <div
        class="mt-3 bg-indigo-100/70 border-2 border-indigo-200/20 flex justify-between items-center py-3 px-3 space-x-1.5 rounded-sm"
      >
        <span class="block shrink-0">
          <Search class="text-indigo-500/80" />
        </span>
        <input
          v-model="searchTerm"
          class="flex-1 focus:outline-0 font-semibold text-sm tracking-wide placeholder:text-gray-600/70"
          placeholder="Search users..."
          @input="filterUsers"
        />
      </div>
    </div>
    <div class="mt-10 flex-1 overflow-auto">
      <div class="h-full flex justify-center items-center" v-if="loading">
        <Loader />
      </div>
      <div
        v-else
        v-for="(item, index) in filteredUsers"
        :key="index"
        class="flex-1 flex justify-between items-center w-full space-x-3 hover:bg-indigo-200/25 py-4 hover:cursor-pointer select-none"
        :class="{
          'bg-indigo-200/80 hover:bg-indigo-200/80':
            route.params.id === item.id,
        }"
        @click="openChat(item.id)"
      >
        <div
          class="relative ms-4 h-12 w-12 rounded-full shrink-0 bg-indigo-300 border-2 border-indigo-400/20 flex justify-center items-center"
        >
          <span class="!tracking-tighter block font-bold text-lg text-gray-800">
            {{ capitalize(item.firstName.charAt(0)) }}
            {{ capitalize(item.lastName.charAt(0)) }}
          </span>
          <span
            v-if="item.isOnline"
            class="absolute right-0 -bottom-1 border-2 border-white h-4 w-4 rounded-full bg-emerald-700"
          ></span>
        </div>
        <div class="truncate-text">
          <p
            class="font-semibold truncate-text text-gray-700"
            :class="{ '!font-extrabold': newMessageCounts[item.id] > 0 }"
          >
            {{ capitalize(item.firstName) }} {{ capitalize(item.lastName) }}
          </p>
        </div>
        <div class="shrink-0 me-4">
          <span
            v-if="newMessageCounts[item.id] && route.params.id != item.id"
            class="h-6 w-6 bg-indigo-300 rounded-full flex items-center justify-center font-bold"
          >
            {{ newMessageCounts[item.id] }}
          </span>
          
        </div>
      </div>
    </div>
    <div class="bg-indigo-100 flex justify-between items-center">
      <div class="h-full flex items-center space-x-2">
        <div
          class="h-full w-14 rounded-r-lg flex justify-center items-center font-bold text-lg bg-indigo-500/90 text-white"
          style="letter-spacing: -2px !important"
        >
          {{
            loginUserInfo.firstName &&
            capitalize(loginUserInfo.firstName.charAt(0))
          }}
          {{
            loginUserInfo.lastName &&
            capitalize(loginUserInfo.lastName.charAt(0))
          }}
        </div>
        <div>
          <span class="block font-semibold text-gray-700"
            >{{ capitalize(loginUserInfo.firstName) }}
            {{ capitalize(loginUserInfo.lastName) }}</span
          >
          <span class="block max-w-20 md:max-w-44 truncate text-sm">{{
            loginUserInfo.email
          }}</span>
        </div>
      </div>
      <button
        class="py-3 px-2 flex space-x-4 items-center text-base text-indigo-700 hover:cursor-pointer"
        @click="isModalOpen = true"
      >
        <Logout
          class="text-indigo-500 hover:fill-indigo-200 hover:text-indigo-800 hover:scale-110 transition-all"
        />
      </button>
    </div>
    <Transition name="slide-up">
      <div
        v-if="isModalOpen"
        class="fixed h-screen w-screen top-0 backdrop-blur-xs z-50 flex justify-center items-center"
      >
        <div
          class="border border-gray-300 shadow-sm shadow-indigo-200 p-8 rounded-xl bg-white"
        >
          <h1 class="text-2xl font-bold text-indigo-400">
            Are you sure to Logout ?
          </h1>
          <div class="flex justify-end items-center mt-8 gap-2">
            <button
              class="text-indigo-900 text-lg py-2 px-5 cursor-pointer"
              @click="isModalOpen = false"
            >
              cancel
            </button>
            <button
              class="bg-indigo-400 border border-indigo-400 py-2 px-5 rounded-md text-white text-lg font-semibold cursor-pointer"
              @click="handleLogout"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import Search from "./icons/Search.vue";
import { getAllUsers, getLoginUser } from "@/api/users";
import Loader from "./icons/Loader.vue";
import router from "@/router";
import { capitalize } from "@/utils/capitalize";
import { useRoute } from "vue-router";
import Logout from "./icons/Logout.vue";
import { signOut } from "@/api/auth";
import { listenForNewMessages } from "@/api/chat";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";

const loading = ref(true);
const users = ref([]);
const searchTerm = ref("");
const route = useRoute();
const isModalOpen = ref(false);
const newMessageCounts = ref({});
const loginUserInfo = ref({});
onMounted(() => {
  getAllUsers().then((data) => {
    users.value = data;
    loading.value = false;
    users.value.forEach((user) => {
      listenForNewMessages(user.id, handleNewMessage);
      // Listen for real-time updates to the user's online status
      onSnapshot(doc(db, "users", user.id), (doc) => {
        const userData = doc.data();
        if (userData) {
          const userIndex = users.value.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            users.value[userIndex].isOnline = userData.isOnline;
          }
        }
      });
    });
  });
  getLoginUser().then((data) => (loginUserInfo.value = data.user));
  if (route.params.id) {
    newMessageCounts.value[route.params.id] = 0;
  }
});

const handleLogout = async () => {
  await signOut();
  router.push(`/sign-in`);
};

const openChat = (id) => {
  newMessageCounts.value[id] = 0;
  router.push(`/chat/${id}`);
};

const filterUsers = () => {
  getAllUsers(searchTerm.value).then((data) => {
    users.value = data;
    loading.value = false;
  });
};

const filteredUsers = computed(() => {
  if (!searchTerm.value) {
    return users.value;
  }
  return users.value.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.value.toLowerCase());
  });
});

const handleNewMessage = (change) => {
  const { type, message } = change;
  if (type === "added" && message.timestamp > Date.now() - 10000) {
    if (!newMessageCounts.value[message.senderId]) {
      newMessageCounts.value[message.senderId] = 0;
    }
    if (route.params.id !== message.senderId) {
      newMessageCounts.value[message.senderId]++;
    }
  }
};
</script>

<style scoped>
.truncate-text {
  display: block !important;
  width: 100% !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
