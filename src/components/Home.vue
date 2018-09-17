<template>
  <v-container fluid fill-height class="gradient">
    <v-layout align-center justify-center>
      <v-flex xs12 class="text-xs-center">
        <h1>UI-task-tracker</h1>
        <v-btn color="success" :to="'/tasks'">Click me to start!</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
</script>
<style>
  .gradient{
  background: linear-gradient(112.88388844067117deg, rgba(231, 244, 245,1) 4.927083333333334%,rgba(78, 240, 250,1) 97.84374999999999%);
  }
</style>
