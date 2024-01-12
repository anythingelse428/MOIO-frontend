import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupAddUser (usersLogins:string[], groupId:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/Group/addUsersToGroup', {
      usersLogins,
      groupId,
    })
  })
}
