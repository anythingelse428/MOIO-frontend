import type { Store } from "pinia"
import { useGroupsStore } from "~/store/groups"
import type { IAllDevicesResponse } from "~/api/device/getAll"
import { useCategoriesStore } from "~/store/categories"
import type { IGroupResponseItem } from "~/api/group/getAll"
import type { IDevicesInCategory } from "~/api/category/getDevicesByCategoryId"

export default function useChangeDeviceCapability (deviceId:string, capabilityType:string, newValue:any, property:keyof IAllDevicesResponse["capabilities"][0] = 'value') {
  const groupStore = useGroupsStore()
  const categoriesStore = useCategoriesStore()
  console.log('val', newValue)
  function setNewProperty (state: { [key:string]: IDevicesInCategory }):void {
    let device = {} as IAllDevicesResponse | undefined
    for (const [k, v] of Object.entries(state?.devices || state?.devicesInCategory)) {
      if (device?.id) {
        break
      }
      device = v.find(el => el.id.includes(deviceId))
    }
    console.log(device?.id)
    if (device?.id) {
      const capability = device.capabilities.find(el => el?.type.includes(capabilityType))
      if (capability) {
        capability[property] = newValue
      }
    }
  }
  groupStore.$patch((state) => {
    setNewProperty(state)
  })
  categoriesStore.$patch((state) => {
    setNewProperty(state)
  })
}
