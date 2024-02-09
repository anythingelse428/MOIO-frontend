import { Suspense } from "vue"
import Icon from "~/components/shared/Icon.vue"

export default defineComponent({
  setup (props) {
    return () => (
        <img style={'position:relative;inset:0'}/>
    )
  },
})
