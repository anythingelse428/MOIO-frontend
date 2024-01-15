<template>
  <div class="add-group --edit">

  <div class="add-group">
    <h1 class="add-group__header">
      Изменить этаж
    </h1>
    <form method="post" class="add-group__form" @submit.prevent="editGroup()">
      <div class="add-group__input-group">
        <label for="group" class="add-group__label">Введите название этажа</label>
        <input id="group" v-model="name"  type="text" name="group" class="add-group__input" required placeholder="Название этажа">
      </div>
      <div v-if="house?.length>1" class="add-group-available-devices">
        <h2 class="add-group-available-devices__header">
          {{existingDevices?.length?
          'Доступные устройства':
            'Устройства уже распределены по группам или не найдены'
          }}
        </h2>
        <div class="add-group-available-devices__list" v-if="existingDevices?.length>0">
          <div
            v-for="device in existingDevices"
            :key="device.id"
            class="add-group-available-devices__list-item"
          >
            <label for="device">{{ device?.name }}</label>
            <div class="add-group-available-devices__list-item-checkbox-wrapper">
              <input id="device" type="checkbox" name="device" @change="(e)=>setItem(e,devices,{id:device.id,name:device.name})" :checked="devices.findIndex(el=>el.id === device.id)>-1">
              <span class="add-group-available-devices__list-item-checkbox-mask" />
            </div>
          </div>
        </div>
      </div>
<!--      <div v-if="house?.length>1" class="add-group-available-devices">-->
<!--        <h2 class="add-group-available-devices__header">-->
<!--          {{existingRooms?.length?-->
<!--            'Доступные комнаты':-->
<!--            'Комнаты уже распределены по этажам или не найдены'-->
<!--          }}-->
<!--        </h2>-->
<!--        <div class="add-group-available-devices__list" v-if="existingRooms?.length>0">-->
<!--          <div-->
<!--              v-for="room in existingRooms"-->
<!--              :key="room.id"-->
<!--              class="add-group-available-devices__list-item"-->
<!--          >-->
<!--            <label for="device">{{ room?.name }}</label>-->
<!--            <div class="add-group-available-devices__list-item-checkbox-wrapper">-->
<!--              <input id="device" type="checkbox" name="device" @change="(e)=>setItem(e,rooms,{id:room.id,name:room.name})" :checked="rooms.findIndex(el=>el.id === room.id)>-1">-->
<!--              <span class="add-group-available-devices__list-item-checkbox-mask" />-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div v-if="house?.length>1 && users?.length" class="add-group-available-devices">-->
<!--        <h2 class="add-group-available-devices__header">-->
<!--          Гости этажа-->
<!--        </h2>-->
<!--        <div class="add-group-available-devices__list" v-if="users?.length>0">-->
<!--          <div-->
<!--              v-for="user in users"-->
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
      <div class="add-group__preview" v-if="previewData.name.length">
        <div class="add-group__preview-section">
          <div class="add-group__preview-section-title">
            Название этажа
          </div>
          <div class="add-group__preview-section-value">
          {{previewData.name}}
          </div>
        </div>
        <div class="add-group__preview-section">
          <div class="add-group__preview-section-title">
            Гости этажа
          </div>
          <div class="add-group__preview-section-value" v-if="previewData.users?.length">
            <div class="add-group__preview-section-device" v-for="user in previewData.users" :key="user.id">
              {{user?.name}}
              <span class="mdi mdi-delete" @click="(e)=>{usersForRemove.push({id:user.id,name:user.name});setItem(e,users,{id:user.id,name:user.name});}" v-if="user.id !== groupStore.currentGroup.groupCreatorId"></span>
            </div>
          </div>
          <div class="add-group__preview-section-value" v-else>
            Нет приглашенных пользователей
          </div>
        </div>

        <div class="add-group__preview-section">
          <div class="add-group__preview-section-title">
            Комнаты этажа
          </div>
          <div class="add-group__preview-section-value" v-if="previewData.rooms?.length">
            <div class="add-group__preview-section-device" v-for="item in previewData.rooms" :key="item.id">
              {{item?.name}}
              <span class="mdi mdi-delete" @click="(e)=>setItem(e,rooms,{id:item.id,name:item.name})"></span>
            </div>
          </div>
          <div class="add-group__preview-section-value" v-else>
            Нет выбранных комнат
          </div>
        </div>
        <div class="add-group__preview-section">
          <div class="add-group__preview-section-title">
            Устройства этажа
          </div>
          <div class="add-group__preview-section-value" v-if="previewData.devices?.length">
            <div class="add-group__preview-section-device" v-for="item in previewData.devices" :key="item.id">
              {{item?.name}}
            <span class="mdi mdi-delete" @click="(e)=>setItem(e,devices,{id:item.id,name:item.name})"></span>
            </div>
          </div>
          <div class="add-group__preview-section-value" v-else>
            Нет выбранных устройств
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
import { type IUsersByGroupResponse } from "~/api/group/getUsersByGroupId"
import { use } from "h3"
import AddRoommateModal from "~/components/Profile/AddRoommateModal.vue"
import TheModal from "~/components/shared/TheModal.vue"

