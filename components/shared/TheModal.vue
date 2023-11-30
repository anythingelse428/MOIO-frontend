<template>
  <teleport v-if="isMounted" :to="place||'body'">
    <transition :name="transitionFadeName??'no-transition'">
      <div v-show="isShown" class="modal" :style="backdropFilter?`backdrop-filter:${backdropFilter};`:''">
        <transition :name="transitionContentName??'no-transition'">
          <div v-show="isShown" class="modal__content">
            <slot name="inner" />
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
export interface MaskProps {
  place?:string,
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
@import "assets/styles/transitions.scss";


.modal{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: v-bind(bgColor);
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  top: 0;
  inset: 0;
}
.modal__content{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
</style>
