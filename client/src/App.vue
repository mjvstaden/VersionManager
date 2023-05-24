<template>
  <main id="app">
    <router-view />
  </main>
</template>

<script lang="ts">
  import Header from './components/Login_Header.vue';

  export default {
    name: 'App',
    components: {
      Header,
    },
  }  
 
</script>

<style>


</style>

