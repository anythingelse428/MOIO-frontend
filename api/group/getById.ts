import useAsyncQuery from '~/composables/useAsyncQuery'
import type { IAllDevicesResponse } from "~/api/device/getAll"

export interface IGroupResponseItem{
    id: string,
    parentId: string|null,
    typeId: number|null,
    inverseParent: any[],
    parent: string|null,
    type: {
        id:string
        code:string|null
        name:string|null
    },
    name: string|null,
    devices:IAllDevicesResponse[],
    groupCreatorId:number,
}
export default async function apiGroupGetById (id:string):Promise<IGroupResponseItem> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/Group/GetGroupById?groupId=' + id)
  })
}
