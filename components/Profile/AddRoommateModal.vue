<template>
  <div class="add-roommate-modal">
    <loader-screen :is-loading="isLoading" />
    <div class="add-roommate-modal__header">
      <div class="modal-header">
        Добавить пользователя
      </div>
      <div class="modal-close" @click="emit('modal-close')">
        <span class="mdi mdi-close" />
      </div>
    </div>
    <form action="" method="post" class="add-roommate-modal__form">
      <custom-select v-if="groups" class="add-roommate-modal__input-group" :options="selectData" select-name="Выберите группу" :current-value="groupId" @custom-select="(e)=>groupId = e" />
      <div class="add-roommate-modal__input-group">
        <label for="email" class="add-roommate-modal__input-group-label">
          Email нового пользователя
        </label>
        <input
          id="email"
          v-model="login"
          type="email"
          name="email"
          class="add-roommate-modal__input-group-input"
        >
        <button class="add-roommate-modal__add-button" @click.prevent="addToLoginsArray()">
          <span class="mdi mdi-plus" />
        </button>
      </div>
      <div class="add-roommate-modal__users">
        <div v-if="logins.length === 0" class="add-roommate-modal__users-user--placeholder">
          Здесь будет отображен список пользователей
        </div>
        <div v-for="login in logins" :key="login" class="add-roommate-modal__users-user">
          {{ login }}
          <button class="mdi mdi-delete" @click.prevent="removeFromLoginsArray(login)" />
        </div>
      </div>
      <input type="submit" value="Отправить приглашение" class="add-roommate-modal__form-submit" :disabled="logins.length===0" @click.prevent="addRoommate()">
    </form>
  </div>
</template>

<script setup lang="ts">

import { useGroupsStore } from "~/store/groups"
import CustomSelect from "~/components/shared/CustomSelect.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

const groupStore = useGroupsStore()
const isLoading = ref(false)
const login = ref('')
const groupId = ref('')
const logins = ref<string[]>([])
const { groups } = storeToRefs(groupStore)
const emit = defineEmits(['modal-close'])
const selectData = ref(groups.value.reduce((acc:{description:string, value:any}[], curr) => [...acc, { description: curr.name, value: curr.id }], []))
await groupStore.getAll()
function addToLoginsArray () {
  if (logins.value.length > 0 && logins.value.find(el => el?.toLowerCase() === login.value.toLowerCase())) {
    useNotification('error', 'Этот пользователь уже есть в списке')
    return false
  }
  if (login.value.length > 0) {
    const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm
    if (!login.value.match(emailRegex)) {
      useNotification('error', 'Введите валидный email')
      return false
    }
    logins.value.push(login.value)
    login.value = ''
  }
}
function removeFromLoginsArray (login:string) {
  if (logins.value.length > 0) {
    const idx = logins.value.findIndex(el => el.toLowerCase() === login.toLowerCase())
    logins.value.splice(idx, 1)
  }
}
async function addRoommate () {
  if (groupId.value.length === 0) {
    useNotification('error', 'Выберите группу')
    return
  }
  try {
    isLoading.value = true
    await groupStore.addUserToGroup(logins.value, groupId.value)
    isLoading.value = false
    useNotification('info', 'Пользователи успешно добавлены')
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
