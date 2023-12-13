import useAsyncQuery from "~/composables/useAsyncQuery"

export default async function apiDeviceDelete (deviceId:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/DeleteDevice?deviceIdChanel=' + deviceId)
  })
}
