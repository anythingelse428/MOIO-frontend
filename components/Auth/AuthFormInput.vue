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
const emit = defineEmits(['auth-input'])
const authInputParent = ref(null)

const model = computed({
  get () {
    return props.value
  },
  set (value) {
    emit('auth-input', value)
  },
})

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

</script>

<style lang="scss">
@import "assets/styles/components/_auth-input";
</style>
