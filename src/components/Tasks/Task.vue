<template>
  <v-container fluid fill-height>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="!loading">
          <v-card-title primary-title>
            <div class="task_card" xs12>
              <h3 class="headline mb-0">Задача</h3>
              <div>Название:              <span>{{task.name}}</span> </div>
              <div>Описание:              <span>{{task.desc}}</span> </div>
              <div>Дата:                  <span>{{task.date}}</span> </div>
              <v-flex class="input_border">
                <v-label>{{'Статус: ' + task.statsGroup }}</v-label>
                <v-radio-group v-model="editStatsGroup = task.statsGroup" align-center justify-space-around wrap row>
                  <v-flex v-for="item in stats" row>
                    <v-radio
                      color='primary'
                      :key="item.title"
                      :label="item.title"
                      :value="item.title"
                    ></v-radio>
                  </v-flex>
                </v-radio-group>
              </v-flex>
              <v-flex class="input_border">
                <v-label>{{'Приоритет: ' + task.priorityGroup }}</v-label>
                <v-radio-group v-model="editPriorityGroup = task.priorityGroup" align-center justify-space-around row>
                  <v-flex v-for="item in priority" row>
                    <v-radio
                      color="primary"
                      :key="item.title"
                      :label="item.title"
                      :value="item.title"
                    ></v-radio>
                  </v-flex>
                </v-radio-group>
              </v-flex>
              <v-layout align-center justify-space-between flex-direction-row class="fdr">
                <v-flex sm5>
                  <v-text-field
                    prepend-icon="access_time"
                    name="editplanningTime"
                    label="Запланированное время"
                    hint="Укажите время в часах"
                    type="text"
                    v-model="editPlanningTime = task.planningTime"
                    :rules='timeRules'
                  >{{task.planningTime}}</v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex sm5>
                  <v-text-field
                    prepend-icon="access_time"
                    name="editresultTime"
                    label="Затраченное время"
                    hint="Укажите время в часах"
                    type="text"
                    v-model="editResultTime = task.resultTime"
                    :rules='resultTimeRules'
                  >{{task.resultTime}}</v-text-field>
                </v-flex>
              </v-layout>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-spacer>
              <v-btn :to="'/tasks'" @click="onCancel" flat>Отмена</v-btn>
              <v-btn class="success" @click="onSave">Сохранить</v-btn>
            </v-spacer>
          </v-card-actions>
        </v-card>
        <div v-else class="text-xs-center">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      task () {
        const id = this.id
        return this.$store.getters.taskById(id)
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    data: () => ({
      stats: [
        {title: 'Запланировано'},
        {title: 'В процессе'},
        {title: 'Готово'}
      ],
      priority: [
        {title: 'Низкий'},
        {title: 'Средний'},
        {title: 'Высокий'}
      ],
      timeRules: [
        v => !!v || 'Заполните данные!',
        v => !isNaN(v) || 'Введите числовое значение!'
      ],
      resultTimeRules: [
        v => !isNaN(v) || 'Введите числовое значение!'
      ],
      editStatsGroup: '',
      editPriorityGroup: '',
      editPlanningTime: '',
      editResultTime: ''
    }),
    methods: {
      onCancel () {
        this.editStatsGroup = this.task.statsGroup
        this.editPriorityGroup = this.task.priorityGroup
        this.editPlanningTime = this.task.planningTime
        this.editResultTime = this.task.resultTime
        this.$store.dispatch('fetchTasks')
        this.$router.push('/tasks')
      },
      onSave () {
        this.$store.dispatch('updateTask', {
          statsGroup: this.editStatsGroup,
          priorityGroup: this.editPriorityGroup,
          planningTime: this.editPlanningTime,
          resultTime: this.editResultTime,
          id: this.id
        })
          .then(() => {
            this.$router.push('/tasks')
          })
      }
    }
  }
</script>
<style scoped>
  .task_card > div{
    display: flex;
    margin-bottom: 15px;
    flex-direction: column;
  }
  .task_card > div:first-of-type{
    margin-top: 20px;
  }
  .input_border{
    border: 1px solid #BDBDBD;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 15px;
  }
  .fdr {
    flex-direction: row !important;
  }
</style>
