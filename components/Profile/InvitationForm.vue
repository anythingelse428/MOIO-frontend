<template>
  <div class="profile-invitation">
    <h1 class="profile-invitation__header">
      Пригласительный код
    </h1>
    <form class="profile-invitation__form" @submit.prevent="checkCode()">
      <div class="profile-invitation__input-group">
        <label for="invite-code" class="profile-invitation__label">
          Если другой пользователь пригласил вас в свой дом, то вам на почту было отправлено письмо с кодом подтверждения
        </label>
        <div class="profile-invitation__input-container">
          <input id="invite-code" v-model="code" placeholder="Код" type="text" class="profile-invitation__input">
        </div>
      </div>
      <input type="submit" value="Подтвердить">
    </form>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"

const code = ref('')
const groupStore = useGroupsStore()
async function checkCode () {
  await groupStore.checkCode(code.value)
}
</script>

<style lang="scss">
.profile-invitation{
  width: min(400px,100%);
  margin-inline: auto;
  &__header{
    @include capabilities-modal-header;
    text-align: center;
    margin-top: 40px;
  }
  &__form{
    margin-top: 20px;
    input[type="submit"]{
      color: $color-accent;
      background: $color-active;
      font-size: 24px;
      font-weight: 600;
      padding: 3px 12px;
      border-radius: 16px;
      border: 0;
      margin-inline: auto;
      display: block;
      margin-top: 32px;
    }
  }
  &__label{
    @include carousel-category-item;
    text-align: center;
    margin-inline: auto;
  }
  &__input-container{
    display: flex;
    gap:12px;
    width: 100%;
    margin-top: 36px;
    position: relative;
    button.blank{
      color: $color-active;
    }
  }
  &__input-group{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__input{
    background: $settings-color;
    border: 0;
    border-radius: 12px;
    padding: 8px 16px ;
    @include tool-item;
    width: calc(100% - 12px - 28px);
  }
}
</style>
