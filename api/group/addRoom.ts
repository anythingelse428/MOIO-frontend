import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IAddGroupPayload {
  name: string,
  typeId?: number,
  parentId?:string,
  devicesIds?: string[]
}
export default async function apiGroupAddRoom ({ name, typeId = 3, parentId, devicesIds }:IAddGroupPayload) {
  return await useAsyncQuery(async ({ axios, path }) => {
    console.log(
      name,
      typeId,
      parentId,
      devicesIds,
    )
    return await axios.post(path + '/Group/addGroup', {
      name,
      typeId,
      parentId,
      devicesIds,
    })
  })
}
