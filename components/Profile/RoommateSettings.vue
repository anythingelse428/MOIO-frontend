<template>
  <div class="roommate-settings">
    <loader-screen :is-loading="isLoading" />
    <div class="roommate-settings__header">
      <h1 class="header">
        Настройки пользователя
      </h1>
      <button class="blank" @click="(e)=>emit('modal-close',e)">
        <ui-icon name="close" size="24" />
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
      <div v-if="existingGroups?.length" class="roommate-settings__groups-container">
        <div v-for="group in existingGroups" :key="group.id" class="roommate-settings__groups-item">
          <span>
            {{ group.name }}
          </span>
          <button class="blank" @click="prepareGroupsForRemove(group.id)">
            <ui-icon name="delete" size="20" color="#D15151" />
          </button>
        </div>
      </div>
      <div v-else class="roommate-settings__groups-container --empty">
        У пользователя нет доступа к группам этого дома
      </div>
    </div>
    <button class="roommate-settings__submit" @click="e=>removeUserFromGroups(e)">
      Сохранить
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import UiIcon from "~/components/ui/UiIcon.vue"
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
async function removeUserFromGroups (e:Event) {
  isLoading.value = true
  await groupStore.removeUsersFromGroup(groupsForRemove.value, [props.email], [])
  isLoading.value = false
  emit('modal-close', e)
}
</script>

<style lang="scss">
@import "assets/styles/components/rommate-settings";
</style>
