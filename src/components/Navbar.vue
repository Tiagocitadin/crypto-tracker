<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link" :exact="true">Rastreamento de Preço</router-link>
    <router-link to="/phone-input" class="nav-link">Cadastro de Telefone</router-link>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 0;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

.nav-link {
  text-decoration: none;
  color: #1e88e5;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #e0f2f1;
}

.router-link-exact-active {
  background-color: #1e88e5;
  color: #fff;
}
</style>
