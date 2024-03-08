import { type AxiosError } from "axios"


export interface IChangeLoginPayload {
    newLogin:string,
    password:string
    confirmationCode?:string
}
export default async function apiUserChangeLogin (props:IChangeLoginPayload) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/users/login', { ...props })
      if (response.status === 200) {
        useNotification('info',
          props.confirmationCode
            ? 'Данные успешно изменены'
            : 'На ваш email был отправлен код подтверждения',
        )
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка при смене почты')
    }
  })
}
