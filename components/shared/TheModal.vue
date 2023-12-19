<template>
  <transition :name="transitionFadeName??'no-transition'">
    <div v-show="isShown" class="modal" :style="backdropFilter?`backdrop-filter:${backdropFilter};`:''">
      <transition :name="transitionContentName??'no-transition'">
        <div v-show="isShown" class="modal__content">
          <slot name="inner" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
export interface MaskProps {
  bgColor?:string,
  isShown:boolean
  backdropFilter?:string,
  transitionFadeName?:string
  transitionContentName?:string
}
const props = defineProps<MaskProps>()
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<style lang="scss">
@import "assets/styles/components/modal";
</style>
