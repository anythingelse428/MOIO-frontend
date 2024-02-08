export interface IAutomationCreateProps {
  name: string,
  code: string,
  value: string[]
  scenariosOrder: {
     scenarioId: string,
     orderId: number
   }[]
  allConditions: boolean
}

export default async function apiAutomationsCreate (props:IAutomationCreateProps) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/v1/automations/create', props)
  })
}
