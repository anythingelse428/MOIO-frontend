<template>
  <div class="profile">
    <loader-screen :is-loading="isLoading" />
    <profile-card
      :role="userInfo.role"
      :displayed-name="userInfo.name"
      :avatar-url="userInfo.avatarUrl"
      :client-id="userInfo.clientId"
      :login="userInfo.login"
    />
    <invitation-form />
    <div v-if="isHouseOwner" class="profile-roommates-section">
      <h1 class="profile-roommates-section__header">
        Жильцы и гости
      </h1>
      <div class="profile-roommates-section__list">
        <profile-roommates
          v-for="item in roommates"
          :id="item.id"
          :key="item.id"
          :avatar-url="item?.avatarUrl"
          :name="item.name"
          :role="item.role"
          :login="item.login"
          :groups="item.groups"
        />
      </div>
      <button class="profile-roommates-section__add-section" title="Добавить пользователя в дом" @click="isAddRoommatesModalShow = true">
        <icon name="plus" />
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
    <!--    <profile-settings />-->
    <div v-if="invitedHouses.length" class="invited-house-section">
      <h2 class="invited-house-section__header">
        Дома, в которые меня пригласили
      </h2>
      <div class="invited-house-section__container">
        <invited-house v-for="house in invitedHouses" :id="house.id" :key="house.id" :group-creator-id="house.groupCreatorId" :name="house.name" />
      </div>
    </div>
    <button v-if="isHouseOwner?.id||!groupStore.uppperGroups?.length" class="profile__sync-device" @click="aliceSync()">
      Синхронизировать с Алисой
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import { useGroupsStore } from "~/store/groups"
import { useDevicesStore } from "~/store/devices"
import TheModal from "~/components/shared/TheModal.vue"
import AddRoommateModal from "~/components/Profile/AddRoommateModal.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import Icon from "~/components/shared/Icon.vue"
import InvitationForm from "~/components/Profile/InvitationForm.vue"
import type { IUsersByGroupResponse } from "~/api/group/getUsersByGroupId"
import InvitedHouse from "~/components/Profile/InvitedHouse.vue"

const roommates = ref<IUsersByGroupResponse[]>([])
const userStore = useUserStore()
const groupStore = useGroupsStore()
const devicesStore = useDevicesStore()
const { userInfo } = storeToRefs(userStore)
const isAddRoommatesModalShow = ref(false)
const isLoading = ref(true)
const addRoommateModal = ref(null)
const isHouseOwner = groupStore.uppperGroups.find(el => el.groupCreatorId === userInfo.value.id && el.id === groupStore.currentHome)
const invitedHouses = ref(groupStore.uppperGroups.filter(el => el.groupCreatorId !== userInfo.value.id))
function aliceSync () {
  devicesStore.getConfig()
}
onMounted(() => {
  isLoading.value = true
  nextTick(async () => {
    // console.log(await groupStore.getUsersByGroupId(groupStore.currentHome))
    if (userInfo.value.name?.length < 1) {
      await userStore.init()
    }
    roommates.value = await groupStore.getUsersByGroupId(groupStore.currentHome)
    isLoading.value = false
    roommates.value = roommates.value.filter(el => el.id !== groupStore.uppperGroups.find(el => el.id === groupStore.currentHome).groupCreatorId)
  })
})
</script>

<style lang="scss">
@import "assets/styles/page/_user";
.profile__sync-device{
  display: block;
  cursor: pointer;
  margin-inline: auto;
  margin-top: 52px;
  padding: 8px 12px;
  font-size: 25px;
  font-weight: 600;
  background: $color-active;
  border-radius: 16px;
  color: $color-accent;
  border: 0;
  @media screen and (max-width:768px) {
    font-size: 21px;
  }
}
.invited-house-section{
  margin-top: 48px;
  &__header{
    text-align: center;
  }
  &__container{
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap:12px;
  }
}
</style>
