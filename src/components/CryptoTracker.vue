<template>
  <div>
    <h1>Crypto Price Tracker</h1>
    
    <div>
      <label for="crypto">Criptomoeda:</label>
      <select v-model="selectedCrypto" id="crypto">
        <option value="BTC">Bitcoin (BTC)</option>
        <option value="ETH">Ethereum (ETH)</option>
        <option value="LTC">Litecoin (LTC)</option>
        <option value="SHIB">Shiba Inu (SHIB)</option>
      </select>
    </div>

    <!-- Exibe o preço atual da criptomoeda selecionada -->
    <p>Preço Atual: <span>{{ price !== null ? formatCurrency(price) : 'Carregando...' }}</span></p>

    <!-- Campo de alerta de compra -->
    <div>
      <label for="buyAlertPrice">Defina um Alerta de Compra:</label>
      <input v-model.number="buyAlertPrice" type="number" id="buyAlertPrice" placeholder="Ex: 100000">
    </div>

    <!-- Campo de alerta de venda -->
    <div>
      <label for="sellAlertPrice">Defina um Alerta de Venda:</label>
      <input v-model.number="sellAlertPrice" type="number" id="sellAlertPrice" placeholder="Ex: 200000">
    </div>

    <button @click="startTracking">Iniciar Rastreamento</button>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

export default {
  name: 'CryptoTracker',
  setup() {
    const selectedCrypto = ref('BTC');
    const price = ref(null);
    const buyAlertPrice = ref(null);
    const sellAlertPrice = ref(null);
    const tracking = ref(false);

    // Função para buscar preço da criptomoeda
    const fetchCryptoPrice = async () => {
      try {
        const response = await fetch(`https://www.mercadobitcoin.com.br/api/${selectedCrypto.value}/ticker/`);
        const data = await response.json();
        price.value = parseFloat(data.ticker.last);
      } catch (error) {
        console.error("Erro ao buscar preço:", error);
        price.value = null;
      }
    };

    // Função para formatar valores monetários no formato brasileiro com mais casas decimais
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 12,
      }).format(value);
    };

    // Atualiza o preço periodicamente e verifica os alertas de compra e venda
    const updatePrice = async () => {
      if (!tracking.value) return;

      await fetchCryptoPrice(); // Atualiza o preço atual

      // Verifica se o preço atinge o limite de compra
      if (buyAlertPrice.value && price.value <= buyAlertPrice.value) {
        alert(`Alerta de Compra! O preço de ${selectedCrypto.value} está em ${formatCurrency(price.value)}.`);
        buyAlertPrice.value = null; // Reseta o alerta de compra após disparar
      }

      // Verifica se o preço atinge o limite de venda
      if (sellAlertPrice.value && price.value >= sellAlertPrice.value) {
        alert(`Alerta de Venda! O preço de ${selectedCrypto.value} está em ${formatCurrency(price.value)}.`);
        sellAlertPrice.value = null; // Reseta o alerta de venda após disparar
      }
    };

    // Inicia o rastreamento e atualiza o preço a cada 30 segundos
    const startTracking = () => {
      tracking.value = true;
      setInterval(updatePrice, 30000);
    };

    // Atualiza o preço quando a criptomoeda é alterada
    watch(selectedCrypto, fetchCryptoPrice);

    // Faz a primeira chamada de preço ao montar o componente
    onMounted(fetchCryptoPrice);

    return {
      selectedCrypto,
      price,
      buyAlertPrice,
      sellAlertPrice,
      startTracking,
      formatCurrency,
    };
  }
};
</script>

<style scoped>
/* Estilos para o componente */
div {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  color: #333;
}

h1 {
  font-size: 24px;
  color: #1e88e5;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

label {
  font-size: 14px;
  color: #555;
  display: block;
  margin-bottom: 5px;
}

select, input[type="number"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s;
}

select:focus, input[type="number"]:focus {
  border-color: #1e88e5;
  outline: none;
}

p {
  font-size: 18px;
  font-weight: bold;
  color: #4caf50;
  text-align: center;
  margin: 20px 0;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #1e88e5;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1565c0;
}

button:focus {
  outline: none;
}

@media (max-width: 600px) {
  h1 {
    font-size: 20px;
  }

  select, input[type="number"], button {
    font-size: 14px;
  }
}
</style>
