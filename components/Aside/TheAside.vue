<template>
  <div class="aside">
    <div :class="`aside-trigger mdi mdi-menu ${isAsideCollapsed&& '--collapsed'}`" role="button" @click="isAsideCollapsed=!isAsideCollapsed" />
    <div :class="`aside-collapse ${isAsideCollapsed&& '--collapsed'}`">
      <div class="aside-main">
        <aside-category
          v-for="content in asideContent"
          :key="content.categoryTitle"
          :category-header="content.categoryTitle"
          :category-items="content.categoryContent"
        />
      </div>
      <div class="aside-footer">
        <button class="aside-footer__item" @click="changeColorMode()">
          <span class="mdi mdi-brightness-6" />{{ colorMode.value === 'dark'?"Светлая тема":"Темная тема" }}
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

const isAsideCollapsed = ref(false)
const asideContent = ref(
  [
    {
      categoryTitle: 'Основное',
      categoryContent: [
        {
          icon: 'home',
          title: 'дом',
          url: '/',
        },
        {
          icon: 'star-outline',
          title: 'обзор',
          url: '/overview',
        },
        {
          icon: 'home-automation',
          title: 'автоматизация',
          url: '/automation',
        },
        {
          icon: 'account-outline',
          title: 'профиль',
          url: '/user',
        },
      ],
    },
    {
      categoryTitle: 'Категории',
      categoryContent: [
        {
          icon: 'lightbulb-outline',
          title: 'свет',
          url: '/user/groups/123',
        },
        {
          icon: 'fan',
          title: 'микроклимат',
          url: '/user/groups/12',
        },
        {
          icon: 'shield-outline',
          title: 'безопасность',
          url: '/user/groups/31',
        },
        {
          icon: 'volume-high',
          title: 'электроника',
          url: '/user/groups/64',
        },
        {
          icon: 'water-outline',
          title: 'Вода',
          url: '/user/groups/64',
        },
      ],
    },
    {
      categoryTitle: 'Комнаты',
      categoryContent: [
        {
          icon: 'cube-outline',
          title: 'Комната 1',
          url: '/user/groups/11',
        },
        {
          icon: 'cube-outline',
          title: 'Комната 2',
          url: '/user/groups/41',
        },
        {
          icon: 'cube-outline',
          title: 'Комната 3',
          url: '/user/groups/13',
        },
        {
          icon: 'cube-outline',
          title: 'Комната 4',
          url: '/user/groups/62',
        },
      ],
    },
  ],
)

const colorMode = useColorMode()
console.log(colorMode.preference)
console.log(localStorage.getItem('nuxt-color-mode'))
colorMode.value = localStorage.getItem('nuxt-color-mode') || 'dark' // из конфига, раздел colorMode, storageKey
function changeColorMode () {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  setTimeout(() => {
    localStorage.setItem('nuxt-color-mode', colorMode.value)
  }, 1)
}
onMounted(() => {
  const theme = localStorage.getItem('nuxt-color-mode')
  if (theme && theme?.length > 1) {
    colorMode.value = theme
  }
})
function logout () {
  const userStore = useUserStore()
  userStore.logout()
}
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
      top: -48px;
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
