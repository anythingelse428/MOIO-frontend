import { type AxiosError } from "axios"

export default async function apiScenariosExecute (id:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.post(path + '/v1/scenarios/exec/' + id)
      if (response.status === 200) {
        useNotification('info', 'Сценарий успешно запущен')
        return response
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Ошибка при запуске сценария')
    }
  })
}
