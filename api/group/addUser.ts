import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupAddUser (usersLogins:string[], groupsIds:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/v1/groups/addUsersToGroup', {
      usersLogins,
      groupsIds,
    })
  })
}
