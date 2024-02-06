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
          <icon name="aside/theme" size="28" />{{ colorMode?.currentScheme.value === 'scheme-dark'?"Светлая тема":"Темная тема" }}
        </button>
        <button class="aside-footer__item" @click="logout()">
          <icon name="aside/logout" size="26" />
          Выйти
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AsideCategory from '~/components/Aside/AsideCategory.vue'
import { useUserStore } from "~/store/user"
import { useCategoriesStore } from "~/store/categories"
import { useGroupsStore } from "~/store/groups"
import Icon from "~/components/shared/Icon.vue"
import type { TUiIconNames } from "#build/types/ui-icon"

export interface IAsideContent {
  categoryTitle:string
  categoryContent:{
    icon:TUiIconNames
    name:string,
    url:string
  }[]
}
const categoriesStore = useCategoriesStore()
const groupsStore = useGroupsStore()
const { rooms, floors } = storeToRefs(groupsStore)
const route = useRoute()
const isAsideCollapsed = ref(false)
const asideContent:IAsideContent =
    {
      categoryTitle: 'Основное',
      categoryContent: [
        {
          icon: 'aside/home',
          name: 'дом',
          url: '/',
        },
        {
          icon: 'aside/automation',
          name: 'автоматизация',
          url: '/automation',
        },
        {
          icon: 'aside/profile',
          name: 'профиль',
          url: '/user',
        },
        {
          icon: 'aside/scenarios',
          name: 'сценарии',
          url: '/scenarios',
        },
      ],
    }
const categories = ref<{
  icon: TUiIconNames,
  name:string,
  url: string,
  editable?:boolean
  id?:number|string
}[]>()
const asideRooms = ref()
const asideFloors = ref()

async function getCategories () {
  await categoriesStore.getAll()
  categories.value = categoriesStore.allCategories()
  await groupsStore.getAll()
  asideRooms.value = rooms
  asideFloors.value = floors
}
getCategories()
const colorMode = useColorScheme()

function logout () {
  const userStore = useUserStore()
  userStore.logout()
}

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

onMounted(() => {
  colorMode?.colorSchemeInit()
})
</script>

<style lang="scss">

</style>
