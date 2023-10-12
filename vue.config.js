const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["element-ui", "ele-admin", "vue-i18n"], // 不需要兼容IE注释这行可提升编译速度
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    if (process.env.NODE_ENV !== "development") {
      // 对超过10kb的文件gzip压缩
      config.plugin("compressionPlugin").use(
        new CompressionWebpackPlugin({
          test: /\.(js|css|html)$/,
          threshold: 10240
        })
      );
    }
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: "expanded"
        }
      }
    }
  },
  // 打包路径
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  // exlint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 跨域代理
  devServer: {
    port: 8089, // 端口
    // proxy: {
    //   "/": {
    //     // 代理测试地址
    //     target: "https://rydemo.ryaims.com:30001/",
    //     // 代理地址
    //     // 是否跨域
    //     changeOrigin: true
    //   }
    // }
  }
};
