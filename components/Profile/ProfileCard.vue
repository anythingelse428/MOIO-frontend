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
.profile-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__avatar{
    &.--blank{
      display: block;
      width: 136px;
      height: 136px;
      border-radius: 100%;
      background: linear-gradient(180deg, $avatar-bg-gradient-start 0%, $avatar-bg-gradient-end 100%);
    }
  }
  .profile-card-info{
    text-align: center;
    &__role{
      margin-top: 36px;
      @include aside-header;
      font-weight: 300;
    }
    &__name{
      @include section-header;
      font-weight: 600;
    }
  }
}
</style>
