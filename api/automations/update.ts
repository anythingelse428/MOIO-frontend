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
    return await axios.put(path + '/v1/automations/update', props)
  })
}
