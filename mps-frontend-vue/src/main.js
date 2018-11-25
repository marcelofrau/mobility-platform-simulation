// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import SocketConnection from './socket/SocketConnection'

Vue.config.productionTip = false

const resources = {
  socket: new SocketConnection()
}

/* eslint-disable no-new */
const vue = new Vue({
  sockets: {
    connect: () => {
      console.log('Socket connected')
    }
  },
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'

})

vue.updateAdminConfigs = () => {
  console.log('updateAdminConfig')
}
vue.step = () => {
  console.log(`step ${new Date()}`)
}

console.log(vue.step)

resources.socket.getAdminConfig(vue.updateAdminConfigs)
resources.socket.setStepCallback(vue.step)
