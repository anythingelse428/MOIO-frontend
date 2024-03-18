import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IGroupUser {
  userLogin:string
  canAutomate: boolean
}
export interface IAddUserToGroupProps {
  groupsIds:string[]
  userPendingAutomationPermission:IGroupUser[]
}

export default async function apiGroupAddUser (data:IAddUserToGroupProps) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.post(path + '/v1/groups/addUsersToGroup', { ...data })
      if (response?.status === 200) {
        useNotification('info', 'Пользователям был отправлен пригласительный код')
        return response
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка, проверьте введенные данные')
    }
  })
}
