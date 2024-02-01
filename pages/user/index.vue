<template>
  <div class="profile">
    <loader-screen :is-loading="isLoading" />
    <profile-card
      :role="profileData.role"
      :displayed-name="profileData.name"
      :avatar-url="profileData.avatarUrl"
    />
    <hr class="profile__divider">
    <div class="profile-roommates-section">
      <h1 class="profile-roommates-section__header">
        Люди
      </h1>
      <div class="profile-roommates-section__list">
        <profile-roommates
          v-for="item in roommates"
          :id="item.id"
          :key="item.id"
          :avatar-url="item.avatarUrl"
          :name="item.name"
          :role="item.role"
        />
      </div>
      <button class="profile-roommates-section__add-section" @click="isAddRoommatesModalShow = true">
        <span class="mdi mdi-plus" />
      </button>
      <the-modal
        :is-shown="isAddRoommatesModalShow"
        backdrop-filter="blur(3px)"
        transition-fade-name="fade"
        transition-content-name="translate"
        bg-color=""
        place=".layout"
      >
        <template #inner>
          <div ref="addRoommateModal" class="">
            <add-roommate-modal @modal-close="isAddRoommatesModalShow = false" />
          </div>
        </template>
      </the-modal>
    </div>
    <profile-settings />
    <button class="profile__sync-device" @click="aliceSync()">
      Синхронизировать с Алисой
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import TheModal from "~/components/shared/TheModal.vue"
import AddRoommateModal from "~/components/Profile/AddRoommateModal.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import { useDevicesStore } from "~/store/devices"

const roommates = ref([
  {
    id: 0,
    name: 'Пётр Петров',
    role: 'Житель',
    avatarUrl: '',
  },
  {
    id: 1,
    name: 'Иван Иванов',
    role: 'Житель (владелец)',
    avatarUrl: '',
  },
])
const userStore = useUserStore()
const profileData = ref(userStore.userInfo)
const isAddRoommatesModalShow = ref(false)
const isLoading = ref(true)
const addRoommateModal = ref(null)
const devicesStore = useDevicesStore()
function aliceSync () {
  devicesStore.getConfig()
}
onMounted(() => {
  isLoading.value = true
  nextTick(async () => {
    if (profileData.value.name?.length < 1) {
      await userStore.init()
      profileData.value = userStore.userInfo
    }
    isLoading.value = false
  })
})
</script>

<style lang="scss">
@import "assets/styles/page/_user";
.profile__sync-device{
  display: block;
  cursor: pointer;
  margin-inline: auto;
  margin-top: 20px;
  padding: 8px 12px;
  font-size: 25px;
  font-weight: 600;
  background: $color-active;
  border-radius: 16px;
  color: $color-accent;
  border: 0;
}
</style>
