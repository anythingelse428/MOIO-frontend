import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupRemoveUsers (usersIds:number[], groupId:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/Group/RemoveUserFromGroup', {
      usersLogins: [],
      usersIds,
      groupId,
    })
  })
}
