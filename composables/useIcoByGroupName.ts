import type { TUiIconNames } from "#build/types/ui-icon"

export default function useIcoByGroupName (name:string):{name:TUiIconNames, code?:string} {
  if (!name) { return { name: 'help', code: '\\F02D6' } }
  if (name.includes('devices.types.sensor')) {
    return { name: 'access-point', code: "\\F0003" }
  }
  switch (name.toLowerCase()) {
    case 'безопасность':
      return { name: 'aside/secure', code: '\\' }
    case 'свет':
      return { name: 'aside/light', code: '\\' }
    case 'вода':
      return { name: 'aside/water', code: '\\' }
    case 'электроника':
      return { name: 'aside/electronic', code: '\\' }
    case 'микроклимат':
      return { name: 'aside/climate', code: '\\' }
    case 'аудио':
      return { name: 'aside/electronic', code: '\\' }
    case 'выключатели':
      return { name: 'aside/water', code: '\\' }
    case 'розетки':
      return { name: 'aside/water', code: '\\' }
    case 'комната':
      return { name: 'aside/room', code: '\\' }
    case 'этаж':
      return { name: 'aside/floor', code: '\\' }
    case 'дом':
      return { name: 'aside/home', code: '\\' }
    default:
      return { name: 'aside/water', code: '\\F02D6' }
  }
}

