<template>
  <div id="app">
    <AppNavbar /> <!-- Componente de navegação -->
    <router-view /> <!-- Exibe o componente da rota atual -->
  </div>
</template>

<script>
// src/components/App.vue
import AppNavbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
   
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
