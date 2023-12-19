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
@import "assets/styles/components/toggle-switch";
.toggle-switch {
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
}
</style>
