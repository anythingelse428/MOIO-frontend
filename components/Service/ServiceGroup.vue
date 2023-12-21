<template>
  <div class="service-group">
    <h2 class="service-group__header">
      {{ name }}
    </h2>
    <div class="service-group__list">
      <the-service
        v-for="service in list"
        :id="service.id"
        :key="service.id"
        :group-id="id"
        :name="service.name"
        :ico="service.ico"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheService from '~/components/Service/TheService.vue'

export type ServiceGroup = {
  name:string,
  id:string|number
  list: {
    id:string|number
    name: string
    ico:string
  }[]
}

const props = defineProps<ServiceGroup>()
</script>

<style lang="scss">
.service-group{
  &__header{
    margin-top: 62px;
    font-size: 50px;
    font-weight: 600;
  }
  &__list{
    margin-top: 60px;
    display: flex;
    flex-wrap: wrap;
    gap: 80px;
  }
}
</style>
