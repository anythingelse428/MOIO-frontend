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
          <span class="mdi mdi-brightness-6" />{{ colorMode?.currentScheme.value === 'scheme-dark'?"Светлая тема":"Темная тема" }}
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
const rooms = ref()
const floors = ref()
const categoriesStore = useCategoriesStore()
const groupsStore = useGroupsStore()
async function getCategories () {
  await categoriesStore.getAll()
  categories.value = categoriesStore.allCategories()
  await groupsStore.getAll()
  rooms.value = groupsStore.rooms
  floors.value = groupsStore.floors
}
groupsStore.$onAction(({ after }) => {
  after((r) => {
    rooms.value = groupsStore.rooms
    floors.value = groupsStore.floors
  })
})
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
</script>

<style lang="scss">
.aside{
  .aside-collapse{
    z-index: 10;
    position: fixed;
    bottom: 0;
    top: 0;
    width: 284px;
    padding: 24px 0 ;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
    background: $bg-primary;
    gap:60px;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: $bg-primary;
    }
    &::-webkit-scrollbar-thumb {
      background: #2a2a29;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
  @media screen and (max-width: 1200px) {
    .aside-collapse{
      transform: translateX(-100%);
      &.--collapsed{
        transform: translateX(0);
        width: 100%;
      }
    }
    .aside-trigger{
      display: block;
      position: relative;
      z-index: 11;
      font-size: 40px;
      top: -64px;
      right: -24px;
      width: fit-content;
      cursor: pointer;
      &.--collapsed{
        margin-inline-start: calc(100% - 48px - 30px);
        &::before{
          content: '\F0156';
        }
      }
    }
    .--collapsed~.aside-trigger{
      background: #fac;
    }
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: $bg-primary;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2a29;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  &-main{
    display: flex;
    flex-direction: column;
    gap: 38px;
  }
  &-footer{
    display: flex;
    flex-direction: column;
    gap: 15px;
    &__item{
      .mdi{
        font-size: 32px;
      }
      cursor: pointer;
      border: none;
      outline: none;
      background: transparent;
      padding: 0px 24px;
      display: flex;
      align-items: center;
      gap:26px;
      @include aside-item;
    }
  }
}
</style>