const groupStore = useGroupsStore()
const {groups,currentHome} = storeToRefs(groupStore)
const isAddRoommatesModalShow = ref(false)
const name = ref('')
let oldName = ''
let oldDevices = []
const house = ref(currentHome)
const devices = ref<{ id: string, name:string }[]>([])
const existingDevices = ref()
const users = ref<{id:number,name:string}[]>()
// const existingUsers = ref<IUsersByGroupResponse[]>()
const id = useRoute().params.id
const usersForRemove = ref<{id:number,name:string}[]>([])
const router = useRouter()
// const existingRooms = ref(groups.value.filter(el=>el.typeId===3&&el.parentId === currentHome.value))
const rooms = ref<{ id: string, name:string }[]>([])
const previewData = ref({
      name: name,
      devices: devices,
      rooms:rooms,
      users:users
})

function setItem (e:Event, target:any, data:{ id: string, name:string }) {
  const isChecked = (<HTMLInputElement>event.target)?.checked
  const isSelected = target?.find(el=>el?.id === data.id)
  if (isChecked && !isSelected){
    target?.push(data)
  }
  if (!isChecked && isSelected){
    const idx = target.findIndex(el=>el.id === data.id)
    target?.splice(idx,1)
  }
}

async function getGroupData(){
  const data = await groupStore.getGroupById(id)
  house.value = data.parentId
  name.value = data.name
  users.value = await groupStore.getUsersByGroupId(id)
  users.value = users.value?.filter(el=>el.id !== groupStore.currentGroup.groupCreatorId)
  console.log(users.value,groupStore.currentGroup.groupCreatorId)
  oldName = unref(name.value)
  await getDevicesByGroupId(id,devices)
  await getDevicesByGroupId(house.value,existingDevices)
}
getGroupData()
async function getDevicesByGroupId (id:string,deviceRef:globalThis.Ref<any>) {
  deviceRef.value = []
  const devices = await groupStore.getDevicesByGroupId(id)
  for (const [key,val] of Object.entries(devices)) {
    deviceRef.value.push(...val)
  }
}
async function editGroup () {
  if (name.value !== oldName){
   await groupStore.changeName(id, name.value)
  }
  if (oldDevices.length>0){
    await groupStore.changeDevices(groupStore.currentHome, [...oldDevices])
  }
  if (devices.value.length>0){
    await groupStore.changeDevices(id, devices.value.map(el=>el.id))
  }
  if (rooms.value.length>0){
  }
  if (usersForRemove.value?.length>0){
    await groupStore.removeUsersFromGroup(usersForRemove.value?.map(el=>el.id),id)
  }
  setTimeout(()=>{
    useRouter().push({path:'/user/group/' + id})
  },1500)
}
async function deleteGroup(){
  await groupStore.deleteGroup(id)
}


</script>
<style lang="scss">
@import "assets/styles/page/user-add-room";
@import "assets/styles/page/_user";

</style>
