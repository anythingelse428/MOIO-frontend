<template>
  <NuxtLink :to="`/automation/${id}`">
    <div class="automation-item">
      <div class="automation-item__description">
        <div class="automation-item__description name">
          {{ automationName }}
        </div>
        <div class="automation-item__description type">
          {{ deviceType }}
        </div>
      </div>
      <div class="automation-item__activation-event">
        {{ activationEvent }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
export type AutomationItem = {
  id:number|string
  automationName:string
  deviceType: string
  activationEvent: string
}
const props = defineProps<AutomationItem>()
</script>

<style lang="scss">
.automation-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 25px;
  border-radius: 16px;
  background: $bg-primary;
  @include tool-item;
  &__description{
    display: flex;
    flex-direction: column;
    gap: 8px;
    .type{
        font-weight: 300;
        font-size: 15px;
    }
  }
  &__activation-event{
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 40px;
    position: relative;
    &::before{
      display: block;
      width: 15px;
      height: 30px;
      content: "";
      background-image: url('~/assets/icons/chevron.svg');
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
}
</style>
