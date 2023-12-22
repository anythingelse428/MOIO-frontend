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
    return await axios.post(path + '/Group/addGroup', {
      name,
      typeId,
      parentId,
      devicesIds,
      groupIds,
    })
  })
}
