import { defineStore } from 'pinia'
import { consola } from "consola"

import type { GetAllResponseItem } from "~/api/group/getAll"
import apiGroupGetAll from "~/api/group/getAll"
export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as GetAllResponseItem[],
  }),
  getters: {
    allGroups: state => state.groups,
    groupById: state => (id:string) => state.groups.find(el => el.id === id),
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
  },
})
