import type { IAutomationValue } from "~/api/automations/create"
import useValidationBackendError from "~/composables/useValidationBackendError"

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
      useValidationBackendError(e, 'Произошла ошибка при обновлении автоматизации')
    }
  })
}
