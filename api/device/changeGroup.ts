import { type AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiDevicesChangeDevices (groupId:string, devicesIds:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + `/v1/devices/update/group`,
        {
          groupId,
          devicesIds,
        },
      )
      if (response.status === 200) {
        useNotification('info', 'Девайсы в группе успешно изменены')
        return response
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка при смене устройств')
    }
  })
}

