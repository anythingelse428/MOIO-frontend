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
              'Устройства уже распределены по группам или не найдены'
            }}
          </h2>
          <div v-if="existingDevices?.length>0" class="add-group-available-devices__list">
            <ui-any-list-item
              v-for="item in existingDevices" :key="item.id"
            >
              <template #title>
                {{ item?.name }}
              </template>
              <template #action>
                <ui-checkbox
                  :checked="devices.findIndex(el=>el.id === item.id)>-1"
                  @check="setItem(devices,{id:item.id,name:item.name})"
                />
              </template>
            </ui-any-list-item>
          </div>
        </div>
        <div class="add-group__preview-wrapper">
          <div v-if="previewData.name?.length" class="add-group__preview">
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
                <ui-any-list-item
                  v-for="item in devices"
                  :key="item.id"
                >
                  <template #title>
                    {{ item?.name }}
                  </template>
                  <template #action>
                    <ui-button
                      padding="0"
                      class-name="blank"
                      @click="(e)=>{
                        setItem(devices,{id:item.id,name:item.name});
                        setItem(existingDevices,{id:item.id,name:item.name});
                      }"
                    >
                      <ui-icon
                        name="delete"
                        color="#D15151"
                        size="20"
                      />
                    </ui-button>
                  </template>
                </ui-any-list-item>
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
                <ui-any-list-item
                  v-for="user in previewData.users" :key="user.id"
                >
                  <template #title>
                    {{ user?.name }}
                  </template>
                  <template #action>
                    <ui-button
                      padding="0"
                      class-name="blank"
                      @click="(e)=>{
                        usersForRemove.push({id:user.id,name:user.name});
                        users.splice(users.findIndex(el=>el.id === user.id),1)
                      }"
                    >
                      <ui-icon
                        v-if="user.id !== groupStore.currentGroup.groupCreatorId"
                        name="delete"
                        color="#D15151"
                        size="20"
                      />
                    </ui-button>
                  </template>
                </ui-any-list-item>
              </div>
              <div v-else class="add-group__preview-section-value">
                Нет приглашенных пользователей
              </div>
            </div>
          </div>
        </div>
        <div class="add-group__submit-wrapper">
          <ui-button type="submit" rounded="16px">
            Сохранить
          </ui-button>
        </div>
      </form>
      <form method="post" class="add-group__form --delete" @submit.prevent="deleteGroup()">
        <ui-button
          type="submit"
          class-name="delete"
          rounded="16px"
          margin-inline="0"
        >
          Удалить группу
        </ui-button>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useGroupsStore } from "~/store/groups"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"
import UiIcon from "~/components/ui/UiIcon.vue"
import UiAnyListItem from "~/components/ui/UiAnyListItem.vue"

let oldName = ''
const isLoading = ref(false)
const id = useRoute().params.id as string
const name = ref('')
const house = ref("")
const devices = ref<{ id: string, name:string }[]>([])
const users = ref<{id:number, name:string}[]>([])
const usersForRemove = ref<{id:number, name:string}[]>([])
const existingDevices = ref<{id:string, name:string}[]>([])
// const existingUsers = ref<IUsersByGroupResponse[]>()
const groupStore = useGroupsStore()
const router = useRouter()
const previewData = ref({
  name,
  devices,
  users,
})

function setItem (target:{ id: string, name:string }[], data:{ id: string, name:string }) {
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
  if (devices) {
    for (const val of Object.values(devices)) {
      deviceRef.value.push(...val.map((el) => {
        return { id: el.id, name: el.name }
      }))
    }
  }
}
async function editGroup () {
  isLoading.value = true
  if (name.value !== oldName) {
    await groupStore.changeName(id, name.value)
  }
  if (existingDevices.value?.length > 0) {
    await groupStore.changeDevices(groupStore.currentHome, existingDevices.value.map(el => el.id))
  }
  if (devices.value?.length > 0) {
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
