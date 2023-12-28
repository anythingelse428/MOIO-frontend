import { defineStore } from 'pinia'
import type { IRegisterUserProps } from '~/api/user/register'
import apiUserRegister from '~/api/user/register'
import type { IAuthUserProps } from "~/api/user/auth"
import apiUserAuth from "~/api/user/auth"
import getUserInfo from "~/api/user/getUserInfo"
import apiUserRefreshToken from "~/api/user/refreshToken"
import useSetCookie from "~/composables/useSetCookie"
import apiUserLogout from "~/api/user/logout"
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
      accessToken: '',
    }),
  getters: {
    userInfo: (state) => {
      return {
        id: state.id,
        name: state.displayedName,
        role: state.role,
        avatarUrl: state.avatarUrl,
        accessToken: state.accessToken,
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
      const { accessToken, refreshToken } = await apiUserRegister(props)
      if (accessToken) {
        const config = useRuntimeConfig()
        localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME as string, accessToken)
        this.accessToken = accessToken
        window.location.pathname = '/'
        return refreshToken
      }
    },
    async auth (props:IAuthUserProps) {
      const { accessToken, username, refreshToken, id } = await apiUserAuth(props)
      if (accessToken) {
        const config = useRuntimeConfig()
        this.accessToken = accessToken
        this.displayedName = username
        this.id = id
        localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME as string, accessToken)
        window.location.pathname = '/'
      }
      return refreshToken
    },
    async logout () {
      const config = useRuntimeConfig()
      const token = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME)
      token.value = ''
      localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME, '')
      localStorage.setItem('moio-current-home', '')
      await apiUserLogout()
      window.location.pathname = '/login'
    },
    async refresh () {
      const config = useRuntimeConfig()
      const refresh = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME)
      if (refresh.value) {
        const { accessToken } = await apiUserRefreshToken(refresh.value)
        if (accessToken.length) {
          this.accessToken = accessToken
          localStorage.setItem(config.public.REST_BASE_TOKEN_STORAGE_NAME, accessToken)
          return accessToken
        }
        useSetCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME, '')
        window.location.pathname = '/login'
      }
      window.location.pathname = '/login'
    },
    async init () {
      const config = useRuntimeConfig()
      const refreshToken = useCookie(config.public.REST_BASE_TOKEN_STORAGE_NAME)
      try {
        const accessToken = await this.refresh()
        if (typeof accessToken === 'string') {
          this.accessToken = accessToken
          const userData = await getUserInfo()
          this.role = userData.role
          this.displayedName = userData.name
          this.id = userData.id
        }
      } catch (e) {
        refreshToken.value = ''
        window.location.pathname = '/login'
      }
    },
  },
})
