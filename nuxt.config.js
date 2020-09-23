/*
** Nuxt.js配置文件
*/

module.exports = {
  linkActiveClass: 'active',//nuxt中匹配到路由后会给元素加上 nuxt-link-active类名；
  router: {
  //自定义路由表规则
    extendRoutes (routes, resolve) {
      // 第一步：清除默认路由；
      //清除Nuxt.js基于pages目录默认生成的路由表规则
      routes.splice(0) ;
     
      // 第二步：自定义路由；
      routes.push(...[
        {
          path: '/' ,
          component: resolve(__dirname, 'pages/layout/') ,
          children: [
            {
              path: '/' ,
              name: 'home' ,
              component: resolve(__dirname, 'pages/home/') ,
            },
            {
              path: '/login' ,
              name: 'login' ,
              component: resolve(__dirname, 'pages/login/') ,
            } ,
            {
              path: '/register' ,
              name: 'register' ,
              component: resolve(__dirname, 'pages/login/') ,
            },
            {
              path: '/profile/:username' ,
              name: 'profile' ,
              component: resolve(__dirname, 'pages/profile/') ,
            },
            {
              path: '/settings' ,
              name: 'settings' ,
              component: resolve(__dirname, 'pages/settings/') ,
            },
            {
              path: '/article/:slug' ,
              name: 'article' ,
              component: resolve(__dirname, 'pages/article/') ,
            },
            {
              path: '/create' ,
              name: 'create' ,
              component: resolve(__dirname, 'pages/editor/') ,
            } ,
            {
              path: '/editor' ,
              name: 'edit' ,
              component: resolve(__dirname, 'pages/editor/') ,
            }
          ]
        
        }
      ])
    }
  },
  server: {
    host: '0.0.0.0',
    port: '3000'
  },
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'

  ]
}