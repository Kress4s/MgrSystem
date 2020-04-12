module.exports = {
  devServer: {
    open: true,
    port: 8888
  },
  // 区分开发阶段和发布阶段打包入口
  chainWebpack: config => {
    // 生产模式加载 main-prod.js 入口文件
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      // 需加载外部的cdn资源，减小打包生成文件的体积: externals节点,在window全局寻找使用
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress'
      })

      // 首页自定义，添加一个变量来控制html模版，是否加载cdn资源。
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式加载 main-dev.js 入口文件
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      // 首页自定义, 添加一个变量来控制html模版，是否加载cdn资源。
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
