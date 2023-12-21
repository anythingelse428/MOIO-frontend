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
      <button class="profile-roommates-section__add-section" @click="isAddRoommatesModalShow=!isAddRoommatesModalShow">
        <span class="mdi mdi-plus" />
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
      </button>
    </div>
    <profile-settings />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import TheModal from "~/components/shared/TheModal.vue"
import AddRoommateModal from "~/components/Profile/AddRoommateModal.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

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
onMounted(() => {
  nextTick(async () => {
    if (profileData.value.name.length < 1) {
      isLoading.value = true
      await userStore.init()
      profileData.value = userStore.userInfo
    }
    isLoading.value = false
  })
})


</script>

<style lang="scss">
@import "assets/styles/page/_user";

</style>
