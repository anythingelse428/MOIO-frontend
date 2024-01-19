<template>
  <div class="scenarios">
    <h1 class="scenarios__header">
      Сценарии
    </h1>
    <div class="scenarios-available">
      <h2 class="scenarios-available__header">
        Список доступных сценариев
      </h2>
      <div class="scenarios-available__list">
        <nuxt-link v-for="scenario in scenarios" :key="scenario.id" class="scenarios-available__list-item" :to="`scenarios/edit/${scenario.id}`">
          {{ scenario.name }}
          <span class="mdi mdi-pencil" />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const scenarios = ref([
  { id: 1, name: 'Сценарий 1' },
  { id: 2, name: 'Сценарий 2' },
  { id: 3, name: 'Сценарий 3' },
  { id: 4, name: 'Сценарий 4' },
  { id: 5, name: 'Сценарий 5' },
])

</script>

<style lang="scss">
.scenarios {
  &__header{
    font-size: 40px;
    font-weight: 600;
    text-align: center;
  }
  .scenarios-available{
    &__header {
      font-size: 20px;
      font-weight: 600;
      margin-top: 32px;
      text-align: center;
    }
    &__list{
      padding-inline: min(200px, 20%);
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      gap:48px;
      &-item{
        display: block;
        background: $settings-color;
        padding: 20px;
        position: relative;
        font-size: 20px;
        font-weight: 600;
        height: 120px;
        width: calc(50% - 40px);
        border-radius: 12px;
        .mdi.mdi-pencil {
          position: absolute;
          color: $color-active;
          right: 24px;
          bottom: 20px;
          font-size: 28px;
        }
      }
    }
  }
}
</style>
