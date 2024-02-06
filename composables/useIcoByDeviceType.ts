import type { TUiIconNames } from "#build/types/ui-icon"

export default function useIcoByDeviceType (type:string):{name:TUiIconNames, code?:string} {
  if (!type) { return { name: 'service/help', code: '\\F02D6' } }
  switch (type) {
    case 'devices.types.socket':
      return { name: 'service/power-socket-eu', code: '\\F07E7' }
    case 'devices.types.sensor.button':
      return { name: 'service/gesture-tap', code: '\\F07E7' }
    case 'devices.types.switch':
      return { name: 'service/power', code: '\\F0425' }
    case 'devices.types.openable.lock':
      return { name: 'service/lock-outline', code: '\\F0341' }
    case 'devices.types.light':
      return { name: 'service/lightbulb-variant-outline', code: '\\F1803' }
    case 'devices.types.thermostat':
      return { name: 'service/thermometer', code: '\\F050F' }
    case 'devices.types.openable.valve':
      return { name: 'service/water-outline', code: '\\F0E0A' }
    case 'devices.types.openable.garage':
      return { name: 'service/garage-variant', code: '\\F12D3' }
    default:
      if (type.includes('devices.types.sensor')) {
        return { name: 'service/access-point', code: "\\F0003" }
      }
      return { name: 'service/help', code: '\\F02D6' }
  }
}
