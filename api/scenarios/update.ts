
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
    console.log(await axios.post(path + '/scenarios/updateScenarios', props))
    return await axios.post(path + '/scenarios/updateScenarios', props)
  })
}
