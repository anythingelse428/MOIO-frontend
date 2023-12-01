import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupAddFloor (name:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/Group/addGroup', {
      name: name + " этаж",
      typeId: 2,
    })
  })
}
