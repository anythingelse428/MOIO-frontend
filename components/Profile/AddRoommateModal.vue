<template>
  <div class="add-roommate-modal">
    <div class="add-roommate-modal__header">
      <div class="modal-header">
        Добавить пользователя
      </div>
      <div class="modal-close" @click="emit('modal-close')">
        <span class="mdi mdi-close" />
      </div>
    </div>
    <form action="" class="add-roommate-modal__form">
      <div class="add-roommate-modal__input-group">
        <label for="name" class="add-roommate-modal__input-group-label">
          Имя пользователя
        </label>
        <input
          id="name"
          v-model="newRoommateData.name"
          type="text"
          name="name"
          class="add-roommate-modal__input-group-input"
        >
      </div>
      <div class="add-roommate-modal__input-group">
        <label for="email" class="add-roommate-modal__input-group-label">
          Email нового пользователя
        </label>
        <input
          id="email"
          v-model="newRoommateData.email"
          type="email"
          name="email"
          class="add-roommate-modal__input-group-input"
        >
      </div>
      <input type="submit" value="Отправить приглашение" class="add-roommate-modal__form-submit">
    </form>
  </div>
</template>

<script setup lang="ts">
const newRoommateData = { name: '', email: '' }
const emit = defineEmits(['modal-close'])

</script>

<style lang="scss">
.add-roommate-modal{
    display: flex;
    flex-direction: column;
    background: $bg-primary;
    padding-top: 16px;
    padding-bottom: 36px;
    padding-inline: 40px;
    color: $color-primary;
    border-radius: 36px;
    width: clamp(200px, 535px,95vw);
  &__header {
    min-width: 100%;
    display: flex;
    align-items: center;

    .modal-header {
      width: 100%;
      text-align: center;
      @include aside-header
    }

    .modal-close {
      cursor: pointer;
      font-size: 20px;
    }
  }
  &__form{
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 36px;
  }
  &__input-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
  }
  &__input-group-label{
    font-size: 16px;
    font-weight: 400;
  }
  &__input-group-input{
    width: 100%;
    background: $thumb-color;
    outline: none;
    padding: 10px 16px;
    border-radius: 12px;
    border-color: transparent;
    font-size: 16px;
  }
  &__form-submit{
    margin-top: 20px;
    width: fit-content;
    padding: 8px 16px;
    background: $color-active;
    outline: none;
    border: none;
    margin-inline: auto;
    font-size: 20px;
    font-weight: 400;
    border-radius: 12px;
    cursor: pointer;
    color: $color-accent;
  }
}
</style>
