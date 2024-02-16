
export default async function apiUserChangeName (newName:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/v1/users/name', { newName })
      if (response.status === 200) {
        useNotification('info', 'Имя успешно изменено')
      }
    } catch {
      useNotification('error', 'Произошла ошибка при смене имени')
    }
  })
}
