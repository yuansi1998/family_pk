/* eslint-disable */
module.exports = {
    lintOnSave: false,

    devServer: {

        overlay: {

            warning: false,

            errors: false

        }

    },
  publicPath: process.env.NODE_ENV === "production" ? "/m_static/activities/family_pk/" : "./",
  chainWebpack: process.env.NODE_ENV === "production" ? config => {
    // 对图片进行压缩处理
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false },
        pngquant: { quality: [0.65, 0.9], speed: 4 },
        gifsicle: { interlaced: false }
      });
  } : () => {}
}