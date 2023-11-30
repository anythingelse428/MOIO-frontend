<template>
  <div class="profile">
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
onMounted(() => {
  nextTick(async () => {
    if (profileData.value.name.length < 1) {
      const data = await userStore.init()
      profileData.value = userStore.userInfo
    }
  })
})
// const addRoommateModal = ref(null)
const isAddRoommatesModalShow = ref(false)
// onClickOutside(addRoommateModal, () => {
//   isAddRoommatesModalShow.value = false
// })

</script>

<style lang="scss">
.profile{
  padding-inline: 175px;
  @media screen and (max-width: 1200px) {
    padding-inline: min(9%, 75px);
  }
  &__divider{
    margin-top: 64px;
  }
  .profile-roommates-section{
    &__header{
      font-size: 25px;
      font-weight: 600;
      margin-top: 20px;
    }
    &__add-section{
      border: none;
      outline: none;
      background: $avatar-bg-gradient-start;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 100%;
      margin-inline:auto;
      margin-top: 16px;
      cursor: pointer;
      .mdi{
        color: $color-accent;
        font-size: 28px;
      }
    }
  }
  .profile-roommates-section__list{
     margin-top: 20px;
    .roommates-card{
      &:first-child{
        border-top-right-radius:23px;
        border-top-left-radius:23px;
      }
      &:last-child{
        border-bottom-right-radius: 23px ;
        border-bottom-left-radius: 23px ;
        border-bottom: 0;
      }
    }
  }
}

</style>
