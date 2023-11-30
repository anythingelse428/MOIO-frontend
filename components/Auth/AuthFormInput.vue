<template>
  <div ref="authInputParent" class="auth-input">
    <input
      v-model="model"
      class="auth-input__field"
      :name="name"
      :type="type??'text'"
      :autocomplete="autocomplete??' '"
      :placeholder="placeholder??' '"
      :required="Boolean(required)"
    >
    <label class="auth-input__label">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">

export type FormInput = {
  label:string,
  name:string,
  value:string,
  type?:string,
  autocomplete?:string
  placeholder?:string
  required?:boolean
}

const props = defineProps<FormInput>()
const authInputParent = ref(null)
const emit = defineEmits(['auth-input'])

onMounted(() => {
  if (authInputParent.value) {
    const label = (authInputParent.value as HTMLDivElement).querySelector('label')
    const input = (authInputParent.value as HTMLDivElement).querySelector('input')
    if (label) {
      label.addEventListener('click', (e) => {
        if (input) {
          input.focus()
        }
      })
    }
  }
})

const model = computed({
  get () {
    return props.value
  },
  set (value) {
    emit('auth-input', value)
  },
})
</script>

<style lang="scss">
.auth-input {
  position: relative;
  width: min(416px,90%);
  font-size: 40px;
  &__label{
    position: absolute;
    color: #80766A;
    z-index: 10;
    left: 24px;
    font-weight: 300;
    font-size: 20px;
    touch-action: none;
    transition: all 0.2s;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    cursor: text;
    bottom: 0;
    top: 0;
    display: flex;
    align-items: center;
  }
  &__field{
    background: $bg-primary;
    width: 100%;
    display: block;
    position: relative;
    padding: 12px 24px;
    border-radius: 74px;
    font-size: 20px;
    outline: 0;
    border: 0;
    &:focus,
    &:not(:placeholder-shown) {
      border: 1px solid $color-active;
      &+.auth-input__label {
        font-size: 20px;
        bottom: auto;
        top: -24px;
      }
    }
  }
}
</style>
