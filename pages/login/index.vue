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
.auth{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  &__header{
    color: $color-primary;
    @include section-header
  }
  &__form{
    width: 100%;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    justify-content: center;
    align-items: center;
    .auth__form-submit{
      border-radius: 74px;
      background: $color-active;
      color: $color-accent;
      font-size: 20px;
      font-weight: 300;
      padding:  12px 60px;
      cursor: pointer;
      border: 0;
      outline: 0;
      &.--outline{
        background: transparent;
        border: 2px solid $color-active;
        color: $color-active;
      }
    }
  }
}
</style>
