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

export const useScenarioStore = defineStore('scenario', {
  state: () => (
    {
    }),
  getters: {

  },
  actions: {
    async createScenario (props:IAddScenario) {
      try {
        const data = await apiScenariosAdd(props)
        console.log(data)
      } catch (e) {

      }
    },
    async getAll () {
      try {
        const data = await apiScenariosGetAll()
        if (data?.data) {
          return data.data
        }
      } catch (e) {

      }
    },
    async getById (id:string) {
      try {
        const data = await apiScenariosGetById(id)
        if (data?.data) {
          return data.data
        }
      } catch {

      }
    },
    async updateScenario (data:IScenarioUpdateProps) {
      try {
        const response = await apiScenariosUpdate(data)
        console.log(response)
        if (response) {
          return response
        }
      } catch {

      }
    },
  },
})
