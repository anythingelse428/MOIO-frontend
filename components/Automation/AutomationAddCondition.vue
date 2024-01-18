<template>
  <div class="automation-add-condition">
    <div class="automation-add-condition__header">
      Добавить условие
      <span class="mdi mdi-close" @click="emit('hide-modal')" />
    </div>
    <form class="automation-add-condition__form" @submit.prevent="emit('add-condition',condition)">
      <div class="automation-add-condition__conditions">
        <div :class="`automation-add-condition__condition ${condition==='time'&&'--active'}`" @click="condition='time'">
          <input id="" type="radio" name="new_condition">
          <span class="mdi mdi-clock-time-three-outline" />
          <div class="automation-add-condition__condition-name">
            Время
          </div>
        </div>
        <div :class="`automation-add-condition__condition ${condition==='sensor'&&'--active'}`" @click="condition='sensor'">
          <input id="" type="radio" name="new_condition">
          <span class="mdi mdi-leak" />
          <div class="automation-add-condition__condition-name">
            Датчик
          </div>
        </div>
      </div>
      <input type="submit" value="Добавить" class="automation-add-condition__submit">
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['add-condition', 'hide-modal'])
const condition = ref<'sensor'|'time'>('time')
</script>

<style lang="scss">
.automation-add-condition{
  background: $bg-primary;
  border-radius: 26px;
  width: min(536px, 95%);
  margin-inline: auto;
  padding-top: 24px;
  padding-bottom: 40px;
  &__form{
    display: flex;
    flex-direction: column;
  }
  &__header{
    font-size: 25px;
    font-weight: 600;
    color: $color-active;
    width: 100%;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .mdi-close{
      position: absolute;
      right: 27px;
      font-size: 20px;
      cursor: pointer;

    }
  }
  &__conditions{
    margin-top: 28px;
    display: flex;
    gap:52px;
    flex-wrap: wrap;
    text-align: center;
    justify-content: center;

  }
  &__condition{
    display: inline-block;
    width: min(184px,95%);
    aspect-ratio: 1 / 1;
    background: $settings-color;
    border-radius: 16px;
    position: relative;
    padding: 20px;
    padding-bottom: 12px;
    border: 1px solid transparent;
    font-size: 20px;
    font-weight: 400;
    &.--active{
      border: 1px solid $color-active;
      box-shadow: 0px 0px 16px 0px $color-active;
    }
    input[type="radio"]{
      cursor: pointer;
      position: absolute;
      inset: 0;
      opacity: 0;
    }
    .mdi{
      display: flex;
      justify-content: center;
      font-size: 128px;
      color: $color-active;
      &::before{
        max-height: 126px;
      }
    }
  }
  &__submit{
    font-size: 25px;
    font-weight: 600;
    color: $color-accent;
    border-radius: 16px;
    background: $color-active;
    padding: 8px 12px;
    outline: 0;
    border: 0 ;
    margin-inline: auto;
    margin-top: 44px;
  }
}
</style>
