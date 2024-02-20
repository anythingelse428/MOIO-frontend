import { defineStore } from 'pinia'
import type { IAddScenario } from "~/api/scenarios/add"
import apiScenariosAdd from "~/api/scenarios/add"
import apiScenariosGetAll from "~/api/scenarios/getAll"
import apiScenariosGetById from "~/api/scenarios/getById"
import type { IScenarioUpdateProps } from "~/api/scenarios/update"
import apiScenariosUpdate from "~/api/scenarios/update"
import apiScenariosExecute from "~/api/scenarios/execute"
import apiScenariosDelete from "~/api/scenarios/delete"

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
        // console.log(data)
      } catch (e) {

      }
    },
    async getAll () {
      try {
        const data = await apiScenariosGetAll()
        // console.log(data)
        return data
      } catch (e) {
        console.log(e)
      }
    },
    async getById (id:string) {
      try {
        const data = await apiScenariosGetById(id)
        if (data) {
          return data
        }
      } catch {

      }
    },
    async executeScenario (id:string) {
      return await apiScenariosExecute(id)
    },
    async updateScenario (data:IScenarioUpdateProps) {
      try {
        const response = await apiScenariosUpdate(data)
        // console.log(response)
        if (response) {
          return response
        }
      } catch {

      }
    },
    async deleteScenario (id:string) {
      await apiScenariosDelete(id)
    },
  },
})
