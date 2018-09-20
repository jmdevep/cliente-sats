// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSession from 'vue-session'
import dotenv from 'dotenv'
import BootstrapVue from 'bootstrap-vue'
import JsonExcel from 'vue-json-excel'

dotenv.config()

var options = {
  persist: true
}

Vue.use(VueSession, options)
Vue.use(BootstrapVue);
Vue.config.productionTip = false
Vue.component('downloadExcel', JsonExcel)
/*
router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((route) => route.meta.auth)
  //const authed = store.state.user.isAuthorized
  console.log(this)
  if (authRequired) {
    console.log("No existe Sesion");
    next('/usuario/login');
  } else {
    console.log("Existe sesion");
    next();
  }
})*/

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})

