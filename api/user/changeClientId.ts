
export default async function apiUserChangeClientId (clientId:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/users/clientId', { clientId })
      if (response.status === 200) {
        useNotification('info', 'ClientId успешно изменен')
        return response
      }
    } catch {
      useNotification('error', 'Произошла ошибка при смене ClientId')
    }
  })
}
