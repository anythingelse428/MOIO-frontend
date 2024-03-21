import { type Ref } from "vue/dist/vue"

export default function useTransformOnScroll (scrollTarget:Ref<HTMLDivElement>,
  hideTarget:Ref<HTMLDivElement>[],
  showValue:string,
  hideValue:string,
  vector?:'top'|'bottom'|'left'|'right') {
  const prevScroll = ref(scrollTarget.value?.scrollTop ?? 0)
  function transform () {
    const currentScrollPos = scrollTarget.value.scrollTop
    if (prevScroll.value > currentScrollPos) {
      hideTarget.forEach((el) => {
        el.value.style[vector ?? "top"] = showValue
      })
    } else {
      hideTarget.forEach((el) => {
        el.value.style[vector ?? "top"] = hideValue
      })
    }
    return currentScrollPos
  }
  onMounted(() => {
    scrollTarget.value.addEventListener('scroll', function (e) {
      prevScroll.value = transform()
    })
  })
}
