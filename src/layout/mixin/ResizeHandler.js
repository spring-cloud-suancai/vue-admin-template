// import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  watch: {
    $route (route) {
      if (this.vuex_device === 'mobile' && this.vuex_sidebar.opened) {
        // store.dispatch('app/closeSideBar', { withoutAnimation: false })
        this.$vuex('vuex_sidebar.opened', false)
        this.$vuex('vuex_sidebar.withoutAnimation', false)
      }
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted () {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      // store.dispatch('app/toggleDevice', 'mobile')
      this.$vuex('vuex_device', 'mobile')
      this.$vuex('vuex_sidebar.withoutAnimation', true)
      this.$vuex('vuex_sidebar.opened', false)
      // store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile () {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler () {
      if (!document.hidden) {

        const isMobile = this.$_isMobile()

        // store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        this.$vuex('vuex_device', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          // store.dispatch('app/closeSideBar', { withoutAnimation: true })
          this.$vuex('vuex_sidebar.withoutAnimation', true)
          this.$vuex('vuex_sidebar.opened', false)
        }
      }
    }
  }
}
