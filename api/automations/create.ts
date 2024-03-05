export interface IAutomationCreateProps {
  name: string,
  value: string[]
  scenariosOrder: {
     scenarioId: string,
     orderId: number
   }[]
  allConditions: boolean
}

export default async function apiAutomationsCreate (props:IAutomationCreateProps) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.post(path + '/v1/automations/create', props)
      if (response.status === 200) {
        useNotification('info', 'Автоматизация успешно создана')
      }
      return response
    } catch {

    }
  })
}
