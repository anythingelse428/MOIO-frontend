import { defineStore } from 'pinia'
import { consola } from "consola"

import type { IGroupResponseItem } from "~/api/group/getAll"
import apiGroupGetAll from "~/api/group/getAll"
import apiGroupAddRoom from "~/api/group/addRoom"
import { useCategoriesStore } from "~/store/categories"
import type { IDevicesInCategory } from "~/api/category/getDevicesByCategoryId"
import apiGroupGetDevicesById from "~/api/group/getDevicesByGroupId"
import apiGroupsGetUpperGroups from "~/api/group/getUpperGroups"
export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as IGroupResponseItem[],
    devices: {} as IDevicesInCategory,
    uppperGroups: [] as IGroupResponseItem[],
  }),
  getters: {
    allGroups: state => state.groups,
    groupById: state => (id:string) => state.groups.find(el => el.id === id),
    floors: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.groups.filter(el => el.typeId === 2), 'group', 'этаж')
    },
    rooms: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.groups.filter(el => el.typeId === 3), 'group', 'комната')
    },
    houses: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.uppperGroups, 'group', 'дом')
    },
  },
  actions: {
    async getAll () {
      try {
        const data = await apiGroupGetAll()
        if (data.length) {
          this.groups = data
        }
      } catch (e) {
        useNotification('error', "Произошла ошибка в получении групп")
      }
    },
    async getHouses () {
      try {
        const response = await apiGroupsGetUpperGroups()
        this.uppperGroups = response
      } catch {
        useNotification('error', "Произошла ошибка в получении домов")
      }
    },
    async addRoom (name:string, parentId?:string, devices?:string[]) {
      try {
        const { response } = await apiGroupAddRoom({ name, parentId, devices })
        if (!response?.status) {
          useNotification('info', 'Комната успешно добавлена')
          await this.getAll()
          this.rooms
        }
      } catch (e) {
        useNotification('error', 'Произошла ошибка при добавлении комнаты')
      }
    },
    async getDevicesByGroupId (id:string) {
      try {
        const data = await apiGroupGetDevicesById(id)
        if (data) {
          this.devices = data
        }
      } catch {
        useNotification('error', 'Произошла непредвиденная ошибка')
      }
    },
  },
})
