export default function useIcoByGroupName (name:string) {
  if (!name) { return { name: 'help', code: '\\F02D6' } }
  if (name.includes('devices.types.sensor')) {
    return { name: 'access-point', code: "\\F0003" }
  }
  switch (name.toLowerCase()) {
    case 'безопасность':
      return { name: 'shield-outline', code: '\\' }
    case 'свет':
      return { name: 'lightbulb-outline', code: '\\' }
    case 'вода':
      return { name: 'water-outline', code: '\\' }
    case 'электроника':
      return { name: 'volume-high', code: '\\' }
    case 'микроклимат':
      return { name: 'fan', code: '\\' }
    case 'аудио':
      return { name: 'volume-high', code: '\\' }
    case 'выключатели':
      return { name: 'toggle-switch-variant-off', code: '\\' }
    case 'розетки':
      return { name: 'power-socket-eu ', code: '\\' }
    case 'комната':
      return { name: 'cube-outline', code: '\\' }
    case 'этаж':
      return { name: 'home-floor-l', code: '\\' }
    case 'дом':
      return { name: 'home', code: '\\' }
    default:
      return { name: 'help', code: '\\F02D6' }
  }
}

