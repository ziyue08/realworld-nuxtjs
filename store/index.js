/**
 * nuxt中已经集成了vuex,可以在项目中直接使用；
新建文件store/index.js---文件夹名字必须是store，nuxt发现store后自动加载里面的容器模块；

index.js中不用重新创建容器实例，直接定义state,action,mutation并导出，nuxt会来加载导入到容器中；

*
*/


const cookieparser = process.server ? require('cookieparser') : undefined
//在服务端渲染期间运行都是是同一个实例，
//为了防止数据冲突，务必要把state定义成一个函数，返回数据对象
export const state = ()=> {
  return {
    user: null //当前登录用户的登录状态
  }
}


//注意：这里是mutations  而不是mutation
export const mutations = {
  setUser (state, data) {
    state.user = data ;
  }
}

export const actions = {
  //nuxtServerInit是一个特殊的action方法
  // 这个action会在服务端渲染期间自动调用；
  //作用：初始化容器及需要传递给客户端的数据；

  nuxtServerInit ({ commit }, { req }) {
    let user = null ;

     //如果请求头中有cookie
    if(req.headers.cookie) {
      //使用cookieparser把cookie字符串转为JS对象；
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        user = JSON.parse(parsed.user) ;
      } catch(err) {

      }

    }

    //提交mutation，修改state状态
    commit('setUser', user);
  }
}