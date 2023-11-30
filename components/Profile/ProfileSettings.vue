<template>
  <div class="profile-settings">
    <h1 class="profile-roommates-section__header">
      Настройки
    </h1>
    <div class="profile-settings__list">
      <div class="profile-settings__item">
        <div class="profile-settings__item-ico">
          <span class="mdi mdi-leak" />
        </div>
        <div class="profile-settings__item-name">
          Датчики
        </div>
        <div class="profile-settings__item-chevron">
          <span class="mdi mdi-chevron-right" />
        </div>
      </div>
      <div class="profile-settings__item">
        <div class="profile-settings__item-ico">
          <span class="mdi mdi-door" />
        </div>
        <div class="profile-settings__item-name">
          Двери
        </div>
        <div class="profile-settings__item-chevron">
          <span class="mdi mdi-chevron-right" />
        </div>
      </div>
      <div class="profile-settings__item">
        <div class="profile-settings__item-ico">
          <span class="mdi mdi-arrow-decision" />
        </div>
        <div class="profile-settings__item-name">
          Домашние центры и мосты
        </div>
        <div class="profile-settings__item-chevron">
          <span class="mdi mdi-chevron-right" />
        </div>
      </div>
      <div class="profile-settings__item">
        <div class="profile-settings__item-ico">
          <span class="mdi mdi-blinds-horizontal" />
        </div>
        <div class="profile-settings__item-name">
          Жалюзи и окна
        </div>
        <div class="profile-settings__item-chevron">
          <span class="mdi mdi-chevron-right" />
        </div>
      </div>
      <div class="profile-settings__item">
        <div class="profile-settings__item-ico">
          <span class="mdi mdi-lock" />
        </div>
        <div class="profile-settings__item-name">
          Замки
        </div>
        <div class="profile-settings__item-chevron">
          <span class="mdi mdi-chevron-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.profile-settings{
  &__list{
    margin-top: 20px;
  }
  &__item{
    background: $bg-primary;
    border-bottom: 2px solid $divider-border-color;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    .mdi{
      font-size: 40px;
    }
    &-name{
      margin-left: 38px;
      @include action-item
    }
    &-chevron{
      margin-left: auto;
    }
    &:first-child{
      border-top-right-radius:23px;
      border-top-left-radius:23px;
    }
    &:last-child{
      border-bottom: 0;
      border-bottom-right-radius: 23px ;
      border-bottom-left-radius: 23px ;
    }
  }
}
</style>
