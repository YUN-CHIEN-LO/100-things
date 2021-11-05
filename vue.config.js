module.exports = {
  lintOnSave: false,
  // 全局 scss
  css: {
    loaderOptions: {
      // 全局引入
      scss: {
        prependData: `@import "@/scss/index.scss";`,
      },
    },
  },
};
