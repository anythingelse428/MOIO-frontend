import { defineStore } from 'pinia'
import type { GetAllResponseItem } from "~/api/category/getAll"
import apiCategoryGetAll from "~/api/category/getAll"
import { type IAllDevicesResponse } from "~/api/device/getAll"
import apiCategoryGetDevicesById, { type IDevicesInCategory } from "~/api/category/getDevicesByCategoryId"
import useIcoByGroupName from "~/composables/useIcoByGroupName"

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as GetAllResponseItem[],
    devicesInCategory: {} as IDevicesInCategory,
  }),
  getters: {
    allCategories: state => (array = state.categories, urlPrefix = 'category', staticIcon?:string) => {
      return array.reduce((acc:{name:string, url:string, icon:string, id:any}[], curr, i) => {
        acc[i] =
          {
            name: curr.name,
            url: `/user/${urlPrefix}/${curr.id}`,
            icon: useIcoByGroupName(staticIcon || curr.name)?.name,
            id: curr.id,
          }
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
        console.log('Борода в получении категорий', e)
      }
    },
    async getDevicesByCategoryId (id:number) {
      try {
        this.devicesInCategory = {}
        const data = await apiCategoryGetDevicesById(id)
        this.devicesInCategory = data
      } catch (e) {
        useNotification('error', 'Что-то пошло не так с получением категорий')
      }
    },
  },
})
