import * as fb from 'firebase'

class AddTask {
  constructor (userid, id = '', name, desc, date, priorityGroup, statsGroup, planningTime, resultTime = '') {
    this.userid = userid
    this.id = id
    this.name = name
    this.desc = desc
    this.date = date
    this.priorityGroup = priorityGroup
    this.statsGroup = statsGroup
    this.planningTime = planningTime
    this.resultTime = resultTime
  }
}

export default {
  state: {
    tasks: []
  },
  mutations: {
    addTask (state, payload) {
      state.tasks.push(payload)
    },
    loadTasks (state, payload) {
      state.tasks = payload
    },
    updateTask (state, {statsGroup, priorityGroup, planningTime, resultTime, id}) {
      const task = state.tasks.find(a => {
        return a.id === id
      })
      task.statsGroup = statsGroup
      task.priorityGroup = priorityGroup
      task.planningTime = planningTime
      task.resultTime = resultTime
    }
  },
  actions: {
    async addTask ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newTask = new AddTask(
          fb.auth().currentUser.uid,
          payload.id,
          payload.name,
          payload.desc,
          payload.date,
          payload.priorityGroup,
          payload.statsGroup,
          payload.planningTime,
          payload.resultTime
        )
        const task = await fb.database().ref('tasks').push(newTask)
        commit('setLoading', false)
        commit('addTask', {
          ...newTask,
          id: task.key
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchTasks ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultTasks = []
      try {
        const fbVal = await fb.database().ref('tasks').once('value')
        const tasks = fbVal.val()
        Object.keys(tasks).forEach(key => {
          const task = tasks[key]
          resultTasks.push(new AddTask(task.userid, key, task.name, task.desc, task.date, task.priorityGroup, task.statsGroup, task.planningTime, task.resultTime))
        })
        commit('loadTasks', resultTasks)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateTask ({commit}, {statsGroup, priorityGroup, planningTime, resultTime, id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.database().ref('tasks').child(id).update({
          statsGroup, priorityGroup, planningTime, resultTime
        })
        commit('updateTask', {
          statsGroup, priorityGroup, planningTime, resultTime, id
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  },
  getters: {
    tasks (state) {
      return state.tasks
    },
    taskById (state) {
      return taskId => {
        return state.tasks.find(task => task.id === taskId)
      }
    },
    taskByIdDel (state) {
      return taskId => {
        fb.database().ref('tasks').child(taskId).remove()
      }
    },
    myTasks (state) {
      return state.tasks.filter(task => {
        return task.userid === fb.auth().currentUser.uid
      })
    }
  }
}
