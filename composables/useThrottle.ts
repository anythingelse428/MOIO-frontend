type ThrottleFunction<T extends (...args: any[]) => any> = (wait?: number, ...args: Parameters<T>) => void;

const useThrottle = <T extends (...args: any[]) => any>(fn: T, initialWait = 1000): ThrottleFunction<T> => {
  let inThrottle = false
  let lastFn: ReturnType<typeof setTimeout> | null = null
  let lastTime = 0

  return function (this: ThisParameterType<T>, wait = initialWait, ...args: Parameters<T>) {
    console.log('wait: ', wait)
    if (!inThrottle) {
      fn.apply(this, args)
      lastTime = Date.now()
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, wait)
    } else {
      if (lastFn) { clearTimeout(lastFn) }
      lastFn = setTimeout(() => {
        fn.apply(this, args)
        lastTime = Date.now()
        inThrottle = false
      }, wait - (Date.now() - lastTime))
    }
  }
}
export default useThrottle
