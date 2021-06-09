<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile' && vuex_sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar () {
      return this.vuex_sidebar
    },
    device () {
      return this.vuex_device
    },
    fixedHeader () {
      return this.vuex_fixedHeader
    },
    classObj () {
      return {
        hideSidebar: !this.vuex_sidebar.opened,
        openSidebar: this.vuex_sidebar.opened,
        withoutAnimation: this.vuex_sidebar.withoutAnimation,
        mobile: this.vuex_device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      // this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
      this.$vuex('vuex_sidebar.opened', false)
      this.$vuex('vuex_sidebar.withoutAnimation', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
