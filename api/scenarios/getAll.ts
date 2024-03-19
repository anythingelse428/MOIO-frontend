import useValidationBackendError from "~/composables/useValidationBackendError"

export interface IAllScenariosResponse {
  id:string,
  name:string
}
export default async function apiScenariosGetAll ():Promise<IAllScenariosResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + '/v1/scenarios')
      return response.status === 200 && response
    } catch (e) {
      useValidationBackendError(e, 'Ошибка при получении сценарев')
    }
  })
}
