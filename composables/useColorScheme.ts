export default function useColorScheme () {
  if (!process.client) { return }
  const currentScheme = ref(localStorage.getItem('scheme-color') || 'scheme-dark')
  const $html = document.querySelector('html')
  const setColorScheme = () => {
    if ($html) {
      $html.className = currentScheme.value
    }
  }
  const changeColorScheme = () => {
    const newColorScheme = currentScheme.value === 'scheme-dark' ? 'scheme-light' : 'scheme-dark'
    localStorage.setItem('scheme-color', newColorScheme)
    currentScheme.value = newColorScheme
    setColorScheme()
  }
  const colorSchemeInit = () => {
    if ($html) {
      $html.className = currentScheme.value
    }
  }
  return {
    currentScheme,
    setColorScheme,
    changeColorScheme,
    colorSchemeInit,
  }
}
