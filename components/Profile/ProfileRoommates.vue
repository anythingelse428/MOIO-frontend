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
.roommates-card{
  display: flex;
  align-items: center;
  background: $bg-primary;
  padding: 8px 28px;
  border-bottom: 2px solid $divider-border-color;
  &__avatar{
    &.--blank{
      width: 45px;
      height: 45px;
      border-radius: 100%;
      display: block;
      background: linear-gradient(180deg, $avatar-bg-gradient-start 0%, $avatar-bg-gradient-end 100%);
    }
  }
  &__chevron{
    margin-left: auto;
    font-size: 36px;
  }
  .roommates-card-info{
    margin-left: 24px;
    &__name{
      @include action-item
    }
    &__role {
      @include carousel-category-item
    }
  }
}
</style>
