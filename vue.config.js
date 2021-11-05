module.exports = {
  lintOnSave: false,
  // 不希望打包後的檔名出現雜湊值
  filenameHashing: false,
  // 全局 scss
  css: {
    loaderOptions: {
      // 全局引入
      scss: {
        prependData: `@import "@/scss/index.scss";`,
      },
    },
  },
  // 部屬
  publicPath: process.env.NODE_ENV === "production" ? "/100-things/" : "/",
};
