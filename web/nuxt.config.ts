export default {
  mode: 'universal',
  srcDir: "src/",
  server: {
    port: 65431,
    host: process.env.HOST,
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: `https://maps.google.com/maps/api/js?key=AIzaSyAkprW6ct78IGL2pDWsLWiO-5M230BCk50&libraries=visualization`,
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    "@nuxt/typescript-build"
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    "bootstrap-vue/nuxt",
    "@nuxt/http",
  ],
  /*
  ** Build configuration
  */
  build: {
  },
  http: {
    // host: 'siiid-api.satokuau.com',
    proxy: true,
    // https: true,
  },
  proxy: {
    '/api/': {
      target: 'https://siiid-api.satokura.com',
      pathRewrite: { '^/api/': '' }
    }
  }
}
