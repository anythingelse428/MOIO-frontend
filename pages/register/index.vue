<template>
  <div class="auth">
    <button @click="testFgPrint()">
      test fgprint
    </button>
    <loader-screen :is-loading="isLoading" />
    <h1 class="auth__header">
      Регистрация
    </h1>
    <form method="post" class="auth__form" @submit.prevent="register()">
      <auth-form-input
        v-if="step===1"
        :value="name"
        name="name"
        label="Имя"
        autocomplete="name"
        :required="true"
        @auth-input="(newVal)=>name=newVal"
      />
      <auth-form-input
        v-if="step===1"
        :value="email"
        name="email"
        label="Email"
        autocomplete="email"
        :required="true"
        @auth-input="(newVal)=>email=newVal"
      />
      <auth-form-input
        v-if="step===1"
        name="password"
        :value="password"
        label="Пароль"
        type="password"
        :required="true"
        @auth-input="(newVal)=>password=newVal"
      />
      <auth-form-input
        v-if="step===1"
        name="clientId"
        :value="clientId"
        label="ClientID"
        type="text"
        :required="false"
        @auth-input="(newVal)=>clientId=newVal"
      />
      <div v-if="step === 2" class="auth__verification-description">
        Введите код подтверждения. Вам было отправлено письмо с кодом подтверждения на почту
      </div>
      <auth-form-input
        v-if="step === 2"
        name="confirmationCode"
        :value="confirmationCode"
        label="Код подтверждения"
        type="text"
        :required="true"
        @auth-input="(newVal)=>confirmationCode=newVal"
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
const step = ref(1)

const name = ref('')
const email = ref('')
const password = ref('')
const clientId = ref('')
const confirmationCode = ref('')

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
  if (confirmationCode.value.length > 0) {
    registrationData.confirmationCode = confirmationCode.value
  }
  try {
    const refreshToken = await userStore.register(registrationData)
    isLoading.value = false
    // console.log(refreshToken)
    if (step.value === 1) {
      step.value = 2
      return
    }
    const config = useRuntimeConfig()
    const cookie = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME, { maxAge: 30 * 60 * 60 * 90 })
    cookie.value = refreshToken
  } catch {
    isLoading.value = false
  }
}
async function testFgPrint () {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
      rp: { id: "localhost", name: "MOIO" },
      user: {
        id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
        name: "jamiedoe",
        displayName: "Jamie Doe",
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
    },
  })
  console.log(credential)
  testFgPrintGet()
}
async function testFgPrintGet () {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: new Uint8Array([139, 66, 181, 87, 7, 203]),
      rpId: "localhost",
      allowCredentials: [{
        type: "public-key",
        id: new Uint8Array([64, 66, 25, 78, 168, 226, 174]),
      }],
      userVerification: "required",
    },
  })
  console.log(credential)
}
</script>

<style lang="scss">
@import "assets/styles/page/auth";
</style>
