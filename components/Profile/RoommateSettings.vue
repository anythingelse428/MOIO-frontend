<template>
  <div class="roommate-settings">
    <loader-screen :is-loading="isLoading" />
    <div class="roommate-settings__header">
      <h1 class="header">
        Настройки пользователя
      </h1>
      <button class="blank" @click.stop="emit('modal-close')">
        <icon name="close" size="18" />
      </button>
    </div>
    <div class="roommate-settings__user-info">
      <img v-if="avatarUrl?.length" :alt="`Аватар пользователя ${email}`" class="profile-card__avatar" :src="avatarUrl" width="136" height="136">
      <div v-else class="profile-card__avatar --blank" />
      <div class="roommate-settings__user-info-name">
        {{ email }}
      </div>
    </div>
    <div class="roommate-settings__groups">
      <h2 class="roommate-settings__groups-header">
        Доступы
      </h2>
      <div v-if="existingGroups.length" class="roommate-settings__groups-container">
        <div v-for="group in existingGroups" :key="group.id" class="roommate-settings__groups-item">
          <span>
            {{ group.name }}
          </span>
          <button class="blank" @click="prepareGroupsForRemove(group.id)">
            <icon name="delete" size="20" color="#D15151" />
          </button>
        </div>
      </div>
      <div v-else class="roommate-settings__groups-container --empty">
        У пользователя нет доступа к группам этого дома
      </div>
    </div>
    <button class="roommate-settings__submit" @click="removeUserFromGroups()">
      Сохранить
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import Icon from "~/components/shared/Icon.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

export interface IRoommateSettingsProps {
  avatarUrl?:string,
  email:string
  groups:{
    id:string,
    name:string
  }[]
}

const props = defineProps<IRoommateSettingsProps>()
const emit = defineEmits(['modal-close'])
const groupStore = useGroupsStore()
const existingGroups = ref<IRoommateSettingsProps["groups"]>(props.groups)
const groupsForRemove = ref<string[]>([])
const isLoading = ref(false)

function prepareGroupsForRemove (id:string) {
  groupsForRemove.value.push(id)
  existingGroups.value = existingGroups.value.filter(el => el.id !== id)
}
async function removeUserFromGroups () {
  isLoading.value = true
  await groupStore.removeUsersFromGroup(groupsForRemove.value, [props.email], [])
  isLoading.value = false
  emit('modal-close')
}
</script>

<style lang="scss">
.roommate-settings{
  background: $bg-primary;
  border-radius: 16px;
  width: min(532px, 95%);
  max-height: 85vh;
  padding: 28px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    border-radius: 2px;
    width: 8px;
    margin-inline-start: 10px;
    left: 10px;
    position: absolute;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    width: 4px;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: $color-active;
    width: 8px;
    height: 32px;
    border-radius: 12px;
  }
  &__header{
    width: 100%;
    position: relative;
    .header{
      @include capabilities-modal-header;
      text-align: center;
      color: $color-active;
    }
    button.blank{
      position: absolute;
      right: 16px;
      top: 6px;
      @media screen and (max-width: 768px) {
        top: 4px;
        right: -16px;
      }
    }
  }
  &__user-info{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 36px;
    .profile-card__avatar{}
    &-name{
      margin-top: 16px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      text-decoration: underline;
    }
  }
  &__groups {
    margin-top: 34px;
    &-header {
      font-size: 16px;
      font-weight: 600;
    }
    &-container {
      margin-top: 16px;
      padding-inline: 20px;
      margin-inline: auto;
      @media screen and (max-width: 768px) {
        padding-inline: 0;
      }
    }
    &-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: $settings-color;
      border-radius: 12px;
      padding: 20px 12px;
      font-size: 20px;
      font-weight: 600;
      margin-top: 12px;
    }
  }
  &__submit{
    display: block;
    margin-top: 36px;
    margin-inline: auto;
    background: $color-active;
    color: $bg-primary;
    font-size: 24px;
    font-weight: 600;
    padding: 4px 14px;
    border-radius: 16px;
    border: 0;
  }
}
</style>
