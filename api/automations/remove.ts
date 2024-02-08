export default async function apiAutomationsRemove (props:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.delete(path + '/v1/automations/remove', { data: props })
  })
}
