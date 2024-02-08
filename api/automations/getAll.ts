export interface IAutomationGetAllResponse {
  id:string,
  name:string
}
export default async function apiAutomationsGetAll ():Promise<IAutomationGetAllResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/v1/automations')
  })
}
