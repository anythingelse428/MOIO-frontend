<template>
  <div class="profile-card">
    <div class="profile-card__avatar">
      <img v-if="avatarUrl.length" :src="avatarUrl" width="136" height="136">
      <div v-else class="profile-card__avatar --blank" />
    </div>
    <div class="profile-card-info">
      <div class="profile-card-info__role">
        {{ role }}
      </div>
      <div class="profile-card-info__name">
        {{ displayedName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type ProfileCard ={
  avatarUrl:string
  role:string
  displayedName:string
}

const props = defineProps<ProfileCard>()
</script>

<style lang="scss">
@import "assets/styles/components/profile-card";
</style>
