import { type IGroupResponseItem } from "~/api/group/getById"

export default function useScenarioToggleSelected (id:string, data:IGroupResponseItem) {
  let idx = data.devices.findIndex(el => el.id === id)
  if (idx > -1) {
    data.devices[idx].selected = !data.devices[idx].selected
    return idx
  }
  if (data.inverseParent?.length > 0) {
    for (let i = 0; i < data.inverseParent.length; i++) {
      if (idx > -1) { break }
      idx = toggleSelected(id, data.inverseParent[i])
    }
  }
  return idx
}
