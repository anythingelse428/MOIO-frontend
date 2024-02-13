
export default async function apiScenariosExecute (id:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/v1/scenarios/exec/' + id)
  })
}
