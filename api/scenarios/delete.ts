import router from "#app/plugins/router"

export default async function apiScenariosDelete (id:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response =
      await axios.post(path + '/Scenarios/DeleteScenarios', { scenariosIds: [id] })
      if (response.status === 200) {
        useNotification('info', "Сценарий успешно удален")
        setTimeout(() => useRouter().back(), 1000)
      }
    } catch (e) {
      useNotification('error', "Произошла ошибка при удалении")
    }
  })
}
