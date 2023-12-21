<template>
  <NuxtLink :to="`profile/${id}`" class="roommates-card">
    <div class="roommates-card__avatar">
      <img v-if="avatarUrl.length" :src="avatarUrl" alt="" width="76" height="76">
      <div v-else class="roommates-card__avatar --blank" />
    </div>
    <div class="roommates-card-info">
      <div class="roommates-card-info__name">
        {{ name }}
      </div>
      <div class="roommates-card-info__role">
        {{ role }}
      </div>
    </div>
    <span class="mdi mdi-chevron-right roommates-card__chevron" />
  </NuxtLink>
</template>

<script setup lang="ts">
export type ProfileRoommates = {
  id:string|number
  avatarUrl:string
  name:string
  role:string
}

const props = defineProps<ProfileRoommates>()
</script>

<style lang="scss">
@import "assets/styles/components/profile-roommate";
</style>
