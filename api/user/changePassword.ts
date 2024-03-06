

export interface IChangePasswordPayload {
    oldPassword:string,
    newPassword:string
    confirmationCode?:string
}
export default async function apiUserChangePassword (props:IChangePasswordPayload) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/users/password', { ...props })
      if (response.status === 200) {
        useNotification('info',
          props.confirmationCode
            ? 'Данные успешно изменены'
            : 'На ваш email был отправлен код подтверждения',
        )
      }
    } catch {
      useNotification('error', 'Произошла ошибка при смене пароля')
    }
  })
}
