import useValidationBackendError from "~/composables/useValidationBackendError"

export interface IScenarioUpdateProps {
  id:string,
  name:string,
  devicesValueStates:{
    [key:string]:{
      type:string,
      value:string,
      hsv?:{h:number, s:number, v:number}
    }[]
  },
  removeDevicesId:string[]
}
export default async function apiScenariosUpdate (props:IScenarioUpdateProps) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/scenarios/update', props)
      if (response.status === 200) {
        useNotification('info', 'Сценарий успешно обновлен')
        return response
      }
    } catch (e) {
      useValidationBackendError(e, 'Ошибка при получении сценария')
    }
  })
}
