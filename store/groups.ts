import { defineStore } from 'pinia'

import type { IGroupResponseItem } from "~/api/group/getAll"
import apiGroupGetAll from "~/api/group/getAll"
import apiGroupAddRoom from "~/api/group/addRoom"
import { useCategoriesStore } from "~/store/categories"
import type { IDevicesInCategory } from "~/api/category/getDevicesByCategoryId"
import apiGroupGetDevicesById from "~/api/group/getDevicesByGroupId"
import apiGroupsGetUpperGroups from "~/api/group/getUpperGroups"
import apiGroupGetById from "~/api/group/getById"
import apiGroupChangeName from "~/api/group/changeName"
import apiDevicesChangeDevices from "~/api/device/changeGroup"
import apiGroupDelete from "~/api/group/delete"
import { useUserStore } from "~/store/user"
import apiGroupAddUser from "~/api/group/addUser"
import apiGroupGetUserByGroupId from "~/api/group/getUsersByGroupId"
import apiGroupRemoveUsers from "~/api/group/removeUsers"
export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as IGroupResponseItem[],
    devices: {} as IDevicesInCategory,
    uppperGroups: [] as IGroupResponseItem[],
    currentHome: '',
    currentGroup: {} as IGroupResponseItem,
  }),
  getters: {
    allGroups: state => state.groups,
    groupById: state => (id:string) => state.groups.find(el => el.id === id),
    group: state => state.currentGroup,
    floors: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.groups.filter(el => el.typeId === 2), 'group', 'этаж', true)
    },
    rooms: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.groups.filter(el => el.typeId === 3), 'group', 'комната', true)
    },
    houses: (state) => {
      const categoriesStore = useCategoriesStore()
      // @ts-ignore
      return categoriesStore.allCategories(state.uppperGroups, 'group', 'дом', false, state.currentHome)
    },
  },
  actions: {
    async getAll (groupId?:string) {
      if (this.currentHome.length > 1 || (groupId && groupId?.length > 1)) {
        try {
          const data = await apiGroupGetAll(this.currentHome.length > 1 ? this.currentHome : groupId)
          console.log(data)
          if (data.length) {
            this.groups = data
          }
        } catch (e) {
          useNotification('error', "Произошла ошибка в получении групп")
        }
      }
    },
    async getHouses () {
      try {
        const response = await apiGroupsGetUpperGroups()
        const user = useUserStore()
        if (!Number.isInteger(user.id)) {
          await user.init()
        }
        this.uppperGroups = response
        if (localStorage.getItem('moio-current-home')?.length) {
          this.currentHome = localStorage.getItem('moio-current-home') as string
        } else {
          this.currentHome = response.find(el => el.groupCreatorId === user.userInfo.id)?.id as string
          localStorage.setItem('moio-current-home', this.currentHome)
        }
      } catch {
        useNotification('error', "Произошла ошибка в получении домов")
      }
    },
    async setCurrentHome (id:string) {
      localStorage.setItem('moio-current-home', id)
      this.currentHome = id
      await this.getAll()
    },
    async addRoom (name:string, typeId = 3, parentId?:string, devicesIds?:string[], groupIds?:string[]) {
      try {
        const { response } = await apiGroupAddRoom({ name, typeId, parentId, devicesIds, groupIds })
        if (!response?.status) {
          useNotification('info', 'Комната успешно добавлена')
          setTimeout(() => {
            window.location.href = useRuntimeConfig().app.baseURL || '/'
          }, 1000)
          this.getAll()
        }
      } catch (e) {
        useNotification('error', 'Произошла ошибка при добавлении комнаты')
      }
    },
    async getDevicesByGroupId (id:string) {
      try {
        this.devices = {}
        const data = await apiGroupGetDevicesById(id)
        if (data) {
          Object.keys(data).forEach((el) => {
            if (data[el].length > 0) {
              this.devices[el] = data[el]
            }
          })
          return this.devices
        }
      } catch {
        useNotification('error', 'Произошла непредвиденная ошибка')
      }
    },
    async getGroupById (id:string) {
      const data = await apiGroupGetById(id)
      this.currentGroup = data
      return data
    },
    async changeName (id:string, name:string) {
      try {
        await apiGroupChangeName(id, name)
        await this.getAll()
        useNotification('info', 'Имя группы успешно изменено')
      } catch {
        useNotification('error', 'Произошла ошибка при смене имени')
      }
    },
    async changeDevices (id:string, devices:string[]) {
      try {
        await apiDevicesChangeDevices(id, devices)
        useNotification('info', 'Девайсы в группе успешно изменены')
      } catch {
        useNotification('error', 'Произошла ошибка при изменении устройств')
        useRouter().push({ path: '/user/group/' + id })
      }
    },
    async deleteGroup (id:string) {
      try {
        await apiGroupDelete(id)
        useNotification('info', 'Группа успешно удалена')
        setTimeout(() => {
          window.location.href = useRuntimeConfig().app.baseURL || '/'
        }, 1000)
        this.getAll()
      } catch {
        useNotification('error', "Произошла ошибка при удалении")
      }
    },
    async addUserToGroup (logins:string[], groupId:string) {
      await apiGroupAddUser(logins, groupId)
    },
    async removeUsersFromGroup (ids:number[], groupId:string) {
      await apiGroupRemoveUsers(ids, groupId)
    },
    async getUsersByGroupId (id:string) {
      return await apiGroupGetUserByGroupId(id)
    },
  },
})
