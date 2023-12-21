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
@import "assets/styles/components/profile-add-roommate-modal";
</style>
