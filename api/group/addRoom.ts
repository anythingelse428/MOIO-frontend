import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IAddGroupPayload {
  name: string,
  typeId?: number,
  parentId?:string
}
export default async function apiGroupAddRoom ({ name, typeId = 3, parentId }:IAddGroupPayload) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/Group/addGroup', {
      name,
      typeId,
    })
  })
}
