import { defineStore } from 'pinia'

import type { IGroupResponseItem } from "~/api/group/getAll"
import apiGroupGetAll from "~/api/group/getAll"
import apiGroupAddRoom from "~/api/group/addRoom"
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
import apiGroupsGetSubgroups from "~/api/group/getSubgroups"
import apiGroupCheckCode from "~/api/group/checkCode"
import useIcoByGroupName from "~/composables/useIcoByGroupName"
import type { AsideCategory } from "~/components/Aside/AsideCategory.vue"

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as IGroupResponseItem[],
    devices: {} as IDevicesInCategory,
    uppperGroups: [] as IGroupResponseItem[],
    currentHome: '',
    clientId: '',
    currentGroup: {} as IGroupResponseItem,
  }),
  getters: {
    allGroups: state => state.groups,
    groupById: state => (id:string) => state.groups.find(el => el.id === id),
    group: state => state.currentGroup,
    formattedGroup: (state) => {
      return (typeId:number) => {
        const { id } = useUserStore()
        return state[typeId === 1 ? 'uppperGroups' : 'groups']
          .reduce((acc:AsideCategory['categoryItems'], curr:AsideCategory['categoryItems'][0]) => {
            if (curr.typeId === typeId) {
              acc.push(
                {
                  name: curr.name,
                  url: `/user/group/${curr.id}`,
                  icon: useIcoByGroupName(String(typeId))?.name,
                  id: curr.id,
                  isEditable: curr.groupCreatorId === id,
                  typeId: curr.typeId,
                  isActive: curr.id === state.currentHome,
                },
              )
            }
            return acc
          }, [])
      }
    },
    floors () {
      return this.formattedGroup(2)
    },
    rooms () {
      return this.formattedGroup(3)
    },
    houses () {
      return this.formattedGroup(1)
    },
  },
  actions: {
    async getAll (groupId?:string) {
      const id = groupId ?? this.currentHome
      if (id?.length > 0) {
        const data = await apiGroupGetAll(id)
        if (data?.length) {
          this.groups = data
        }
      }
    },
    async getHouses () {
      const response = await apiGroupsGetUpperGroups()
      const user = useUserStore()
      if (!Number.isInteger(user.id)) {
        await user.init()
      }
      this.uppperGroups = response
      if (localStorage.getItem('moio-current-home')?.length) {
        this.currentHome = localStorage.getItem('moio-current-home') as string
      } else {
        this.currentHome = response.find(el => el.groupCreatorId === user.userInfo.id)?.id ?? this.uppperGroups[0]?.id
        localStorage.setItem('moio-current-home', this.currentHome)
      }
      this.clientId = this.uppperGroups.find(el => el.id === this.currentHome)?.clientId ?? ''
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
          useNotification('info', 'Группа успешно добавлена')
          setTimeout(() => {
            window.location.href = useRuntimeConfig().app.baseURL || '/'
          }, 1000)
          await this.getAll()
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
    async getSubgroups (id:string) {
      return await apiGroupsGetSubgroups(id)
    },
    async changeName (id:string, name:string) {
      try {
        await apiGroupChangeName(id, name)
        await this.getAll()
        useNotification('info', 'Имя группы успешно изменено')
      } catch {
        useNotification('error', 'Произошла ошибка при смене названия')
      }
    },
    async changeDevices (id:string, devices:string[]) {
      await apiDevicesChangeDevices(id, devices)
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
    async addUserToGroup (logins:string[], groupId:string[]) {
      await apiGroupAddUser(logins, groupId)
    },
    async removeUsersFromGroup (groupIds:string[], logins:string[], ids:number[]) {
      await apiGroupRemoveUsers(groupIds, logins, ids)
    },
    async getUsersByGroupId (id:string) {
      return await apiGroupGetUserByGroupId(id)
    },
    async checkCode (code:string) {
      return await apiGroupCheckCode(code)
    },
  },
})
