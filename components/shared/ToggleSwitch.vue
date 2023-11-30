<template>
  <div :class="`toggle-switch-wrapper${verticalLarge&&'--vertical-large'}`">
    <label v-if="verticalLarge" for="toggle-switch">Выкл.</label>
    <div :class="`toggle-switch ${verticalLarge?'--vertical-large':''}`">
      <input id="toggle-switch" v-model="currentValue" type="checkbox" class="toggle-switch__checkbox">
      <div class="toggle-switch__button" />
      <div class="toggle-switch__layer" />
    </div>
    <label v-if="verticalLarge" for="toggle-switch">Вкл.</label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  checked: Boolean,
  ico: {
    type: String,
    default: "''",
  },
  verticalLarge: {
    type: Boolean,
    default: false,
  },

})
const emit = defineEmits(['check'])
const currentValue = computed({
  get () {
    return props.checked
  },
  set (value) {
    console.log(value)
    emit('check', value)
  },
})
</script>

<style lang="scss">
.toggle-switch-wrapper--vertical-large{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.toggle-switch {
  position: relative;
  //top: 50%;
  width: 60px;
  height: 36px;
  overflow: hidden;
  border-radius: 100px;

  &__layer,
  &__button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &__checkbox {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;

    &:checked + .toggle-switch__button:before {
      content: v-bind(ico);
      transform: translateX(29px);
      background-color: $thumb-color;
      color: $color-active;
    }

    &:checked ~ .toggle-switch__layer {
      background-color: $color-active;
    }
  }

  &__layer {
    border-radius: 100px;
    width: 100%;
    background-color: $thumb-color;
    transition: 0.3s all;
    z-index: 1;
    will-change: background-color;
  }

  &__button {
    z-index: 2;

    &::before {
      font: normal normal normal 24px/1 "Material Design Icons";
      content: v-bind(ico);
      position: absolute;
      top: 4px;
      transform: translateX(4px);
      width: 20px;
      height: 10px;
      padding: 9px 4px;
      background-color: $color-active;
      border-radius: 50%;
      transition: all 0.3s;
      will-change: background-color;
      font-size: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $thumb-color;
    }
  }
  &.--vertical-large {
    width: 70px;
    height: 128px;
    .toggle-switch__button{
      display: flex;
      justify-content: center;
      &::before{
        width: 60px;
        height: 60px;
        padding: 0;
        border-radius: 100%;
        transform: translateX(0) translateY(0%);
      }
    }

    .toggle-switch__checkbox {
      &:checked + .toggle-switch__button:before {
        content: v-bind(ico);
        transform: translateX(0) translateY(100%);
        background-color: $thumb-color;
      }

      &:checked ~ .toggle-switch__layer {
        background-color: $color-active;
      }
    }
  }
}


</style>
