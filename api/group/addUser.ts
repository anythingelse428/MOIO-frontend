import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupAddUser (usersLogins:string[], groupsIds:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.post(path + '/v1/groups/addUsersToGroup', {
        usersLogins,
        groupsIds,
      })
      if (response?.status === 200) {
        useNotification('info', 'Пользователям был отправлен пригласительный код')
        return response
      }
    } catch {
      useNotification('error', 'Произошла ошибка')
    }
  })
}
