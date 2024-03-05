import useAsyncQuery from '~/composables/useAsyncQuery'
import type { IAllDevicesResponse } from "~/api/device/getAll"

export interface IGroupResponseItem{
    id: string,
    parentId: string|null,
    typeId: number|null,
    inverseParent: IGroupResponseItem[],
    clientId?:string
    parent: string|null,
    type: {
        id:string
        code:string|null
        name:string|null
    },
    name: string|null,
    devices: IAllDevicesResponse[],
    groupCreatorId:number
}

export default async function apiGroupGetAll (homeId:string):Promise<IGroupResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + '/v1/groups/' + homeId)
      if (response.status === 200) {
        return response
      }
    } catch {
      useNotification('error', "Произошла ошибка в получении групп")
    }
  })
}
