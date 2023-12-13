import useAsyncQuery from '~/composables/useAsyncQuery'
// TODO перенести этот запрос в группы на бэке
// TODO перенести этот запрос в группы на фронте
export default async function apiDevicesChangeDevices (id:string, devices:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + `/Device/changeDevicesGroup?groupId=${id}`,
      [...devices],
    )
  })
}

