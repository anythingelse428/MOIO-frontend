import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupAddUser (login:string, groupId:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/Group/addUserToGroup', {
      login,
      groupId,
    })
  })
}
