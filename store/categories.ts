import { defineStore } from 'pinia'
import type { IGetAllResponseItem } from "~/api/category/getAll"
import apiCategoryGetAll from "~/api/category/getAll"
import apiCategoryGetDevicesById, { type IDevicesInCategory } from "~/api/category/getDevicesByCategoryId"
import useIcoByGroupName from "~/composables/useIcoByGroupName"
import type { AsideCategory } from "~/components/Aside/AsideCategory.vue"

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as IGetAllResponseItem[],
    devicesInCategory: {} as IDevicesInCategory,
  }),
  getters: {
    allCategories: state => (array = state.categories) => {
      return array.reduce((
        acc:AsideCategory['categoryItems'],
        curr:AsideCategory['categoryItems'][0]) => {
        acc.push(
          {
            name: curr.name,
            url: `/user/category/${curr.id}`,
            icon: useIcoByGroupName(curr.name)?.name,
            id: curr.id,
          })
        return acc
      }, [])
    },
    devices: state => state.devicesInCategory,
    categoryById: state => (id:string|number) => state.categories.find(e => String(e.id) === String(id)),
  },
  actions: {
    async getAll () {
      try {
        const data = await apiCategoryGetAll()
        if (data.length) {
          this.categories = data
        }
      } catch (e) {
        useNotification('error', 'Что-то пошло не так с получением категорий')
      }
    },
    async getDevicesByCategoryId (id:number, homeId:string) {
      try {
        this.devicesInCategory = {}
        const data = await apiCategoryGetDevicesById(id, homeId)
        // console.log('dataFrom GetDevicesByCategoryAndGroup', data)
        this.devicesInCategory = data
      } catch (e) {
        useNotification('error', 'Что-то пошло не так с получением категории')
      }
    },
  },
})
