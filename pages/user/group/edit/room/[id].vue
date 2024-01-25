<template>
  <div class="add-group --edit">
    <div class="add-group">
      <h1 class="add-group__header">
        Изменить комнату
      </h1>
      <form method="post" class="add-group__form" @submit.prevent="editGroup()">
        <div class="add-group__input-group">
          <label for="group" class="add-group__label">Введите название комнаты</label>
          <input id="group" v-model="name" type="text" name="group" class="add-group__input" required placeholder="Название комнаты">
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
              <label for="device">{{ device?.name }} {{ device.id }}</label>
              <div class="add-group-available-devices__list-item-checkbox-wrapper">
                <input id="device" type="checkbox" name="device" :checked="devices.findIndex(el=>el.id == device.id)>-1" @change="(e)=>setItem(devices,{id:device.id,name:device.name})">
                <span class="add-group-available-devices__list-item-checkbox-mask" />
              </div>
            </div>
          </div>
        </div>
        <!--      <div v-if="house?.length>1 && existingUsers?.length" class="add-group-available-devices">-->
        <!--        <h2 class="add-group-available-devices__header">-->
        <!--          Добавьте гостей-->
        <!--        </h2>-->
        <!--        <div class="add-group-available-devices__list" v-if="existingUsers?.length>0">-->
        <!--          <div-->
        <!--              v-for="user in existingUsers"-->
        <!--              :key="user.id"-->
        <!--              class="add-group-available-devices__list-item"-->
        <!--          >-->
        <!--            <label for="device">{{ user?.name }}</label>-->
        <!--            <div class="add-group-available-devices__list-item-checkbox-wrapper" v-if="user.id !== groupStore.currentGroup.groupCreatorId">-->
        <!--              <input id="device" type="checkbox" name="device" @change="(e)=>setItem(e,users,{id:user.id,name:user.name})" :checked="users?.findIndex(el=>el.id === user.id)>-1">-->
        <!--              <span class="add-group-available-devices__list-item-checkbox-mask" />-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <!--      </div>-->
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
              <div v-if="previewData.devices?.length" class="add-group__preview-section-value">
                <div v-for="item in previewData.devices" :key="item.id" class="add-group__preview-section-device">
                  {{ item?.name }} {{ item.id }}
                  <span class="mdi mdi-delete" @click="(e)=>{setItem(devices,{id:item.id,name:item.name});setItem(existingDevices,{id:item.id,name:item.name});}" />
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
                  <span v-if="user.id !== groupStore.currentGroup.groupCreatorId" class="mdi mdi-delete" @click="(e)=>{usersForRemove.push({id:user.id,name:user.name});setItem(users,{id:user.id,name:user.name});}" />
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
import type { IUsersByGroupResponse } from "~/api/group/getUsersByGroupId"

const id = useRoute().params.id as string
let oldName = ''
const oldDevices:string[] = []
const name = ref('')
const house = ref("")
const devices = ref<{ id: string, name:string }[]>([])
const users = ref<{id:number, name:string}[]>()
const usersForRemove = ref<{id:number, name:string}[]>([])
const existingDevices = ref<{id:number, name:string}[]>([])
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
  if (isSelected > -1 && devices.value.findIndex(el => el.id == data.id) > -1) {
    target?.splice(isSelected, 1)
  }
}

async function getGroupData () {
  const data = await groupStore.getGroupById(id)
  const parentData = await groupStore.getGroupById(data.parentId)
  users.value = await groupStore.getUsersByGroupId(id)
  users.value = users.value?.filter(el => el.id !== groupStore.currentGroup.groupCreatorId)
  const allUsers = [...await groupStore.getUsersByGroupId(data.parentId), ...users.value]
  if (parentData.typeId === 2) {
    // если этаж, то ставим дому ид родителя этажа
    house.value = parentData.parentId
  } else {
    house.value = data.parentId
  }
  name.value = data.name
  oldName = unref(name.value)
  // existingUsers.value = allUsers.filter((value, index, self) =>
  //         index === self.findIndex((t) => t.id === value.id)
  // )
  await getDevicesByGroupId(id, devices)
  await getDevicesByGroupId(house.value, existingDevices)
}
getGroupData()
async function getDevicesByGroupId (id:string, deviceRef:globalThis.Ref<any>) {
  deviceRef.value = []
  const devices = await groupStore.getDevicesByGroupId(id)
  for (const [key, val] of Object.entries(devices)) {
    deviceRef.value.push(...val)
  }
}
async function editGroup () {
  if (name.value !== oldName) {
    await groupStore.changeName(id, name.value)
  }
  if (oldDevices.length > 0) {
    await groupStore.changeDevices(groupStore.currentHome, [...oldDevices])
  }
  if (devices.value.length > 0) {
    await groupStore.changeDevices(id, devices.value.map(el => el.id))
  }
  if (usersForRemove.value?.length > 0) {
    await groupStore.removeUsersFromGroup(usersForRemove.value?.map(el => el.id), id)
  }
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
