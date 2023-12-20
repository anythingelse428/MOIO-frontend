<template>
  <div class="aside">
    <div :class="`aside-trigger mdi mdi-menu ${isAsideCollapsed&& '--collapsed'}`" role="button" @click="isAsideCollapsed=!isAsideCollapsed" />
    <div :class="`aside-collapse ${isAsideCollapsed&& '--collapsed'}`">
      <div class="aside-main">
        <aside-category
          category-header="Основное"
          :category-items="asideContent.categoryContent"
        />
        <aside-category
          v-if="typeof categories !== 'undefined'"
          category-header="Категории"
          :category-items="categories"
        />
        <aside-category
          v-if="typeof rooms !== 'undefined' && rooms.length"
          category-header="Комнаты"
          :category-items="rooms"
        />
        <aside-category
          v-if="typeof floors !== 'undefined' && floors.length"
          category-header="Этажи"
          :category-items="floors"
        />
      </div>
      <div class="aside-footer">
        <button class="aside-footer__item" @click="colorMode?.changeColorScheme()">
          <span class="mdi mdi-brightness-4" />{{ colorMode?.currentScheme.value === 'scheme-dark'?"Светлая тема":"Темная тема" }}
        </button>
        <button class="aside-footer__item" @click="logout()">
          <span class="mdi mdi-exit-to-app" />
          Выйти
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AsideCategory from '~/components/Aside/AsideCategory.vue'
import { useUserStore } from "~/store/user"
import { type IGetAllResponseItem } from "~/api/category/getAll"
import { useCategoriesStore } from "~/store/categories"
import { useGroupsStore } from "~/store/groups"

const isAsideCollapsed = ref(false)
const asideContent =
    {
      categoryTitle: 'Основное',
      categoryContent: [
        {
          icon: 'home',
          name: 'дом',
          url: '/',
        },
        {
          icon: 'home-automation',
          name: 'автоматизация',
          url: '/automation',
        },
        {
          icon: 'account-outline',
          name: 'профиль',
          url: '/user',
        },
      ],
    }
const categories = ref<{
  icon: string,
  name:string,
  url: string,
  editable?:boolean
  id?:number|string
}[]>()
const asideRooms = ref()
const asideFloors = ref()
const categoriesStore = useCategoriesStore()
const groupsStore = useGroupsStore()
const { rooms, floors } = storeToRefs(groupsStore)
async function getCategories () {
  await categoriesStore.getAll()
  categories.value = categoriesStore.allCategories()
  await groupsStore.getAll()
  asideRooms.value = rooms
  asideFloors.value = floors
}
getCategories()
const colorMode = useColorScheme()
onMounted(() => {
  colorMode?.colorSchemeInit()
})
function logout () {
  const userStore = useUserStore()
  userStore.logout()
}
const route = useRoute()
watch(() => route.fullPath, () => {
  if (isAsideCollapsed.value) {
    isAsideCollapsed.value = false
  }
})
watch(rooms, (newValue) => {
  asideRooms.value = newValue
})
watch(floors, (newValue) => {
  asideFloors.value = newValue
})
</script>

<style lang="scss">

</style>
