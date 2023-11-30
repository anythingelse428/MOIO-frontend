<template>
  <div class="register">
    <h1 class="register__header">
      Регистрация
    </h1>
    <form method="post" class="register__form" @submit.prevent="register()">
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
      <input type="submit" value="Регистрация" class="register__form-submit">
      <NuxtLink to="/login" class="register__form-submit --outline">
        Войти
      </NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import apiUserRegister from '~/api/user/register'
import { useUserStore } from "~/store/user"
import ToggleSwitch from "~/components/shared/ToggleSwitch.vue"

definePageMeta({
  layout: 'auth',
})
const name = ref('')
const email = ref('')
const password = ref('')
const userStore = useUserStore()
async function register () {
  const registrationData = {
    name: name.value,
    login: email.value,
    password: password.value,
    devices: [0],
    role: 0,
  }
  const refreshToken = await userStore.register(registrationData)
  const config = useRuntimeConfig()
  const cookie = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME, { maxAge: 30 * 60 * 60 * 90 })
  cookie.value = refreshToken
}
</script>

<style lang="scss">
.register{
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
    .register__form-submit{
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
