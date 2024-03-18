<template>
  <div class="user-edit">
    <loader-screen :is-loading="isLoading" />
    <h1 class="user-edit__header">
      Смена {{ type === 'password' ? 'пароля' : "почты" }}
    </h1>
    <form method="post" class="user-edit__container" @submit.prevent="changeData()">
      <h2 class="user-edit__subheader">
        {{ type === 'password' ? 'Введите старый и новый пароль' : "Введите новую почту и пароль" }}
      </h2>
      <div v-if="type === 'password'" class="user-edit__input-group">
        <label for="password" class="user-edit__input-group-label">Введите новый пароль</label>
        <input
          id="password"
          v-model="newPassword"
          type="text"
          class="user-edit__input-group-input"
          required
        >
      </div>
      <div v-if="type === 'email'" class="user-edit__input-group">
        <label for="login" class="user-edit__input-group-label">Введите новую почту</label>
        <input
          id="login"
          v-model="login"
          type="email"
          class="user-edit__input-group-input"
          required
        >
      </div>
      <div class="user-edit__input-group">
        <label for="old-pass" class="user-edit__input-group-label">
          Введите {{ type === 'password' ? 'старый' : "" }} пароль
        </label>
        <input
          id="old-pass"
          v-model="oldPassword"
          type="text"
          class="user-edit__input-group-input"
          required
        >
      </div>
      <h2 v-if="step === 2" class="user-edit__subheader">
        Код подтверждения
      </h2>
      <div v-if="step === 2" class="user-edit__input-group">
        <label for="confirmation" class="user-edit__input-group-label">
          Введите код подтверждения. Вам было отправлено письмо с кодом подтверждения на новую почту
        </label>
        <input
          id="confirmation"
          v-model="code"
          type="text"
          class="user-edit__input-group-input"
          placeholder="Код подтверждения"
          required
        >
      </div>
      <ui-button
        type="submit"
        rounded="16px"
        padding="4px 12px"
        margin-inline="0"
      >
        Сохранить
      </ui-button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

const userStore = useUserStore()
const router = useRoute()
const isLoading = ref(false)
const type = ref<'password'|'email'>(router.query?.password ? 'password' : 'email')
const oldPassword = ref('')
const newPassword = ref('')
const login = ref('')
const code = ref('')
const step = ref(1)

async function changeData () {
  isLoading.value = true
  if (step.value === 1) {
    if (type.value === "password") {
      const response = await userStore.changePassword({ oldPassword: oldPassword.value, newPassword: newPassword.value })
      isLoading.value = false
      step.value = response ? 2 : 1
      return
    }
    if (type.value === "email") {
      const response = await userStore.changeLogin({ newLogin: login.value, password: oldPassword.value })
      isLoading.value = false
      step.value = response ? 2 : 1
      return
    }
  }
  if (step.value === 2) {
    if (type.value === "password") {
      await userStore.changePassword({ oldPassword: oldPassword.value, newPassword: newPassword.value, confirmationCode: code.value })
    }
    if (type.value === "email") {
      await userStore.changeLogin({ newLogin: login.value, password: oldPassword.value, confirmationCode: code.value })
    }
  }
  isLoading.value = false
}
</script>

<style lang="scss">
@import "assets/styles/page/user-edit";
</style>
