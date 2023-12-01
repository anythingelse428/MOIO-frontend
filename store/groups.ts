import { defineStore } from 'pinia'
import { consola } from "consola"

import type { GetAllResponseItem } from "~/api/group/getAll"
import apiGroupGetAll from "~/api/group/getAll"
import apiGroupAddRoom from "~/api/group/addRoom"
import { useCategoriesStore } from "~/store/categories"
export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as GetAllResponseItem[],
  }),
  getters: {
    allGroups: state => state.groups,
    groupById: state => (id:string) => state.groups.find(el => el.id === id),
    floors: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.groups.filter(el => el.typeId === 2), 'floor', 'этаж')
    },
    rooms: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.groups.filter(el => el.typeId === 3), 'room', 'комната')
    },
    houses: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.groups.filter(el => el.typeId === 1), 'house', 'дом')
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
        console.log('Борода в получении групп', e)
      }
    },
    async addGroup (name:string) {
      try {
        const { response } = await apiGroupAddRoom(name)
        if (!response?.status) {
          useNotification('info', 'Комната успешно добавлена')
          await this.getAll()
          this.rooms
        }
      } catch (e) {
        useNotification('error', 'Произошла ошибка при добавлении комнаты')
      }
    },
  },
})
