<template>
  <div class="invited-house">
    <div class="invited-house__info">
      <div class="invited-house__info-house-name">
        {{ name }}
      </div>
      <div class="invited-house__info-owner-name">
        {{ inviter }}
      </div>
    </div>
    <div class="" style="display:flex; gap: 16px;">
      <ui-button
        class-name="default"
        rounded="16px"
        margin-inline="0"
        @click="acceptInvite()"
      >
        Принять
      </ui-button>
      <ui-button
        class-name="delete"
        fill="var(--settings-color)"
        rounded="16px"
        margin-inline="0"
        @click="rejectInvite"
      >
        Отклонить
      </ui-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user"
import { useGroupsStore } from "~/store/groups"
import apiGroupRejectPending from "~/api/group/removePending"

export interface IInvitedHouse {
    id:string,
    name:string,
    inviter:string
    code:string
}
const props = defineProps<IInvitedHouse>()
const userStore = useUserStore()
const groupStore = useGroupsStore()
// const ownerName = await userStore.getUserById(props.groupCreatorId)

async function acceptInvite () {
  await groupStore.checkCode(props.code)
}

async function rejectInvite () {
  await apiGroupRejectPending(props.id)
  // console.log(response)
}
</script>

<style lang="scss">
@import "assets/styles/components/invited-house";
</style>
