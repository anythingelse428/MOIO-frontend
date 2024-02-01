export default function useIcoByDeviceType (type:string) {
  if (!type) { return { name: 'help', code: '\\F02D6' } }
  switch (type) {
    case 'devices.types.socket':
      return { name: 'power-socket-eu', code: '\\F07E7' }
    case 'devices.types.sensor.button':
      return { name: 'gesture-tap', code: '\\F07E7' }
    case 'devices.types.switch':
      return { name: 'power', code: '\\F0425' }
    case 'devices.types.openable.lock':
      return { name: 'lock-outline', code: '\\F0341' }
    case 'devices.types.light':
      return { name: 'lightbulb-variant-outline', code: '\\F1803' }
    case 'devices.types.thermostat':
      return { name: 'thermometer', code: '\\F050F' }
    case 'devices.types.openable.valve':
      return { name: 'water-outline', code: '\\F0E0A' }
    case 'devices.types.openable.garage':
      return { name: 'garage-variant', code: '\\F12D3' }
    default:
      if (type.includes('devices.types.sensor')) {
        return { name: 'access-point', code: "\\F0003" }
      }
      return { name: 'help', code: '\\F02D6' }
  }
}
