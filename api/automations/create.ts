import { type AxiosError } from "axios"

export interface IAutomationValue {
  timeRange?:{
    startTime:string
    endTime:string
  },
  deviceId?:string
  temperatureRange?: {
    min: number,
    max: number
  },
  automationCondition?: {
    value: number,
    condition: 0 | 1 | 2
  },
  time?: string
}
export interface IAutomationCreateProps {
  name: string,
  value: IAutomationValue[]
  scenariosOrder: {
     scenarioId: string,
     orderId: number
   }[]
}
export default async function apiAutomationsCreate (props:IAutomationCreateProps) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.post(path + '/v1/automations/create', props)
      if (response.status === 200) {
        useNotification('info', 'Автоматизация успешно создана')
      }
      return response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Что-то пошло не так')
    }
  })
}
