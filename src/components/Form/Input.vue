<template>
    <div class="my-2 w-full">
      <label :for="name" class="mb-1 block text-gray-500 font-semibold"> {{label}} </label>
        <Field
        :name="name"
        :type="name"
        :placeholder="placeholder"
        class="w-full form-field"
        @keydown.space.exact.prevent
        />
        <ErrorMessage class="error-msg" :name="name" />
    </div>
</template>

<script setup>
import { Field, ErrorMessage } from "vee-validate";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  }
});
</script>

<style scoped></style>
