import type { AxiosError } from "axios"

export default async function apiUserChangeName (newName:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/users/name', { newName })
      if (response.status === 200) {
        useNotification('info', 'Имя успешно изменено')
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка при смене имени')
    }
  })
}
