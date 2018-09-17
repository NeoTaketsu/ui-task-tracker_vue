<template>
  <v-container fluid fill-height>
    <v-layout row>
      <v-flex xs12 v-if="!loading">
        <v-flex xs12 sm12 md8 lg6 xl4>
          <h1>Добавление задачи</h1>
          <v-form v-model="valid" ref="form" validation>
            <v-text-field
              label="Название"
              name="name"
              v-model="name"
              :rules="emptyRules"
              required
            ></v-text-field>
            <v-textarea
              name="description"
              label="Описание"
              v-model="desc"
              :rules="emptyRules"
              value=""
              required
            ></v-textarea>
            <v-flex class="input_border">
              <v-label>{{'Статус: ' + statsGroup }}</v-label>
              <v-radio-group v-model="statsGroup" align-center justify-space-around wrap row>
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
              <v-label>{{'Приоритет: ' + priorityGroup }}</v-label>
              <v-radio-group v-model="priorityGroup" align-center justify-space-around row>
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
            <v-flex xs12 sm6 md4>
              <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                :nudge-right="40"
                :return-value.sync="date"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                :rules="emptyRules"
              >
                <v-text-field
                  slot="activator"
                  v-model="date"
                  label="Выберите дату"
                  prepend-icon="event"
                  :rules="emptyRules"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Отмена</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-layout align-center justify-space-between row>
              <v-flex sm5>
                <v-text-field
                  prepend-icon="access_time"
                  name="planningTime"
                  label="Запланированное время"
                  hint="Укажите время в часах"
                  type="text"
                  v-model="planningTime"
                  :rules='timeRules'
                ></v-text-field>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex sm5>
                <v-text-field
                  prepend-icon="access_time"
                  name="resultTime"
                  label="Затраченное время"
                  hint="Укажите время в часах"
                  type="text"
                  v-model="resultTime"
                  :rules='resultTimeRules'
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-btn
              :loading="loading"
              @click="addTask"
              color="info"
              :disabled="!valid"
            >Добавить</v-btn>
            <v-btn @click="clear">Очистить</v-btn>
          </v-form>
        </v-flex>
        <h1>Задачи</h1>
        <v-data-table
          :headers="headers"
          :items="tasks"
          :key="tasks.id"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.desc }}</td>
            <td class="text-xs-left">{{ props.item.date }}</td>
            <td class="text-xs-left">{{ props.item.statsGroup }}</td>
            <td class="text-xs-left">{{ props.item.priorityGroup }}</td>
            <td class="text-xs-left">
              <v-btn icon :to="'/task/' + props.item.id">
                <v-icon color="grey darken-4">edit</v-icon>
              </v-btn>
              <v-btn icon @click="removeTask(props.item.id)">
                <v-icon color="red">close</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex xs12 v-else class="text-xs-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      modalEdit: false,
      valid: false,
      headers: [
        { text: 'Название', value: 'name' },
        { text: 'Описание', value: 'desc' },
        { text: 'Дата', value: 'date' },
        { text: 'Статус', value: 'statsGroup' },
        { text: 'Приоритет', value: 'priorityGroup' },
        { text: 'Действия', value: '' }
      ],
      name: '',
      desc: '',
      stats: [
        {title: 'Запланировано', id: 'plan', icon: 'query_builder', color: 'cyan lighten-4'},
        {title: 'В процессе', id: 'progress', icon: 'done', color: 'info'},
        {title: 'Готово', id: 'done', icon: 'done_all', color: 'success'}
      ],
      priority: [
        {title: 'Низкий'},
        {title: 'Средний'},
        {title: 'Высокий'}
      ],
      date: null,
      menu: false,
      modal: false,
      priorityGroup: 'Низкий',
      statsGroup: 'Запланировано',
      emptyRules: [
        v => !!v || 'Заполните данные!'
      ],
      timeRules: [
        v => !!v || 'Заполните данные!',
        v => !isNaN(v) || 'Введите числовое значение!'
      ],
      resultTimeRules: [
        v => !isNaN(v) || 'Введите числовое значение!'
      ]
    }),
    computed: {
      tasks () {
        return this.$store.getters.myTasks
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      addTask () {
        if (this.$refs.form.validate()) {
          const task = {
            id: this.id,
            name: this.name,
            desc: this.desc,
            date: this.date,
            priorityGroup: this.priorityGroup,
            statsGroup: this.statsGroup,
            planningTime: this.planningTime,
            resultTime: this.resultTime
          }
          this.$store.dispatch('addTask', task)
            .then(() => {
              this.$router.push('/tasks')
            })
            .catch(() => {})
          this.name = ''
          this.desc = ''
          this.date = null
          this.priorityGroup = 'Низкий'
          this.statsGroup = 'Запланировано'
          this.planningTime = ''
          this.resultTime = ''
        }
      },
      removeTask (id) {
        this.$store.getters.taskByIdDel(id)
        this.$store.dispatch('fetchTasks')
      },
      clear () {
        this.name = ''
        this.desc = ''
        this.date = null
        this.priorityGroup = 'Низкий'
        this.statsGroup = 'Запланировано'
        this.planningTime = ''
        this.resultTime = ''
      }
    }
  }
</script>

<style scoped>
  .pointer{
    cursor: pointer;
  }
  .input_border{
    border: 1px solid #BDBDBD;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 15px;
  }
  .task_card > div{
    display: flex;
    margin-bottom: 15px;
    flex-direction: column;
  }
  .task_card .title{
    margin-bottom: 5px;
  }
  .task_card span{
    font-size: 18px;
  }
</style>
