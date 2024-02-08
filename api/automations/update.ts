export interface IAutomationUpdateProps {
  id: string,
  name: string,
  addScenarios: {
     scenarioId: string,
     orderId: number
   }[]
  removeScenariosIdList: string[]
  newTrigger: string[]
  removeTriggersIdList: string[]
  allConditions: boolean
}

export default async function apiAutomationsUpdate (props:IAutomationUpdateProps) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.put(path + '/v1/automations/update', props)
  })
}
