<template>
  <div class="roommates-card" @click="isSettingsModalShow = true">
    <div class="roommates-card__avatar">
      <img v-if="avatarUrl?.length" :src="avatarUrl" alt="" width="76" height="76">
      <div v-else class="roommates-card__avatar --blank" />
    </div>
    <div class="roommates-card-info">
      <div class="roommates-card-info__name">
        {{ name }}
      </div>
      <div class="roommates-card-info__role">
        <span v-for="group in groups" :key="group.id" data-end=", ">{{ group.name }}</span>
      </div>
    </div>
    <ui-icon name="chevron-right" class="roommates-card__chevron" size="36" />
    <ui-modal
      ref="settings"
      :is-shown="isSettingsModalShow"
      backdrop-filter="blur(3px)"
      transition-content-name="translate"
      width="532px"
      @click-outside="closeModal"
    >
      <template #inner>
        <roommate-settings
          :avatar-url="avatarUrl"
          :groups="groups"
          :email="login"
          @modal-close="closeModal"
        />
      </template>
    </ui-modal>
  </div>
</template>

<script setup lang="ts">
import UiIcon from "~/components/ui/UiIcon.vue"
import UiModal from "~/components/ui/UiModal.vue"
import RoommateSettings from "~/components/Profile/RoommateSettings.vue"
import { useGroupsStore } from "~/store/groups"

export type ProfileRoommates = {
  id:string|number
  avatarUrl?:string
  name:string
  role:string
  login:string,
  groups:{id:string, name:string}[]
}

const props = defineProps<ProfileRoommates>()
const groupStore = useGroupsStore()
const isSettingsModalShow = ref(false)
function closeModal (e:Event) {
  if (isSettingsModalShow.value) {
    e.stopPropagation()
    isSettingsModalShow.value = false
  }
}

</script>

<style lang="scss">
@import "assets/styles/components/profile-roommate";
</style>
