
export default async function apiDeviceChangeIcon (deviceIdChanel:string, iconName:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + '/Device/ChangeDeviceIconByDeviceId', { deviceIdChanel, iconName })
      if (response.status === 200) {
        useNotification('info', "Иконка успешно изменена")
      }
    } catch {
      useNotification('error', "Произошла ошибка при изменении иконки")
    }
  })
}
