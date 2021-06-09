<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
        :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      // console.log(111, this.$router.options.routes.concat(this.vuex_menu))
      // return this.$router.options.routes.concat(this.vuex_menu)
      let routes = []

      this.$router.options.routes.forEach(item => {
        if (item.path === '/') {
          routes = item.children || []
          return
        }
      })

      // console.log('routes', routes)

      // console.log(this.$utilsPro.listToTree2(routes, 0))

      return this.$utilsPro.listToTree2(routes, 0)

      // console.log('routes', routes)
      // return routes
      // return this.$router.options.routes
      // console.log(JSON.parse(sessionStorage.getItem('dynamicMenuRoutes')))
      // return JSON.parse(sessionStorage.getItem('dynamicMenuRoutes'))
      // return this.vuex_menu
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.vuex_sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.vuex_sidebar.opened
      // return false
    }
  }
}
</script>
