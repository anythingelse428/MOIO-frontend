import useAsyncQuery from "~/composables/useAsyncQuery"

export default async function apiDeviceChangeName (id:string, newName:string) {
  const query = `deviceId=${id}&newName=${newName}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeDeviceName?' + query)
  })
}
