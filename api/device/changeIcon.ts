import type { AxiosError } from "axios"

export default async function apiDeviceChangeIcon (deviceId:string, iconName:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/devices/update/icon', { deviceId, iconName })
      if (response.status === 200) {
        useNotification('info', "Иконка успешно изменена")
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка при изменении иконки')
    }
  })
}
