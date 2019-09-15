import Vue from 'vue'
import App from './App.vue'
import './styles/main.css'

Vue.config.productionTip = false

// vconsole
import VConsole from 'vconsole'
// if (process.env.NODE_ENV === 'production') {
var vConsole = new VConsole()
// }

new Vue({
  render: h => h(App)
}).$mount('#app')
