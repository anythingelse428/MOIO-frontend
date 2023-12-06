<template>
  <div class="group">
    <h1 class="group__header">
      {{ groupData?.name }}
    </h1>
    <div v-if="groupData?.groups" class="subgroup-list">
      <div v-for="group in Object.keys(groupData.groups)" :key="group" class="subgroup-item">
        <h2 class="subgroup-item__header">
          {{ group }}
        </h2>
        <div class="subgroup-item__service-list">
          <the-service
            v-for="service in groupData.groups[group]"
            :id="service.id"
            :key="service.groupId"
            group-id=""
            :name="service.name"
            :type="service.type"
            :capabilities="service?.capabilities"
          />
        </div>
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
    groups: categoryStore.devices,
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
.subgroup-item{
  &__header {
    @include header-submenu-item;
    font-weight: 600;
    margin-top: 40px;
  }
  &__service-list{
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
    gap:40px;
  }
}
</style>
