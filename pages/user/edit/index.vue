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
        <input id="password" v-model="newPassword" type="text" class="user-edit__input-group-input">
      </div>
      <div v-if="type === 'email'" class="user-edit__input-group">
        <label for="login" class="user-edit__input-group-label">Введите новую почту</label>
        <input id="login" v-model="login" type="text" class="user-edit__input-group-input">
      </div>
      <div class="user-edit__input-group">
        <label for="old-pass" class="user-edit__input-group-label">Введите {{ type === 'password' ? 'старый' : "" }} пароль</label>
        <input id="old-pass" v-model="oldPassword" type="text" class="user-edit__input-group-input">
      </div>
      <h2 v-if="step === 2" class="user-edit__subheader">
        Код подтверждения
      </h2>
      <div v-if="step === 2" class="user-edit__input-group">
        <label for="confirmation" class="user-edit__input-group-label">Введите код подтверждения. Вам было отправлено письмо с кодом подтверждения на новую почту</label>
        <input
          id="confirmation"
          v-model="code"
          type="text"
          class="user-edit__input-group-input"
          placeholder="Код подтверждения"
        >
      </div>
      <input type="submit" value="Сохранить">
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
      await userStore.changePassword({ oldPassword: oldPassword.value, newPassword: newPassword.value })
      isLoading.value = false
      step.value = 2
      return
    }
    if (type.value === "email") {
      await userStore.changeLogin({ newLogin: login.value, password: oldPassword.value })
      isLoading.value = false
      step.value = 2
      return
    }
  }
  if (step.value === 2) {
    if (type.value === "password") {
      return await userStore.changePassword({ oldPassword: oldPassword.value, newPassword: newPassword.value, confirmationCode: code.value })
    }
    if (type.value === "email") {
      return await userStore.changeLogin({ newLogin: login.value, password: oldPassword.value, confirmationCode: code.value })
    }
    isLoading.value = false
  }
}
</script>

<style lang="scss">
.user-edit{
  padding-inline: 48px;
  &__header{
    font-size: 30px;
    font-weight: 700;
  }
  &__subheader{
    margin-top: 36px;
    @include capabilities-modal-header;
  }
  &__container{
    padding-inline: 24px;
    input[type="submit"]{
      color: $color-accent;
      background: $color-active;
      font-size: 24px;
      font-weight: 600;
      padding: 4px 12px;
      border: 0;
      border-radius: 16px;
      margin-top: 36px;
    }
  }
  &__input-group{
    display: flex;
    flex-direction: column;
    margin-top: 28px;
    padding-inline: 24px;
    width: min(360px, 100%);
    &-label{
      @include carousel-category-item;
    }
    &-input{
      border-radius: 12px;
      background: $settings-color;
      border: none;
      margin-top: 8px;
      padding:8px  16px;
      font-size: 20px;
    }
  }
}
</style>
