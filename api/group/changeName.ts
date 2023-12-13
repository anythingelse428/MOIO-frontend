import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupChangeName (id:string, name:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + `/Group/changeGroupName?groupId=${id}&newName=${name}`)
  })
}

