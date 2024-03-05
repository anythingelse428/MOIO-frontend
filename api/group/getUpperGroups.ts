import type { AxiosError } from "axios"
import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IGroupResponseItem } from "~/api/group/getAll"

export default async function apiGroupsGetUpperGroups ():Promise<IGroupResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + '/v1/groups/GetUpUserGroup')
      if (response.status === 200) {
        return response
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? "Произошла ошибка в получении домов")
    }
  })
}
