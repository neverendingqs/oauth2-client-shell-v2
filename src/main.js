import Vue from 'vue'
import './plugins/vue-form-wizard'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
