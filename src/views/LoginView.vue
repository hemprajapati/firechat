<template>
  <div class="h-screen flex justify-between items-center">
    <div class="hidden lg:w-1/2 lg:block h-screen">
      <img src="../assets/bg.png" class="h-screen w-full object-cover" />
    </div>
    <div class="w-full lg:w-1/2 flex justify-center items-center h-screen bg-white">
      <Form
        :validation-schema="validationSchema"
        @submit="onSubmit"
        class="flex flex-col space-y-3 w-full mx-6 max-w-xl p-12 bg-white border-gray-200/80 rounded-xl"
      >
        <h2 class="font-bold text-2xl text-gray-700">Log in</h2>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email address"
          label="Email"
        />
        <Password
          name="password"
          type="password"
          placeholder="Enter your password"
          label="Password"
        />
        <button
          class="my-4 block font-semibold bg-indigo-500 hover:bg-indigo-500/90 text-white py-3 rounded-sm mt-5 hover:cursor-pointer"
          type="submit"
        >
          <span v-if="loading"> Loading... </span>
          <span v-else> Submit </span>
        </button>
        <p class="text-gray-400">
          I Dont have an account ?
          <RouterLink to="/sign-up">Sign up</RouterLink>
        </p>
      </Form>
      <Toast v-if="error" :message=errorMessage variant="danger" />
    </div>
  </div>
</template>
<script setup>
import { Form } from "vee-validate";
import { signIn } from "@/api/auth";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import Input from "@/components/Form/Input.vue";
import Password from "@/components/Form/Password.vue";
import router from "@/router";
import { ref } from "vue";
import Toast from "@/components/Toast.vue";
const error =ref(false)
const errorMessage = ref('')
const loading = ref(false);
const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string({ errorMap: () => ( { message: 'Email must be enter characters' } ) }).trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Must be a valid email" }),
    password: zod
      .string({ errorMap: () => ( { message: 'Password name must be enter characters' } ) }).trim()
      .max(15, { message: "Password can not be larger then 15 characters" })
      .min(8, { message: "Password can not be less then 8 characters" }),
  })
);
const onSubmit = async (values) => {
  const { email, password } = values;
  try {
    loading.value = true;
    const data = await signIn(email, password); 
    console.log("data",data);
    
    if (data.user) {
      await router.push("/chat");
    }
  } catch (e) {
    error.value = true
    errorMessage.value = e.code.split("/")[1]
    setTimeout(()=>error.value = false,2000)
    
  } finally {
    loading.value = false;
  }
};
</script>
