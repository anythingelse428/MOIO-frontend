

export default function useRgbToHex (r:number|string, g:number|string, b:number|string) {
  return [r, g, b].map((x) => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}
