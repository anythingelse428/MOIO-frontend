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
  console.log(response)
}
</script>

<style lang="scss">
.invited-house{
  display: flex;
  justify-content: space-between;
  padding: 18px 32px;
  border-radius: 16px;
  background: $bg-primary;
  &__info{
    display: flex;
    flex-direction: column;
    gap:8px;
    &-house-name{
      @include action-item;
    }
    &-owner-name{
      @include carousel-category-item;
    }
  }
  &__leave-from-house-button{
    border: 1px solid $color-active;
    color: $color-active;
    @include action-item;
    padding: 8px 12px;
    border-radius: 16px;
    background: $settings-color;
  }
}
</style>
