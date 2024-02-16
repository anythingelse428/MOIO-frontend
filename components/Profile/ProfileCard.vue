<template>
  <div class="profile-card">
    <loader-screen :is-loading="isLoading" />
    <div class="profile-card__avatar">
      <img v-if="avatarUrl.length" :src="avatarUrl" width="136" height="136">
      <div v-else class="profile-card__avatar --blank" />
    </div>
    <div class="profile-card-info">
      <div class="profile-card-info__role">
        {{ role }}
      </div>
      <div v-if="displayedName" class="profile-card-info__name">
        <span v-show="!isNameChanging" class="name">
          {{ displayedName }}
          <button class="blank" @click="isNameChanging=!isNameChanging">
            <icon name="pencil" size="18" />
          </button>
        </span>
        <form v-show="isNameChanging" method="post" class="profile-card-info__change-name">
          <input v-model="newName" type="text" class="profile-card-info__change-name-input">
          <button class="blank" @click.prevent="changeName()">
            <icon name="check" size="18" />
          </button>
        </form>
      </div>
      <hr class="profile__divider">
      <div class="profile-card-info__data">
        <div class="profile-card-info__data-group">
          <div class="profile-card-info__data-group-label">
            ClientID
          </div>
          <div class="profile-card-info__data-group-data">
            <input
              v-model="newClientId"
              :disabled="!isClientIdChanging"
              @click="!isClientIdChanging && copyToClipBoard(clientId as string,'clientId')"
            >
            <button class="blank" @click="isClientIdChanging = !isClientIdChanging">
              <icon name="pencil" size="18" />
            </button>
            <button v-if="isClientIdChanging" class="blank --submit" @click="changeClientId()">
              <icon name="check" size="16" />
            </button>
          </div>
        </div>
        <div class="profile-card-info__data-group">
          <div class="profile-card-info__data-group-label">
            Почта
          </div>
          <div class="profile-card-info__data-group-data">
            <span @click="copyToClipBoard(login as string,'email')">
              {{ login }}
            </span>
            <nuxt-link to="/user/edit?email=true">
              <icon name="pencil" size="18" />
            </nuxt-link>
          </div>
        </div>
        <nuxt-link to="/user/edit?password=true" class="profile-card-info__data-group --password">
          Сменить пароль
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "~/components/shared/Icon.vue"
import { useUserStore } from "~/store/user"
import LoaderScreen from "~/components/shared/LoaderScreen.vue"

export type ProfileCard ={
  avatarUrl:string
  role:string|null
  clientId:string|null
  login:string
  displayedName:string
}

const props = defineProps<ProfileCard>()
const userStore = useUserStore()
const isNameChanging = ref(false)
const isClientIdChanging = ref(false)
const isLoading = ref(false)
const newName = ref(props.displayedName)
const newClientId = ref(props.clientId ?? '')
async function changeName () {
  isLoading.value = true
  await userStore.changeName(newName.value)
  await userStore.init()
  isNameChanging.value = false
  isLoading.value = false
}
async function changeClientId () {
  isLoading.value = true
  await userStore.changeClientId(newClientId.value)
  await userStore.init()
  isClientIdChanging.value = false
  isLoading.value = false
}
async function copyToClipBoard (text:string, type:'clientId'|'email') {
  try {
    const result = await navigator.clipboard.writeText(text)
    useNotification('info', `${type} скопирован в буфер обмена`)
  } catch {
    console.error('ой')
  }
}
</script>

<style lang="scss">
@import "assets/styles/components/profile-card";

</style>
