/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */


/**
 * 全站路由配置
 * 代码中路由统一使用 path属性跳转
 */
import Vue from 'vue'
import Router from 'vue-router'
// import http from '@/utils/httpRequest'
import _this from '@/utilsPro/_this'
// import { isURL } from '@/utils/validate'
import Layout from '@/layout'
// import { clearLoginInfo } from '@/utils'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

Vue.use(Router)

// const routerPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return routerPush.call(this, location).catch(error => error)
// }
// 开发环境不使用懒加载
const _import = require('./_import_' + process.env.NODE_ENV) // 获取组件的方法
// 全局路由
const globalRoutes =
  [
    {
      path: '/login',
      component: () => import('@/views/whitePage/index'),
      hidden: true,
      children: [
        {
          path: '/',
          name: 'login',
          component: () => import('@/views/whitePage/login'),
          meta: { title: '登录' }
        },
      ]
    },
    {
      path: '/reg',
      component: () => import('@/views/whitePage/index'),
      hidden: true,
      children: [
        {
          path: '/',
          name: 'reg',
          component: () => import('@/views/whitePage/reg'),
          meta: { title: '注册' }
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@/views/404'),
      hidden: true
    },
  ]

// 主入口路由
const mainRoutes = {
  path: '/',
  component: Layout,
  redirect: '/home',
  // meta: { title: '系统管理' },
  children: [
    // { path: '/home', component: _import('modules/sys/dashboard/analysis/index'), name: 'home', meta: { title: '首页', backgroundType: '2' } },
    {
      path: 'home',
      name: '主页',
      component: () => import('@/views/home/index'),
      // meta: { title: '主页', icon: 'dashboard' }
      meta: { title: '主页' }
    }
    // { path: '/form/generateList', component: _import('modules/form/GenerateList'), name: 'form-preview-list', meta: { title: '列表' } },
    // { path: '/form/generateList', component: _import('modules/form/GenerateList'), name: 'form-preview-list', meta: { title: '列表' } },
    // { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } }
  ],
  // beforeEnter (to, from, next) {

  //   // let token = Vue.cookie.get('token')
  //   const jwt = localStorage.getItem("jwt")
  //   if (!jwt || jwt === 'undefined') {
  //     // clearLoginInfo()
  //     localStorage.clear()
  //     _this.$vuex('vuex_user', {})
  //     // _this.$vuex('vuex_menu', [])
  //     next({ path: '/login' })

  //     console.log(111)
  //   }

  //   console.log(222)
  //   next()
  // }
}

// let toHomeFlag = true

const router = new Router({
  mode: 'history', // hash || history
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {

  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 添加动态(菜单)路由
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
    // NProgress.done()
  } else {
    if (!localStorage.getItem("jwt")) {
      next({ path: '/login' })
    } else {
      _this.$http({
        url: '/menu-service/menu',
        method: 'get'
      }).then(({ data }) => {
        // if (data && data.success) {
        // console.log('data', data)

        // let tree = _this.utilsPro.utilsPro.listToTree(data, 0)

        // console.log('tree', tree)

        fnAddDynamicMenuRoutes(data)
        router.options.isAddDynamicMenuRoutes = true
        // sessionStorage.setItem('allMenuList', JSON.stringify(data.menuList || '[]'))
        // sessionStorage.setItem('dictList', JSON.stringify(data.dictList || '[]'))
        next({ ...to, replace: true })
        // NProgress.done()
        // } else {
        //   sessionStorage.setItem('allMenuList', '[]')
        //   sessionStorage.setItem('permissions', '[]')
        //   sessionStorage.setItem('dictList', '[]')
        //   next()
        // }
      }).catch((e) => {

        // if (toHomeFlag) {
        // location.href = '/'
        // toHomeFlag = false
        // }
        // next({ path: '/login' })
        // if (localStorage.getItem("jwt")) {
        //   next({ path: '/' })
        // } else {
        // next({ path: '/login' })
        // location.href = '/'
        // }
        // console.log(`%c${e} 请求菜单列表和权限失败`, 'color:red')
        // console.log(new Error('请求菜单列表失败'))
      })
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  let temp = []
  for (let i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  let temp = []
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    }

    if (menuList[i].uri && /\S/.test(menuList[i].uri)) {
      menuList[i].uri = menuList[i].uri.replace(/[/]$/, '')
      const route = {
        id: menuList[i].id,
        path: menuList[i].uri.split('?')[0],
        component: null,
        name: menuList[i].uri.replace(/^\//g, '').replace(/[/]/g, '-').replace(/[?]/g, '-').replace(/&/g, '-').replace(/=/g, '-'),
        parentId: menuList[i].parentId,
        // hidden: menuList[i].showFlag == 0 && (menuList[i].type == 1 || menuList[i].type == 2), // 1 菜单 2 页面 3 按钮
        hidden: menuList[i].type != 1 && menuList[i].type != 2, // 1 菜单 2 页面 3 按钮，备注：这里不写 showFlag的判断，是因为后台只会返回 showFlag == 1的数据回来
        meta: {
          // parentIds: menuList[i].parentIds,
          // menuId: menuList[i].id,
          title: menuList[i].name,
          icon: menuList[i].icon,
          // parentId: menuList[i].parentId,
          // isDynamic: true,
          // type: menuList[i].target,
          // backgroundType: menuList[i].backgroundType,
          // iframeUrl: ''
        }
      }
      // url以 http[s]://开头, 通过iframe展示
      // if (isURL(menuList[i].uri)) {
      //   route.path = '/' + route.path
      //   route.meta.iframeUrl = menuList[i].uri
      //   route['meta']['type'] = 'iframe'
      // } else if (menuList[i].target === 'iframe') {
      //   route['meta']['iframeUrl'] = `${process.env.VUE_APP_SERVER_URL}${menuList[i].uri}`
      // } else {
      try {
        // route['component'] = _import(`modules${menuList[i].componentPath.split('?')[0]}`) || null
        route['component'] = _import(menuList[i].componentPath.split('?')[0]) || null
      } catch (e) {
        // console.log(e)
        // }
      }
      routes.push(route)
    } else {
      // 添加没有 uri的菜单
      const route = {
        id: menuList[i].id,
        component: null,
        path: menuList[i].id,
        parentId: menuList[i].parentId,
        hidden: menuList[i].type != 1 && menuList[i].type != 2, // 1 菜单 2 页面 3 按钮，备注：这里不写 showFlag的判断，是因为后台只会返回 showFlag == 1的数据回来
        meta: {
          title: menuList[i].name,
          icon: menuList[i].icon,
        }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {

    // mainRoutes.name = '系统菜单'

    // console.log('routes123', routes)

    mainRoutes.children = routes

    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: '/404', hidden: true }
    ])
    // sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || []))
  }
}

export default router
