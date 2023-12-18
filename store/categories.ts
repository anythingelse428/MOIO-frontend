import { defineStore } from 'pinia'
import type { IGetAllResponseItem } from "~/api/category/getAll"
import apiCategoryGetAll from "~/api/category/getAll"
import { type IAllDevicesResponse } from "~/api/device/getAll"
import apiCategoryGetDevicesById, { type IDevicesInCategory } from "~/api/category/getDevicesByCategoryId"
import useIcoByGroupName from "~/composables/useIcoByGroupName"

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as IGetAllResponseItem[],
    devicesInCategory: {} as IDevicesInCategory,
  }),
  getters: {
    allCategories: state => (array = state.categories, urlPrefix = 'category', staticIcon?:string, editable = false, activeId = '-1') => {
      return array.reduce((acc:{name:string, url:string, icon:string, id:any, editable?:boolean, active?:boolean}[], curr, i) => {
        acc[i] =
          {
            name: curr.name,
            url: `/user/${urlPrefix}/${curr.id}`,
            icon: useIcoByGroupName(staticIcon || curr.name)?.name,
            id: curr.id,
            editable,
            active: curr.id === activeId,
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
        useNotification('error', 'Что-то пошло не так с получением категорий')
      }
    },
    async getDevicesByCategoryId (id:number, homeId:string) {
      try {
        this.devicesInCategory = {}
        const data = await apiCategoryGetDevicesById(id, homeId)
        this.devicesInCategory = data
      } catch (e) {
        useNotification('error', 'Что-то пошло не так с получением категории')
      }
    },
  },
})
