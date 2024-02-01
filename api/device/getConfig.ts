export default async function apiDeviceGetConfig () {
  return await useAsyncQuery(async ({ axios, path }) => {
    const response = await axios.get(path + '/Device/GetDeviceConfig')
    console.log(response)
    return response
  })
}
