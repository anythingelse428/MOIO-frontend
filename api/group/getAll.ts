import useAsyncQuery from '~/composables/useAsyncQuery'
import type { Service } from "~/components/Service/TheService.vue"

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
    devices:Service[],
    groupCreatorId:number
}

export default async function apiGroupGetAll (homeId:string):Promise<IGroupResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/Group/GetUserGroups?groupId=' + homeId)
  })
}
