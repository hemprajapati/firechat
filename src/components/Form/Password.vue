<template>
  <div class="my-2">
    <label :for="name" class="mb-1 block text-gray-500 font-semibold"> {{label}} </label>
    <div class="flex justify-between w-full relative">
        <Field 
        :name="name" 
        :type="currentFieldType" 
        :placeholder="placeholder"
        class="form-field"
        />
        <div class="absolute h-full flex justify-center items-center right-2">
            <Eye class="text-gray-400" v-if="!isToggle" @click="handleToggle" />
            <EyeClose class="text-gray-600" v-else @click="handleToggle" />
        </div>
    </div>
    <ErrorMessage class="error-msg" :name="name" />
  </div>
</template>

<script setup>
import { Field, ErrorMessage } from "vee-validate";
import { onMounted, ref } from "vue";
import Eye from "../icons/Eye.vue";
import EyeClose from "../icons/EyeClose.vue";

const currentFieldType = ref(null);
const isToggle = ref(false);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder:{
    type: String,
    required: true,
  },
  label:{
    type: String,
    required: true,
  }
});

const handleToggle = () => {
    isToggle.value = !isToggle.value;
    currentFieldType.value = isToggle.value ? 'text' : 'password';
};

onMounted(() => {
    currentFieldType.value = props.type;
});
</script>
