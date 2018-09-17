<template>
  <v-container fluid fill-height class="gradient">
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" validation>
              <v-text-field
                prepend-icon="email"
                name="email"
                label="E-mail"
                type="text"
                v-model="email"
                :rules="emailRules"
                class="input-group--focused"
              ></v-text-field>
              <v-text-field
              :append-icon="showPass ? 'visibility_off' : 'visibility'"
              :type="showPass ? 'text' : 'password'"
              @click:append="showPass = !showPass"
              prepend-icon="lock"
              name="password"
              label="Пароль"
              v-model="password"
              counter
              :rules="passwordRules"
              hint="Минимум 7 символов"
              class="input-group--focused"
            ></v-text-field>
              <v-text-field
                :append-icon="showPassConfirm ? 'visibility_off' : 'visibility'"
                :type="showPassConfirm ? 'text' : 'password'"
                @click:append="showPassConfirm = !showPassConfirm"
                prepend-icon="lock"
                name="passwordConfirm"
                label="Подтверждение пароля"
                v-model="passwordConfirm"
                counter
                :rules="passwordConfirmRules"
                hint="Минимум 7 символов"
                class="input-group--focused"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              v-on:click="onSubmit"
              :loading="loading"
              :disabled="!valid || loading"
            >Зарегистрироваться</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        password: '',
        passwordConfirm: '',
        showPass: false,
        showPassConfirm: false,
        valid: false,
        passwordRules: [
          v => !!v || 'Введите пароль!',
          v => v.length >= 7 || 'Пароль должен быть не меньше 7 символов'
        ],
        passwordConfirmRules: [
          v => !!v || 'Введите пароль!',
          v => v.length >= 7 || 'Пароль должен быть не меньше 7 символов',
          v => v === this.password || 'Пароли не совподают'
        ],
        emailRules: [
          v => !!v || 'Введите e-mail!',
          v => /.+@.+/.test(v) || 'E-mail введен неверно'
        ]
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onSubmit () {
        if (this.$refs.form.validate()) {
          const user = {
            email: this.email,
            password: this.password
          }
          this.$store.dispatch('registerUser', user)
            .then(() => {
              this.$router.push('/login')
            })
            .catch(() => {})
        }
      }
    }
  }
</script>
