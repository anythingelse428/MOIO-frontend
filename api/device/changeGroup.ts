import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiDevicesChangeDevices (groupId:string, devicesIds:string[]) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.put(path + `/v1/devices/update/group`,
      {
        groupId,
        devicesIds,
      },
    )
  })
}

