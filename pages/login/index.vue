<template>
  <div class="auth">
    <h1 class="auth__header">
      Вход
    </h1>
    <form method="get" class="auth__form" @submit.prevent="auth()">
      <auth-form-input
        :value="login"
        name="login"
        label="Логин"
        autocomplete="login"
        :required="true"
        @auth-input="(newVal)=>login=newVal"
      />
      <auth-form-input
        name="password"
        :value="password"
        label="Пароль"
        type="password"
        :required="true"
        autocomplete="password"
        @auth-input="(newVal)=>password=newVal"
      />
      <input type="submit" value="Вход" class="auth__form-submit">
      <NuxtLink to="/register" class="auth__form-submit --outline">
        Регистрация
      </NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user"

definePageMeta({
  layout: 'auth',
})
const login = ref('')
const password = ref('')
const userStore = useUserStore()
async function auth () {
  const refreshToken = await userStore.auth({
    login: login.value,
    password: password.value,
  })
  const config = useRuntimeConfig()
  const cookie = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME, { maxAge: 30 * 60 * 60 * 90 })
  cookie.value = refreshToken
}
</script>

<style lang="scss">
@import "assets/styles/page/auth";
</style>
