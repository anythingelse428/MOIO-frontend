<template>
  <div class="add-group --edit">
    <loader-screen :is-loading="isLoading" />
    <div class="add-group">
      <h1 class="add-group__header">
        Изменить комнату
      </h1>
      <form method="post" class="add-group__form" @submit.prevent="editGroup()">
        <div class="add-group__input-group">
          <label for="group" class="add-group__label">Введите название комнаты</label>
          <input
            id="group"
            v-model="name"
            type="text"
            name="group"
            class="add-group__input"
            placeholder="Название комнаты"
            required
          >
        </div>
        <div v-if="house?.length>1" class="add-group-available-devices">
          <h2 class="add-group-available-devices__header">
            {{ existingDevices?.length?
              'Доступные устройства':
              'Устройства уже распределены по комнатам или не найдены'
            }}
          </h2>
          <div v-if="existingDevices?.length>0" class="add-group-available-devices__list">
            <div
              v-for="device in existingDevices"
              :key="device.id"
              class="add-group-available-devices__list-item"
            >
              <label for="device">{{ device?.name }}</label>
              <div class="add-group-available-devices__list-item-checkbox-wrapper">
                <input
                  id="device"
                  type="checkbox"
                  name="device"
                  :checked="devices.findIndex(el=>el.id == device.id)>-1"
                  @change="(e)=>setItem(devices,{id:device.id,name:device.name})"
                >
                <span class="add-group-available-devices__list-item-checkbox-mask">
                  <Icon name="check" size="24" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="add-group__preview-wrapper">
          <div v-if="previewData.name.length" class="add-group__preview">
            <div class="add-group__preview-section">
              <div class="add-group__preview-section-title">
                Название комнаты
              </div>
              <div class="add-group__preview-section-value">
                {{ previewData.name }}
              </div>
            </div>
            <div class="add-group__preview-section">
              <div class="add-group__preview-section-title">
                Устройства комнаты
              </div>
              <div v-if="devices?.length" class="add-group__preview-section-value">
                <div v-for="item in devices" :key="item.id" class="add-group__preview-section-device">
                  {{ item?.name }}
                  <button
                    class="blank"
                    @click="(e)=>{
                      setItem(devices,{id:item.id,name:item.name});
                      setItem(existingDevices,{id:item.id,name:item.name});
                    }"
                  >
                    <Icon
                      name="delete"
                      color="#D15151"
                      size="20"
                    />
                  </button>
                </div>
              </div>
              <div v-else class="add-group__preview-section-value">
                Нет выбранных устройств
              </div>
            </div>
            <div class="add-group__preview-section">
              <div class="add-group__preview-section-title">
                Гости комнаты
              </div>
              <div v-if="previewData.users?.length" class="add-group__preview-section-value">
                <div v-for="user in previewData.users" :key="user.id" class="add-group__preview-section-device">
                  {{ user?.name }}
                  <button
                    class="blank"
                    @click="(e)=>{
                      usersForRemove.push({id:user.id,name:user.name});
                      users.splice(users.findIndex(el=>el.id === user.id),1)
                    }"
                  >
                    <Icon
                      v-if="user.id !== groupStore.currentGroup.groupCreatorId"
                      name="delete"
                      color="#D15151"
                      size="20"
                    />
                  </button>
                </div>
              </div>
              <div v-else class="add-group__preview-section-value">
                Нет приглашенных пользователей
              </div>
            </div>
          </div>
        </div>
        <div class="add-group__submit-wrapper">
          <input type="submit" class="add-group__submit" value="Сохранить">
        </div>
      </form>
      <form method="post" class="add-group__form --delete" @submit.prevent="deleteGroup()">
        <input type="submit" value="Удалить группу" class="add-group__submit">
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import Icon from "~/components/shared/Icon.vue"

let oldName = ''
const isLoading = ref(false)
const id = useRoute().params.id as string
const name = ref('')
const house = ref("")
const devices = ref<{ id: string, name:string }[]>([])
const users = ref<{id:string|number, name:string}[]>([])
const usersForRemove = ref<{id:string, name:string}[]>([])
const existingDevices = ref<{id:string, name:string}[]>([])
// const existingUsers = ref<IUsersByGroupResponse[]>()
const groupStore = useGroupsStore()
const router = useRouter()
const previewData = ref({
  name,
  devices,
  users,
})

function setItem (target:any, data:{ id: string, name:string }) {
  const isSelected = target?.findIndex(el => el?.id === data.id)
  if (isSelected === -1) {
    target?.push(unref(data))
  }
  if (isSelected > -1 && devices.value.findIndex(el => el.id === data.id) > -1) {
    target?.splice(isSelected, 1)
    if (existingDevices.value.findIndex(el => el.id === data.id) === -1) {
      existingDevices.value.push(data)
    }
  }
}

async function getGroupData () {
  isLoading.value = true
  const data = await groupStore.getGroupById(id)
  const parentData = data?.parentId && await groupStore.getGroupById(data?.parentId)
  users.value = await groupStore.getUsersByGroupId(id)
  if (parentData && parentData?.typeId === 2) {
    // если этаж, то ставим дому ид родителя этажа
    house.value = parentData.parentId ?? groupStore.currentHome
  } else {
    house.value = data?.parentId ?? groupStore.currentHome
  }
  await getDevicesByGroupId(id, devices)
  await getDevicesByGroupId(house.value, existingDevices)
  isLoading.value = false
  users.value = users.value?.filter(el => el.id !== groupStore.currentGroup.groupCreatorId)
  name.value = data.name as string
  oldName = unref(name.value)
}
getGroupData()
async function getDevicesByGroupId (id:string, deviceRef:globalThis.Ref<any>) {
  deviceRef.value = []
  const devices = await groupStore.getDevicesByGroupId(id)
  for (const [key, val] of Object.entries(devices)) {
    deviceRef.value.push(...val.map((el) => {
      return { id: el.id, name: el.name }
    }))
  }
}
async function editGroup () {
  isLoading.value = true
  if (name.value !== oldName) {
    await groupStore.changeName(id, name.value)
  }
  if (existingDevices.value.length > 0) {
    await groupStore.changeDevices(groupStore.currentHome, existingDevices.value.map(el => el.id))
  }
  if (devices.value.length > 0) {
    await groupStore.changeDevices(id, devices.value.map(el => el.id))
  }
  if (usersForRemove.value?.length > 0) {
    await groupStore.removeUsersFromGroup([id], [], usersForRemove.value?.map(el => el.id))
  }
  isLoading.value = false
  setTimeout(() => {
    useRouter().push({ path: '/user/group/' + id })
  }, 1500)
}
async function deleteGroup () {
  await groupStore.deleteGroup(id)
}


</script>
<style lang="scss">
@import "assets/styles/page/user-add-room";
</style>
