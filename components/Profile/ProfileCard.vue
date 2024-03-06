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
          <button class="blank" type="submit" @click="isNameChanging=!isNameChanging">
            <icon name="pencil" size="18" />
          </button>
        </span>
        <form v-show="isNameChanging" method="post" class="profile-card-info__change-name">
          <input v-model="newName" type="text" class="profile-card-info__change-name-input" required>
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
    <!--    <button class="add-fg-print" @click="getCredential()">-->
    <!--      add fg print-->
    <!--    </button>-->
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
  if (!newName.value.length) {
    useNotification('error', 'Имя не может быть пустым')
    return
  }
  if (props.displayedName !== newName.value) {
    isLoading.value = true
    await userStore.changeName(newName.value)
    await userStore.init()
    isLoading.value = false
  }
  isNameChanging.value = false
}
async function changeClientId () {
  if (props.clientId !== newClientId.value) {
    isLoading.value = true
    await userStore.changeClientId(newClientId.value)
    await userStore.init()
    isLoading.value = false
  }
  isClientIdChanging.value = false
}
async function copyToClipBoard (text:string, type:'clientId'|'email') {
  try {
    const result = await navigator.clipboard.writeText(text)
    useNotification('info', `${type} скопирован в буфер обмена`)
  } catch {

  }
}


function coerceToBase64Url (input:any) {
  // Array or ArrayBuffer to Uint8Array
  if (Array.isArray(input)) {
    input = Uint8Array.from(input)
  }

  if (input instanceof ArrayBuffer) {
    input = new Uint8Array(input)
  }

  // Uint8Array to base64

  if (input instanceof Uint8Array) {
    let str = ""
    const len = input.byteLength

    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(input[i])
    }
    input = window.btoa(str)
  }

  if (typeof input !== "string") {
    throw new TypeError("could not coerce to string")
  }

  // base64 to base64url
  // NOTE: "=" at the end of challenge is optional, strip it off here
  input = input.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "")

  return input
}

async function setCreds (assertedCredential:any) {
  console.log(assertedCredential)
  const authData = new Uint8Array(assertedCredential.response.attestationObject)
  let clientDataJSON = assertedCredential.response.clientDataJSON
  delete clientDataJSON.other_keys_can_be_added_here
  clientDataJSON = new Uint8Array(clientDataJSON)
  const rawId = new Uint8Array(assertedCredential.rawId)
  // const sig = new Uint8Array(assertedCredential.response.signature)
  // const userHandle = new Uint8Array(assertedCredential.response.userHandle)

  const data = {
    id: coerceToBase64Url(Uint8Array.from(assertedCredential.id.split('').map(letter => letter.charCodeAt(0)))),
    rawId: coerceToBase64Url(Uint8Array.from(assertedCredential.id.split('').map(letter => letter.charCodeAt(0)))),
    type: assertedCredential.type,
    extensions: { },
    response: {
      AttestationObject: coerceToBase64Url(authData),
      clientDataJson: coerceToBase64Url(clientDataJSON),
    },
  }
  console.log(JSON.stringify(data))
  const test = await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/v1/biometric/makeCredential', { data })
  })
  console.log(test)
}
const getCredential = async () => {
  const test = await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/v1/biometric/сreateCredentialOptions')
  })
  console.log(test)

  const challenge = test.challenge
  const publicKeyCredentialCreationOptions = {
    ...test,
    rp: {
      name: 'MOIO',
      id: 'localhost',
    },
    AuthenticatorSelection: {
      AuthenticatorAttachment: null,
      RequireResidentKey: false,
      UserVerification: 0,
    },
    user: {
      id: Uint8Array.from(userStore.id, c => String(c).charCodeAt(0)),
      name: userStore.displayedName,
      displayName: userStore.displayedName,
    },
    challenge: Uint8Array.from(challenge),
    pubKeyCredParams: test.pubKeyCredParams.map((el) => { return { type: 'public-key', alg: el.alg } }),
  }
  // API вызов для создания новых учетных данных с помощью переданных опций.
  const result = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  })
  console.log(result)
  await setCreds(result)
  return result
}


</script>

<style lang="scss">
@import "assets/styles/components/profile-card";

</style>
