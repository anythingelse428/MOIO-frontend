
export default function useHexToRgb (hex:string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number(parseInt(result[1], 16).toFixed(0)),
        g: Number(parseInt(result[2], 16).toFixed(0)),
        b: Number(parseInt(result[3], 16).toFixed(0)),
      }
    : {
        r: 255,
        g: 255,
        b: 255,
      }
}
