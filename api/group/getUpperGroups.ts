import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IGroupResponseItem } from "~/api/group/getAll"

export default async function apiGroupsGetUpperGroups ():Promise<IGroupResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/v1/groups/GetUpUserGroup')
  })
}
