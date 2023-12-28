<template>
  <div class="auth">
    <h1 class="auth__header">
      Регистрация
    </h1>
    <form method="post" class="auth__form" @submit.prevent="register()">
      <auth-form-input
        :value="name"
        name="name"
        label="Имя"
        autocomplete="name"
        :required="true"
        @auth-input="(newVal)=>name=newVal"
      />
      <auth-form-input
        :value="email"
        name="email"
        label="Email"
        autocomplete="email"
        :required="true"
        @auth-input="(newVal)=>email=newVal"
      />
      <auth-form-input
        name="password"
        :value="password"
        label="Пароль"
        type="password"
        :required="true"
        @auth-input="(newVal)=>password=newVal"
      />
      <auth-form-input
        name="clientId"
        :value="clientId"
        label="ClientID"
        type="text"
        :required="true"
        @auth-input="(newVal)=>clientId=newVal"
      />
      <input type="submit" value="Регистрация" class="auth__form-submit">
      <NuxtLink to="/login" class="auth__form-submit --outline">
        Войти
      </NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user"

definePageMeta({
  layout: 'auth',
})
const userStore = useUserStore()
const name = ref('')
const email = ref('')
const password = ref('')
const clientId = ref('')

async function register () {
  const registrationData = {
    name: name.value,
    login: email.value,
    password: password.value,
    clientId: clientId.value,
  }
  const refreshToken = await userStore.register(registrationData)
  const config = useRuntimeConfig()
  const cookie = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME, { maxAge: 30 * 60 * 60 * 90 })
  cookie.value = refreshToken
}
</script>

<style lang="scss">
@import "assets/styles/page/auth";
</style>
