import { type AxiosError } from "axios"

export default async function apiAutomationsRemove (props:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.delete(path + '/v1/automations/remove', { data: props })
      console.log(response)
      if (response?.status === 200) {
        useNotification('info', 'Автоматизация успешно удалена')
        setTimeout(() => {
          useRouter().push('/automation')
        }, 1000)
      }
      return response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Ошибка в удалении автоматизации')
      console.log(e)
    }
  })
}
