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
        <h2 class="font-bold text-2xl text-gray-700">Create an account</h2>
        <div class="flex justify-between items-start !m-0 space-x-7">
          <Input
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            label="First name"
          />
          <Input
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            label="Last name"
          />
        </div>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email address"
          label="Email"
        />
        <Password
          name="password"
          type="password"
          placeholder=" Enter your password"
          label="Password"
        />
        <Password
          name="rePassword"
          type="password"
          placeholder=" Enter your password again"
          label="Re password"
        />
        <button
          class="my-4 block font-semibold bg-indigo-500 hover:bg-indigo-500/90 text-white py-3 rounded-sm mt-5 hover:cursor-pointer"
          type="submit"
        >
        <span v-if="loading"> Loading... </span>
        <span v-else> Submit </span>
        </button>
        <p class="text-gray-400">
          Already have an account ?
          <RouterLink to="/sign-in">Log in</RouterLink>
        </p>
      </Form>
    </div>
    <Toast v-if="error" :message="errorMessage" variant="danger" />
  </div>
</template>
<script setup>
import { Form } from "vee-validate";
import { signUp } from "@/api/auth";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import Input from "@/components/Form/Input.vue";
import Password from "@/components/Form/Password.vue";
import router from "@/router";
import { ref } from "vue";
import Toast from "@/components/Toast.vue";
const error =ref(false)
const errorMessage = ref('')
const loading =ref(false)
const validationSchema = toTypedSchema(
  zod
    .object({
      firstName: zod
        .string( { errorMap: () => ( { message: 'First name must be enter characters' } ) })
        .min(3, { message: "First name must be at least 3 characters" })
        .max(12, { message: "First name can not be larger then 12 characters" })
        .regex(/^[a-zA-Z]+$/, "No special characters,space or digits allowed"),
      lastName: zod
        .string({ errorMap: () => ( { message: 'Last name must be enter characters' } ) })
        .min(3, { message: "Last name  must be at least 3 characters" })
        .max(12, { message: "Last name can not be larger then 12 characters" })
        .regex(/^[a-zA-Z]*$/, "No special characters or digits allowed"),
      email: zod
        .string({ errorMap: () => ( { message: 'Email  must be enter characters' } ) })
        .min(1, { message: "Email is is required" })
        .email({ message: "Must be a valid email" }),
      password: zod
        .string({ errorMap: () => ( { message: 'Password must be enter characters' } ) })
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password can not be less then 8 characters" })
        .max(15, { message: "Password can not be larger then 15 characters" }),
      rePassword: zod
        .string({ errorMap: () => ( { message: 'Repassword must be enter characters' } ) })
        .min(8, { message: "Confirm Password must be at least 8 characters" })
        .max(15, {
          message: "Confirm Password cannot be more than 15 characters",
        }),
    })
    .superRefine(({ password, rePassword }, ctx) => {
      if (password !== rePassword) {
        ctx.addIssue({
          path: ["rePassword"],
          message: "Passwords must match",
          code: zod.ZodIssueCode.custom,
        });
      }
    })
);
const onSubmit = async (values) => {
  try {
    loading.value = true;
    const user = await signUp(values);
    if (user) {
      await router.push("/chat");
    }
  } catch (e) {
    console.log(e);
    if (e) {
      error.value = true
    errorMessage.value = e.code.split("/")[1]
      setTimeout(()=>error.value = false,2000)
    }
  }
  finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
