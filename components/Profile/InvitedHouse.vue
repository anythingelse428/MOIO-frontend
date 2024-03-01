<template>
  <div class="invited-house">
    <div class="invited-house__info">
      <div class="invited-house__info-house-name">
        {{ name }}
      </div>
      <div class="invited-house__info-owner-name">
        {{ ownerName?.name ?? groupCreatorId }}
      </div>
    </div>
    <button class="invited-house__leave-from-house-button" @click="leaveFromHouse">
      Покинуть дом
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user"
import { useGroupsStore } from "~/store/groups"

export interface IInvitedHouse {
    id:string,
    name:string,
    groupCreatorId:number
}
const props = defineProps<IInvitedHouse>()
const userStore = useUserStore()
const groupStore = useGroupsStore()
const ownerName = await userStore.getUserById(props.groupCreatorId)

async function leaveFromHouse () {
  const response = await groupStore.removeUsersFromGroup([props.id], [], [userStore.id])
  // console.log(response)
}
</script>

<style lang="scss">
@import "assets/styles/components/invited-house";
</style>
