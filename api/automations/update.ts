export interface IAutomationUpdateProps {
  id: string,
  name: string,
  scenarios: {
     scenarioId: string,
     orderId: number
   }[]
  newTrigger: string[]
  removeTriggersIdList: string[]
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
    } catch {
      console.log('Ошибка редактирования автоматизации')
    }
  })
}
