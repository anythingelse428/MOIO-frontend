import { defineStore } from 'pinia'
import type { IRegisterUserProps } from '~/api/user/register'
import apiUserRegister from '~/api/user/register'
import type { IAuthUserProps } from "~/api/user/auth"
import apiUserAuth from "~/api/user/auth"
import getUserInfo from "~/api/user/getUserInfo"
import apiUserRefreshToken from "~/api/user/refreshToken"
import useSetCookie from "~/composables/useSetCookie"
import apiUserLogout from "~/api/user/logout"
import type { IAddScenario } from "~/api/scenarios/add"
import apiScenariosAdd from "~/api/scenarios/add"
import apiScenariosGetAll from "~/api/scenarios/getAll"
import apiScenariosGetById from "~/api/scenarios/getById"
import type { IScenarioUpdateProps } from "~/api/scenarios/update"
import apiScenariosUpdate from "~/api/scenarios/update"
import apiScenariosExecute from "~/api/scenarios/execute"
import apiScenariosDelete from "~/api/scenarios/delete"
import type { IAutomationCreateProps } from "~/api/automations/create"
import apiAutomationsCreate from "~/api/automations/create"
import apiAutomationsGetAll from "~/api/automations/getAll"
import apiAutomationsGetById from "~/api/automations/getById"
import apiAutomationsRemove from "~/api/automations/remove"
import apiAutomationsUpdate, { type IAutomationUpdateProps } from "~/api/automations/update"

export const useAutomationStore = defineStore('automation', {
  state: () => (
    {
    }),
  getters: {

  },
  actions: {
    async create (props:IAutomationCreateProps) {
      return await apiAutomationsCreate(props)
    },
    async getAll () {
      return await apiAutomationsGetAll()
    },
    async getById (id:string) {
      return await apiAutomationsGetById(id)
    },
    async deleteAutomation (id:string) {
      return await apiAutomationsRemove([id])
    },
    async update (props:IAutomationUpdateProps) {
      return await apiAutomationsUpdate(props)
    },
  },
})
