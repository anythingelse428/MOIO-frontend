<template>
  <div class="add-roommate-modal">
    <loader-screen :is-loading="isLoading" />
    <div class="add-roommate-modal__header">
      <div class="modal-header">
        Добавить пользователя
      </div>
      <div class="modal-close" @click="emit('modal-close')">
        <icon name="close" />
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
        <button class="add-roommate-modal__add-button" @click.prevent="addToLoginsArray()">
          <icon name="plus" />
        </button>
      </div>
      <div class="add-roommate-modal__users">
        <div v-if="logins.length === 0" class="add-roommate-modal__users-user--placeholder">
          Здесь будет отображен список пользователей
        </div>
        <div v-for="login in logins" :key="login" class="add-roommate-modal__users-user">
          {{ login }}
          <icon
            name="delete"
            color="#D15151"
            size="20"
            role="button"
            @click.prevent="removeFromLoginsArray(login)"
          />
        </div>
      </div>
      <div class="add-roommate-modal__input-group">
        <label for="house" class="add-roommate-modal__input-group-label">
          Выберите дом, доступный пользователю
        </label>
        <custom-select
            v-if="uppperGroups"
            style="width: 100%"
            :options="selectDataHouses"
            select-name="Дом не выбран"
            :current-value="''"
            @custom-select="(e)=>{ selectedHouse = e;getSubgroups() }"
        />
      </div>
      <div class="add-roommate-modal__groups">
        <label for="groups" class="add-roommate-modal__input-group-label">
          Выберите группы, доступные пользователю
        </label>
        <div
            class="add-roommate-modal__groups-item"
            v-for="group in selectDataGroups"
            :key="group.id"
        >
          <span>{{group.name}}</span>
          <div class="add-roommate-modal__groups-item-checkbox">
            <input type="checkbox" name="group-id" :id="group.id" @change="e=>selectGroups(e,group.id)">
            <icon name="check" size="20"/>
          </div>
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
import Icon from "~/components/shared/Icon.vue"
import {useUserStore} from "~/store/user";
import type {ChangeEvent} from "rollup";

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
  if(curr.groupCreatorId === userId && curr.typeId === 1){
    acc.push({description: curr.name as string, value: curr.id})
  }
  return acc
}, []))
const selectDataGroups = ref<{id:string,name:string}[]>([])
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

async function getSubgroups(){
  selectDataGroups.value = await groupStore.getSubgroups(selectedHouse.value)
}
function selectGroups(e:Event,id:string){
  if (e.target?.checked){
    groupIds.value.push(id)
  }else {
    groupIds.value = groupIds.value.filter(el=>el !== id)
  }
}
async function addRoommate () {
  if (groupIds.value.length === 0) {
    useNotification('error', 'Выберите группу')
    return
  }
  try {
    isLoading.value = true
    const response = await groupStore.addUserToGroup(logins.value, groupIds.value)
    isLoading.value = false
    console.log(response)
    if (response?.status === 200){
      useNotification('info', 'Пользователи успешно добавлены')
    } else {
      useNotification('error', 'Произошла ошибка')
    }
  } catch {

  }
}
watch(groups, (newValue) => {
  selectDataHouses.value = newValue.reduce((acc:{ description:string, value:any }[], curr) => {
    if (!acc?.length) {
      acc = []
    }
    if(curr.groupCreatorId === userId && curr.typeId === 1){
      acc.push({description: curr.name as string, value: curr.id})
    }
    return acc
  }, [])
}, { deep: true })
</script>

<style lang="scss">
@import "assets/styles/components/profile-add-roommate-modal";
.add-roommate-modal__groups{
  display: flex;
  flex-direction: column;
  gap: 12px;
  &-item {
    @include action-item;
    padding: 8px 22px ;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $settings-color;
    border-radius: 12px;
    &-checkbox{
      position: relative;
      color: $settings-color;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      input[type="checkbox"]{
        position: absolute;
        opacity: 0;
        right: 0;
        inset: 0;
        z-index: 5;
        cursor: pointer;
        &:checked ~ .ui-icon {
          background: $color-active;
          border-color: $color-active;
          svg {
            opacity: 1;
          }
        }
      }
      .ui-icon{
        width: 24px;
        height: 24px;
        background: $bg-primary;
        border-radius: 3px;
        border: 2px solid $bg-primary;
        svg {
          opacity: 0;
        }
      }
    }
  }
}
</style>
