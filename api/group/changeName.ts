import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupChangeName (groupId:string, groupName:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.put(path + `/v1/groups/update/name`, { groupId, groupName })
  })
}

