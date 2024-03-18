import { type AxiosError } from "axios"
import type { IAutomationValue } from "~/api/automations/create"

export interface IAutomationUpdateProps {
  id: string,
  name: string,
  scenarios: {
     scenarioId: string,
     orderId: number
   }[]
  newTriggers: IAutomationValue[]
  removeTriggersIds: string[]
  allConditions: boolean
}

export default async function apiAutomationsUpdate (props:IAutomationUpdateProps) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/automations/update', props)
      if (response.status === 200) {
        useNotification('info', 'Автоматизация обновлена')
      }
      return response
    } catch (e) {
      if ((e as any)?.response?.data?.length) {
        useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Что-то пошло не так')
      }
      if ((e as any)?.response?.data?.errors?.NewTrigger?.length) {
        e.response.data.errors.NewTrigger.forEach((el) => {
          useNotification('error', el)
        })
      }
    }
  })
}
