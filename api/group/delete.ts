import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupDelete (id:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + `/Group/deleteGroup?id=${id}`)
  })
}

