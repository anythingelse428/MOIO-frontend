import { type GroupList } from "~/components/Group/GroupList.vue"

export default function useScenarioToggleSelected (id:string, data:GroupList) {
  let idx = data.devices.findIndex(el => el.id === id)
  if (idx > -1) {
    data.devices[idx].selected = !data.devices[idx].selected
    return idx
  }
  if (data.inverseParent?.length > 0) {
    for (let i = 0; i < data.inverseParent.length; i++) {
      if (idx > -1) { break }
      idx = useScenarioToggleSelected(id, data.inverseParent[i])
    }
  }
  return idx
}
