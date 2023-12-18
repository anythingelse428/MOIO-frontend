import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IGetAllResponseItem {
    id: number|string,
    name: string,
    devices: any
}

export default async function apiCategoryGetAll ():Promise<IGetAllResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/category/getCategories')
  })
}
