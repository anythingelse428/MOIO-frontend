<template>
  <div class="checkbox" @click="emit('check', !checked)">
    <input type="checkbox" name="checkbox" :checked="checked">
    <ui-icon name="check" size="20" />
  </div>
</template>

<script setup lang="ts">
import UiIcon from "~/components/ui/UiIcon.vue"

export interface ICheckboxProps{
  size?:number,
  checked?:boolean
}
const props = withDefaults(defineProps<ICheckboxProps>(), { size: 20, checked: false })
const emit = defineEmits(['check'])
</script>

<style lang="scss">
.checkbox{
  position: relative;
  color: $settings-color;
  display: flex;
  justify-content: center;
  align-items: center;
  width: v-bind(size + 4);
  height: v-bind(size + 4);
  input[type="checkbox"]{
    position: absolute;
    opacity: 0;
    right: 0;
    inset: 0;
    z-index: 5;
    cursor: pointer;
    &:checked ~ .ui-icon {
      background: $color-active;
      border-color: $color-active;
      svg {
        opacity: 1;
      }
    }
  }
  .ui-icon{
    width: 24px;
    height: 24px;
    background: $bg-primary;
    border-radius: 3px;
    border: 2px solid $bg-primary;
    svg {
      opacity: 0;
    }
  }
}
</style>
