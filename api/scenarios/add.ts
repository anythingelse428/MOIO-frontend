
export interface IAddScenario {
  name: string,
  devicesValueStates:{
    [key:string]:{
      type:string,
      value:any,
      hsv?:{
        h:number,
        s:number,
        v:number
      }
    }[]
  }
}
export default async function apiScenariosAdd (props:IAddScenario) {
  return await useAsyncQuery(async ({
    axios,
    path,
  }) => {
    try {
      const response = await axios.post(path + 'v1/scenarios/create', props)
      if (response.status === 200) {
        useNotification('info', "Сценарий успешно добавлен")
      }
    } catch {
      useNotification('error', "Произошла ошибка при создании сценария")
    }
  })
}
