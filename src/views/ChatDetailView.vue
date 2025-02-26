<template>
  <div class="flex flex-col border-l border-r border-slate-200/70  w-full h-screen overflow-x-hidden">
    <Topbar :activeChatUserInfo='activeChatUserInfo'/>
    <Chat :activeChatUserId='activeChatUserInfo.uid' />
  </div>
</template>
<script setup>
import Chat from "@/components/Chat.vue";
import Topbar from "@/components/Topbar.vue";
import { onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { getActiveChatUserInfo } from "@/api/chat";
const activeChatUserInfo = reactive({})
const route = useRoute()

const fetchActiveChatUserInfo = async (id) => {
  if (!id) return;
  const data = await getActiveChatUserInfo(id);
  if (data.length > 0) {
    Object.assign(activeChatUserInfo, data[0]);
  }
};

watch(() => route.params.id, fetchActiveChatUserInfo);
onMounted(() => fetchActiveChatUserInfo(route.params.id));

</script>
<style>
.container {
  max-width: 1536px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  background-color: #fff;
}
</style>
