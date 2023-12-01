import useAsyncQuery from '~/composables/useAsyncQuery'

export interface GetAllResponseItem {
    id: number|string,
    name: string,
    devices: any
}

export default async function apiCategoryGetAll ():Promise<GetAllResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/category/getCategories')
  })
}
