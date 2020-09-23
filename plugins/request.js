/**
 * 基于axios封装的请求模块
 */

import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
  // baseURL: 'http://realword.api.fed.lagounews.com'
});

//通过插件机制获取到上下文对象context（query/params/req/res/app/store……）
//插件导出函数必须作为default成员
export default  (context) => {
  
  // 请求拦截器
  // 任何请你去都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理，例如统一设置token
  const { store } = context ;
  request.interceptors.request.use(function (config) {
    //请求就会经过这里
    const { user } = store.state;

    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}` ;
    }

    //返回config请求配置对象
    return config
  }, function (error) {
    //如果请求失败（此时请求还没有发出去）就会进入这里

    return Promise.reject(error)
  })
  
}