export interface IAutomationByIdResponse {
  id:string,
  name:string
  scenarios:{
    orderId:number,
    scenarioId:string
  }[]
  triggers:{
    time:{
      automationTriggerId: string,
      time: string
    }[]
    sensors:{
      automationTriggerId: string,
      id: string
      name: string
      type: string
    }[]
  }
  allConditions:boolean
}
export default async function apiAutomationsGetById (id:string):Promise<IAutomationByIdResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/v1/automations/' + id)
  })
}
