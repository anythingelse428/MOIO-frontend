import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupDelete (groupId:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.delete(path + `/v1/groups/remove`, { data: { groupId } })
  })
}

