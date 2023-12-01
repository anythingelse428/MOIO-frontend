<template>
  <div class="group">
    <h1 class="group__header">
      {{ groupData?.name }}
    </h1>
    <div class="group__list">
      <!--      <service-group-->
      <!--        v-for="serviceGroup in groupData.groups"-->
      <!--        :id="serviceGroup.id"-->
      <!--        :key="serviceGroup.id"-->
      <!--        :name="serviceGroup.name"-->
      <!--        :list="serviceGroup.services"-->
      <!--      />-->
      <div v-if="groupData?.name" class="">
        <the-service v-for="service in groupData.services" :id="service.id" group-id="" :name="service.name" :type="service.type" :capabilities="service?.capabilities" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAsyncQuery from '~/composables/useAsyncQuery'
import TheService from '~/components/Service/TheService.vue'
import ServiceGroup from '~/components/Service/ServiceGroup.vue'
import { useCategoriesStore } from "~/store/categories"

const route = useRoute()
const id = route.params.id
const groupData = ref()
const categoryStore = useCategoriesStore()
async function fetchGroups () {
  await categoryStore.getAll()
  await categoryStore.getDevicesByCategoryId(id)
  groupData.value = {
    name: categoryStore.categoryById(id)?.name,
    services: categoryStore.devices,
  }
}

fetchGroups()
watch(route, () => {
  fetchGroups()
}, { deep: true, immediate: true })
// groupData.value = {
//   name: 'Заголовок группы',
//   groups: [
//     {
//       id: 0,
//       name: 'Заголовок подгруппы',
//       services: [
//         {
//           id: 0,
//           name: 'Обогрев',
//           ico: 'sun',
//         },
//         {
//           id: 1,
//           name: 'Вентилятор',
//           ico: 'vent',
//         },
//         {
//           id: 2,
//           name: 'Шторы',
//           ico: 'shade',
//         },
//         {
//           id: 3,
//           name: 'Кран',
//           ico: 'drop',
//         },
//         {
//           id: 4,
//           name: 'Датчики',
//           ico: 'sensors',
//         },
//         {
//           id: 5,
//           name: 'Ворота',
//           ico: 'gates',
//         },
//         {
//           id: 6,
//           name: 'Что-то длииииинное',
//           ico: 'sound',
//         },
//         {
//           id: 7,
//           name: 'Что-то еще длиннее прям вот сильно капец в 3 раза',
//           ico: 'siren',
//         },
//         {
//           id: 10,
//           name: 'meh',
//           ico: 'guard',
//         },
//       ],
//     },
//     {
//       id: 1,
//       name: 'Заголовок подгруппы',
//       services: [
//         {
//           id: 0,
//           name: 'Обогрев',
//           ico: 'sun',
//         },
//         {
//           id: 1,
//           name: 'Вентилятор',
//           ico: 'vent',
//         },
//         {
//           id: 2,
//           name: 'Шторы',
//           ico: 'shade',
//         },
//         {
//           id: 3,
//           name: 'Кран',
//           ico: 'drop',
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: 'Заголовок подгруппы',
//       services: [
//         {
//           id: 0,
//           name: 'Обогрев',
//           ico: 'sun',
//         },
//         {
//           id: 1,
//           name: 'Вентилятор',
//           ico: 'vent',
//         },
//         {
//           id: 2,
//           name: 'Шторы',
//           ico: 'shade',
//         },
//         {
//           id: 3,
//           name: 'Кран',
//           ico: 'drop',
//         },
//         {
//           id: 4,
//           name: 'Датчики',
//           ico: 'sensors',
//         },
//         {
//           id: 5,
//           name: 'Ворота',
//           ico: 'gates',
//         },
//         {
//           id: 6,
//           name: 'Что-то длииииинное',
//           ico: 'sound',
//         },
//         {
//           id: 7,
//           name: 'Что-то еще длиннее прям вот сильно капец в 3 раза',
//           ico: 'siren',
//         },
//         {
//           id: 10,
//           name: 'meh',
//           ico: 'guard',
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: 'Заголовок подгруппы',
//       services: [
//         {
//           id: 0,
//           name: 'Обогрев',
//           ico: 'sun',
//         },
//         {
//           id: 1,
//           name: 'Вентилятор',
//           ico: 'vent',
//         },
//         {
//           id: 2,
//           name: 'Шторы',
//           ico: 'shade',
//         },
//         {
//           id: 3,
//           name: 'Кран',
//           ico: 'drop',
//         },
//         {
//           id: 4,
//           name: 'Датчики',
//           ico: 'sensors',
//         },
//         {
//           id: 5,
//           name: 'Ворота',
//           ico: 'gates',
//         },
//         {
//           id: 6,
//           name: 'Что-то длииииинное',
//           ico: 'sound',
//         },
//         {
//           id: 7,
//           name: 'Что-то еще длиннее прям вот сильно капец в 3 раза',
//           ico: 'siren',
//         },
//         {
//           id: 10,
//           name: 'meh',
//           ico: 'guard',
//         },
//         {
//           id: 44110,
//           name: 'meh',
//           ico: 'guard',
//         },
//         {
//           id: 1235,
//           name: 'meh',
//           ico: 'guard',
//         },
//         {
//           id: 14120,
//           name: 'meh',
//           ico: 'guard',
//         },
//         {
//           id: 123,
//           name: 'meh',
//           ico: 'guard',
//         },
//         {
//           id: 11231230,
//           name: 'meh',
//           ico: 'guard',
//         },
//         {
//           id: 14120,
//           name: 'meh',
//           ico: 'guard',
//         },
//         {
//           id: 11230,
//           name: 'meh',
//           ico: 'guard',
//         },
//       ],
//     },
//   ],
// }
</script>

<style lang="scss">
.group{
  padding-inline: 80px;
  &__header{
    @include section-header;
  }
  &__list{
    margin-top: 60px;
  }
}
</style>
