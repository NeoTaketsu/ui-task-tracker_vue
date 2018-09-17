import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '@/components/Home'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'
import Tasks from '@/components/Tasks/Tasks'
import Task from '@/components/Tasks/Task'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration
    },
    {
      path: '/task/:id',
      props: true,
      name: 'task',
      component: Task,
      beforeEnter: AuthGuard
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
      beforeEnter: AuthGuard
    }
  ],
  mode: 'history'
})
