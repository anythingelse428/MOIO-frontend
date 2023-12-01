import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupAddRoom (name:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/Group/addGroup', {
      name,
      typeId: 3,
    })
  })
}
