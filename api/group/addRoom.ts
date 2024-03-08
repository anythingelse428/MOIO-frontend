import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IAddGroupPayload {
  name: string,
  typeId?: number,
  parentId?:string,
  devicesIds?: string[]
  groupIds?: string[]
}
export default async function apiGroupAddRoom ({ name, typeId, parentId, devicesIds, groupIds }:IAddGroupPayload) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.post(path + '/v1/groups/AddGroup', {
        name,
        typeId,
        parentId,
        devicesIds,
        groupIds,
      })
      return response.status === 200 && response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка при создании группы')
    }
  })
}
