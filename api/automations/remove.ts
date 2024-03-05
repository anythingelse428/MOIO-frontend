export default async function apiAutomationsRemove (props:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.delete(path + '/v1/automations/remove', { data: props })
      if (response?.status === 200) {
        useNotification('info', 'Автоматизация успешно удалена')
        setTimeout(() => {
          window.history.back()
        }, 1000)
      }
      return response
    } catch {
      console.log('Ошибка в удалении автоматизации')
    }
  })
}
