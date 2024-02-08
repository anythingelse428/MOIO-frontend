<template>
  <div class="auth">
    <loader-screen :is-loading="isLoading" />
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
        :required="false"
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
import type { IRegisterUserProps } from "~/api/user/register"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

definePageMeta({
  layout: 'auth',

})
const userStore = useUserStore()
const isLoading = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const clientId = ref('')

async function register () {
  isLoading.value = true
  const registrationData:IRegisterUserProps = {
    name: name.value,
    login: email.value,
    password: password.value,
  }
  if (clientId.value.length > 0) {
    registrationData.clientId = clientId.value
  }
  try {
    const refreshToken = await userStore.register(registrationData)
    const config = useRuntimeConfig()
    const cookie = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME, { maxAge: 30 * 60 * 60 * 90 })
    cookie.value = refreshToken
  } catch {}
  isLoading.value = false
}
</script>

<style lang="scss">
@import "assets/styles/page/auth";
</style>
