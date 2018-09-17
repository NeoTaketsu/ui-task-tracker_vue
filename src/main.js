import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import * as fb from 'firebase'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    fb.initializeApp({
      apiKey: 'AIzaSyAYPMdON7_ivMl7OpuVxEZBEiIb_ILkhbM',
      authDomain: 'ui-task-tracker.firebaseapp.com',
      databaseURL: 'https://ui-task-tracker.firebaseio.com',
      projectId: 'ui-task-tracker',
      storageBucket: 'ui-task-tracker.appspot.com',
      messagingSenderId: '358650578280'
    })
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    })
    this.$store.dispatch('fetchTasks')
  }
})
