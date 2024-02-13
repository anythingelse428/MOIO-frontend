import useAsyncQuery from "~/composables/useAsyncQuery"

export default async function apiDeviceChangeName (deviceId:string, deviceName:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeDeviceName?', { deviceId, deviceName })
  })
}
