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
          :name="item.name"
          :login="item.login"
          :groups="item.groupsIsPending"
          :is-pending="item.isPending"
          @remove-user="getRoommates()"
        />
      </div>
      <ui-button class="profile-roommates-section__add-section" centered rounded="100%" style="width: 52px; height: 52px" @click="isAddRoommatesModalShow = true">
        <ui-icon name="plus" />
      </ui-button>

      <ui-modal
        ref="addRoommateModal"
        :is-shown="isAddRoommatesModalShow"
        backdrop-filter="blur(3px)"
        transition-fade-name="fade"
        transition-content-name="translate"
        place=".layout"
        width="528px"
        @click-outside="isAddRoommatesModalShow = false"
      >
        <template #inner>
          <add-roommate-modal
            @modal-close="isAddRoommatesModalShow = false"
            @add-roommate="getRoommates()"
          />
        </template>
      </ui-modal>
    </div>
    <div v-if="invitedHouses?.length" class="invited-house-section">
      <h2 class="invited-house-section__header">
        Дома, в которые меня пригласили
      </h2>
      <div class="invited-house-section__container">
        <invited-house
          v-for="house in invitedHouses"
          :id="house.id"
          :key="house.id"
          :name="house?.name"
          :inviter="house.inviter"
          :code="house.code"
        />
      </div>
    </div>
    <ui-button
      v-if="isHouseOwner?.id||!groupStore.upperGroups?.length"
      rounded="16px"
      class="profile__sync-device"
      @click="aliceSync()"
    >
      Синхронизировать с Алисой
    </ui-button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import { useGroupsStore } from "~/store/groups"
import { useDevicesStore } from "~/store/devices"
import UiModal from "~/components/ui/UiModal.vue"
import AddRoommateModal from "~/components/Profile/AddRoommateModal.vue"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import UiIcon from "~/components/ui/UiIcon.vue"
import InvitationForm from "~/components/Profile/InvitationForm.vue"
import type { IUsersByGroupResponse } from "~/api/group/getUsersByGroupId"
import InvitedHouse from "~/components/Profile/InvitedHouse.vue"
import apiUsersPendingGet from "~/api/usersPending/get"

const roommates = ref<IUsersByGroupResponse[]>([])
const userStore = useUserStore()
const groupStore = useGroupsStore()
const devicesStore = useDevicesStore()
const { userInfo } = storeToRefs(userStore)
const isAddRoommatesModalShow = ref(false)
const isLoading = ref(true)
const addRoommateModal = ref(null)
const isHouseOwner = groupStore.upperGroups.find(el => el.groupCreatorId === userInfo.value.id && el.id === groupStore.currentHome)
const invitedHouses = ref(await apiUsersPendingGet())
function aliceSync () {
  devicesStore.getConfig()
}
async function getRoommates () {
  isLoading.value = true
  roommates.value = await groupStore.getUsersByGroupId(groupStore.currentHome)
  isLoading.value = false
  roommates.value = roommates.value.filter(el => el.id !== groupStore.upperGroups.find(el => el.id === groupStore.currentHome)?.groupCreatorId)
}


onMounted(() => {
  nextTick(async () => {
    if (userInfo.value.name?.length < 1) {
      await userStore.init()
    }
    if (!groupStore.currentGroup?.groupCreatorId) {
      groupStore.currentGroup = groupStore.upperGroups.find(el => el.id === groupStore.currentHome)
    }
    await getRoommates()
  })
})
</script>

<style lang="scss">
@import "assets/styles/page/_user";

</style>
