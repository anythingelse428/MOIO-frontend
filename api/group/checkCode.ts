
export default async function apiGroupCheckCode (code:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.post(path + '/group/checkCode?code=' + code)
      if (response.status === 200) {
        useNotification('info', 'Приглашение подтверждено')
      }
    } catch (e) {
      useNotification('error', 'Код не действителен или введен не верно')
    }
  })
}
