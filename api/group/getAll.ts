import useAsyncQuery from '~/composables/useAsyncQuery'

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
    devices:any
}

export default async function apiGroupGetAll ():Promise<IGroupResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/Group/GetGroups')
  })
}
