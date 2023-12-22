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
    <form action="" method="post" class="add-roommate-modal__form" @submit.prevent="addRoommate()">
      <custom-select v-if="groups" class="add-roommate-modal__input-group" :options="selectData" select-name="Выберите группу" :current-value="newRoommateData.groupId" @custom-select="(e)=>newRoommateData.groupId = e" />
      <!--      <div class="add-roommate-modal__input-group">-->
      <!--        <label for="name" class="add-roommate-modal__input-group-label">-->
      <!--          Имя пользователя-->
      <!--        </label>-->
      <!--        <input-->
      <!--          id="name"-->
      <!--          v-model="newRoommateData.name"-->
      <!--          type="text"-->
      <!--          name="name"-->
      <!--          class="add-roommate-modal__input-group-input"-->
      <!--        >-->
      <!--      </div>-->
      <div class="add-roommate-modal__input-group">
        <label for="email" class="add-roommate-modal__input-group-label">
          Email нового пользователя
        </label>
        <input
          id="email"
          v-model="newRoommateData.login"
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

import { useGroupsStore } from "~/store/groups"
import CustomSelect from "~/components/shared/CustomSelect.vue"

const groupStore = useGroupsStore()
const newRoommateData = ref({ name: '', login: '', groupId: '' })
const { groups } = storeToRefs(groupStore)
const emit = defineEmits(['modal-close'])
const selectData = ref(groups.value.reduce((acc:{description:string, value:any}[], curr) => [...acc, { description: curr.name, value: curr.id }], []))
await groupStore.getAll()
async function addRoommate () {
  try {
    await groupStore.addUserToGroup(newRoommateData.value.login, newRoommateData.value.groupId)
  } catch {

  }
}
watch(groups, (newValue) => {
  selectData.value = newValue.reduce((acc:{description:string, value:any}[], curr) => [...acc, { description: curr.name, value: curr.id }], [])
}, { deep: true })
</script>

<style lang="scss">
@import "assets/styles/components/profile-add-roommate-modal";

</style>
