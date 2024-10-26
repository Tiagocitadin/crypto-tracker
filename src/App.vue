<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/cripto.jpeg">
    <CryptoTracker /> <!-- Componente de rastreamento de preço -->
  </div>
</template>

<script>
import CryptoTracker from './components/CryptoTracker.vue';

export default {
  name: 'App',
  components: {
    CryptoTracker

  }
}
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
