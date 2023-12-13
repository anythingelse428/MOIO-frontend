import { defineStore } from 'pinia'
import type { CookieOptions } from "#app"
import { consola } from "consola"
import { useRouter } from "vue-router"
import type { IRegisterUserProps } from '~/api/user/register'
import apiUserRegister from '~/api/user/register'
import type { IAuthUserProps } from "~/api/user/auth"
import apiUserAuth from "~/api/user/auth"
import getUserInfo from "~/api/user/getUserInfo"
import apiUserRefreshToken from "~/api/user/refreshToken"
import useSetCookie from "~/composables/useSetCookie"
import apiUserLogout from "~/api/user/logout"
import useNotification from "~/composables/useNotification"
// store 1 sample
export interface IDecodedJwt{
  Id:string
  aud:string
  exp:number
  iss:string
  nbf:number
}
const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60,
}

export const useUserStore = defineStore('user', {
  state: () => (
    {
      id: null,
      displayedName: '',
      role: '',
      avatarUrl: '',
      access_token: '',
    }),
  getters: {
    userInfo: (state) => {
      return {
        id: state.id,
        name: state.displayedName,
        role: state.role,
        avatarUrl: state.avatarUrl,
        access_token: state.access_token,
      }
    },
  },
  actions: {
    decodeJWT (jwt: string):IDecodedJwt {
      const base64Url = jwt.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(''),
      )
      return JSON.parse(jsonPayload)
    },
    async register (props:IRegisterUserProps) {
      const { access_token, refresh_token } = await apiUserRegister(props)
      if (access_token) {
        const config = useRuntimeConfig()
        localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME as string, access_token)
        this.access_token = access_token
        window.location.pathname = '/'
        return refresh_token
      }
    },
    async auth (props:IAuthUserProps) {
      const { access_token, username, refresh_token, id } = await apiUserAuth(props)
      if (access_token) {
        const config = useRuntimeConfig()
        this.access_token = access_token
        this.displayedName = username
        this.id = id
        localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME as string, access_token)
        window.location.pathname = '/'
      }
      return refresh_token
    },
    async logout () {
      const config = useRuntimeConfig()
      const token = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME)
      token.value = ''
      localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME, '')
      await apiUserLogout()
      window.location.pathname = '/login'
    },
    async refresh () {
      const config = useRuntimeConfig()
      const refresh = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME)
      if (refresh.value) {
        const { access_token } = await apiUserRefreshToken(refresh.value)
        if (access_token.length) {
          console.log(access_token)
          this.access_token = access_token
          localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME, access_token)
          return access_token
        }
        useSetCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME, '')
        window.location.pathname = '/login'
      }
      console.log('no token')
      window.location.pathname = '/login'
    },
    async init () {
      const config = useRuntimeConfig()
      const refreshToken = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME)
      if (this.access_token.length < 16 && (refreshToken && refreshToken.value?.length)) {
        console.log('no acess')
        try {
          const accessToken = await this.refresh()
          if (typeof accessToken === 'string') {
            this.access_token = accessToken
            const userData = await getUserInfo()
            this.role = userData.role
            this.displayedName = userData.name
            this.id = userData.id
          }
        } catch (e) {
          console.log('clear token...')
          refreshToken.value = ''
          window.location.pathname = '/login'
        }
      }
    },
  },
})
