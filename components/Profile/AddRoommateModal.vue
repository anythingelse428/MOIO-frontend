<template>
  <div class="add-roommate-modal">
    <loader-screen :is-loading="isLoading" />
    <div class="add-roommate-modal__header">
      <div class="modal-header">
        Добавить пользователя
      </div>
      <div class="modal-close" @click="emit('modal-close')">
        <ui-icon name="close" />
      </div>
    </div>
    <form action="" method="post" class="add-roommate-modal__form">
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
        <ui-button class-name="default" rounded="100%" padding="8px" margin-inline="0" @click="addToLoginsArray">
          <ui-icon name="plus" />
        </ui-button>

      </div>
      <div class="add-roommate-modal__users">
        <div v-if="logins?.length === 0" class="add-roommate-modal__users-user --placeholder">
          Здесь будет отображен список пользователей
        </div>
        <ui-any-list-item v-for="login in logins" :key="login" class="add-roommate-modal__users-user">
          <template #title>
            {{login}}
          </template>
          <template #action>
            <ui-button class-name="blank" padding="0" margin-inline="0">
            <ui-icon
                name="delete"
                color="#D15151"
                size="20"
                role="button"
                @click.prevent="removeFromLoginsArray(login)"
            />
            </ui-button>
          </template>
        </ui-any-list-item>
      </div>
      <div class="add-roommate-modal__input-group">
        <label for="house" class="add-roommate-modal__input-group-label">
          Выберите дом, доступный пользователю
        </label>
        <ui-select
            v-if="uppperGroups"
            style="width: 100%"
            :options="selectDataHouses"
            select-name="Дом не выбран"
            :current-value="selectedHouse"
            @custom-select="(e)=>{ selectedHouse = e;getSubgroups() }"
        />
      </div>
      <div class="add-roommate-modal__groups">
        <div class="" v-show="selectDataGroups.length">
          Выбрать все
          <ui-checkbox @check="e=>selectGroups(e,'all')" :checked="selectDataGroups.length === groupIds.length" />
        </div>

        <label for="groups" class="add-roommate-modal__input-group-label">
          Выберите группы, доступные пользователю
        </label>
        <ui-any-list-item
            v-for="group in selectDataGroups"
            :key="group.id">
          <template #title>
            {{group.name}}
          </template>
          <template #action>
            <ui-checkbox @click="e=>selectGroups(e,group.id)" :checked="groupIds.includes(group.id)" />
          </template>
        </ui-any-list-item>
      </div>
      <ui-button :disabled="logins?.length===0 || selectedHouse.length === 0" @click="addRoommate()" rounded="16px">
        Отправить приглашение
      </ui-button>
    </form>
  </div>
</template>

<script setup lang="ts">

import {useGroupsStore} from "~/store/groups"
import UiSelect from "~/components/ui/UiSelect.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import UiIcon from "~/components/ui/UiIcon.vue"
import {useUserStore} from "~/store/user"

const groupStore = useGroupsStore()
const isLoading = ref(false)
const login = ref('')
const groupIds = ref<string[]>([])
const selectedHouse = ref('')
const userId = useUserStore().id
const logins = ref<string[]>([])
const { groups, uppperGroups } = storeToRefs(groupStore)
const emit = defineEmits(['modal-close'])
const selectDataHouses = ref(uppperGroups.value.reduce((acc:{ description:string, value:any }[], curr) => {
  if (!acc?.length) {
    acc = []
  }
  if (curr.groupCreatorId === userId && curr.typeId === 1) {
    acc.push({ description: curr.name as string, value: curr.id })
  }
  return acc
}, []))
const selectDataGroups = ref<{id:string, name:string}[]>([])
await groupStore.getAll()
function addToLoginsArray () {
  if (logins.value?.length > 0 && logins.value?.find(el => el?.toLowerCase() === login.value.toLowerCase())) {
    useNotification('error', 'Этот пользователь уже есть в списке')
    return false
  }
  if (login.value?.length > 0) {
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
  if (logins.value?.length) {
    const idx = logins.value.findIndex(el => el.toLowerCase() === login.toLowerCase())
    logins.value.splice(idx, 1)
  }
}

async function getSubgroups () {
  selectDataGroups.value = await groupStore.getSubgroups(selectedHouse.value)
}
function selectGroups (e:Event, id:string) {
  if (id === 'all'){
    if (groupIds.value.length < selectDataGroups.value.length){
      groupIds.value = [...selectDataGroups.value.map(el=>el.id)]
      return;
    }
    groupIds.value = []
  }
  if ((<HTMLInputElement>e.target)?.checked) {
    groupIds.value.push(id)
    return
  }
  groupIds.value = groupIds.value.filter(el => el !== id)
}
async function addRoommate () {
  if (groupIds.value?.length === 0 && selectedHouse.value?.length === 0) {
    useNotification('error', 'Выберите группу')
    return
  }
  isLoading.value = true
  await groupStore.addUserToGroup(logins.value, [selectedHouse.value, ...groupIds.value])
  isLoading.value = false

}
watch(groups, (newValue) => {
  selectDataHouses.value = newValue.reduce((acc:{ description:string, value:any }[], curr) => {
    if (!acc?.length) {
      acc = []
    }
    if (curr.groupCreatorId === userId && curr.typeId === 1) {
      acc.push({ description: curr.name as string, value: curr.id })
    }
    return acc
  }, [])
}, { deep: true })
</script>

<style lang="scss">
@import "assets/styles/components/profile-add-roommate-modal";

</style>
