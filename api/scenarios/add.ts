
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
    console.log(props)
    return await axios.post(path + '/Scenarios/CreateScenarios', props)
  })
}
