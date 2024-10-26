<template>
  <div>
    <h1>Crypto Price Tracker</h1>
    
    <!-- Campo para o usuário inserir o telefone e verificar se está cadastrado -->
    <div v-if="!isPhoneRegistered" class="phone-input-section">
      <label for="userPhone">Número de Celular:</label>
      <input v-model="userPhone" type="tel" id="userPhone" placeholder="Digite seu número para login" @input="formatPhoneInput">
      <button @click="verifyPhone">Verificar</button>
    </div>

    <!-- Exibe mensagem caso o telefone não esteja cadastrado -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <!-- Exibe o preço atual da criptomoeda selecionada após login -->
    <div v-if="isPhoneRegistered">
      <h2>Bem-vindo de volta, {{ userName }}!</h2>
      <button @click="logout" class="logout-button">Logout</button>
      <div>
        <label for="crypto">Criptomoeda:</label>
        <select v-model="selectedCrypto" id="crypto" class="small-input" :disabled="tracking">
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="LTC">Litecoin (LTC)</option>
          <option value="SHIB">Shiba Inu (SHIB)</option>
        </select>
      </div>

      <p>Preço Atual: <span>{{ price !== null ? formatCurrency(price) : 'Carregando...' }}</span></p>
      <p>Última Diferença: <span :class="{ positive: lastDifference > 0, negative: lastDifference < 0 }">{{ lastDifference !== null ? formatCurrency(lastDifference) : 'Nenhuma' }}</span></p>
      <p>Próxima atualização em: <span>{{ countdown > 0 ? countdown : '' }}s</span></p>

      <div>
        <label for="buyAlertPrice">Defina um Alerta de Compra:</label>
        <input v-model.number="buyAlertPrice" type="number" id="buyAlertPrice" placeholder="Ex: 100000" :disabled="tracking">
      </div>

      <div>
        <label for="sellAlertPrice">Defina um Alerta de Venda:</label>
        <input v-model.number="sellAlertPrice" type="number" id="sellAlertPrice" placeholder="Ex: 200000" :disabled="tracking">
      </div>

      <button @click="toggleTracking">{{ tracking ? 'Parar Rastreamento' : 'Iniciar Rastreamento' }}</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'CryptoPriceTracker',
  setup() {
    const selectedCrypto = ref('BTC');
    const price = ref(null);
    const buyAlertPrice = ref(null);
    const sellAlertPrice = ref(null);
    const tracking = ref(false);
    const countdown = ref(15);
    const lastDifference = ref(null);
    const userPhone = ref(''); // Número inserido pelo usuário para verificação
    const isPhoneRegistered = ref(false); // Verifica se o telefone está registrado
    const errorMessage = ref('');
    const userName = ref(''); // Armazena o nome do usuário para a mensagem de boas-vindas
    const countryCode = '+55'; // Código do país
    let updateInterval = null;
    let countdownInterval = null;

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      }).format(value);
    };

    const toggleTracking = () => {
      tracking.value = !tracking.value;
      if (tracking.value) {
        startTracking();
      } else {
        stopTracking();
      }
    };

    const startTracking = () => {
      countdown.value = 15;
      updateInterval = setInterval(updatePrice, 15000);
      countdownInterval = setInterval(() => {
        countdown.value = countdown.value > 0 ? countdown.value - 1 : 15;
      }, 1000);
    };

    const stopTracking = () => {
      clearInterval(updateInterval);
      clearInterval(countdownInterval);
      tracking.value = false;
      countdown.value = 15;
    };

    const updatePrice = async () => {
      try {
        const response = await fetch(`https://www.mercadobitcoin.com.br/api/${selectedCrypto.value}/ticker/`);
        const data = await response.json();
        const newPrice = parseFloat(data.ticker.last);
        lastDifference.value = price.value !== null ? newPrice - price.value : 0;
        price.value = newPrice;
      } catch (error) {
        console.error("Erro ao buscar preço:", error);
      }
    };

    onMounted(() => {
      updatePrice();
    });

    // Formata o número de telefone para o formato (XX) XXXXX-XXXX
    const formatPhoneInput = () => {
      let cleaned = userPhone.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (cleaned.length > 11) {
        cleaned = cleaned.slice(0, 11); // Limita a 11 dígitos
      }
      userPhone.value = cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    // Função para verificar se o telefone está cadastrado no db.json
    const verifyPhone = async () => {
      try {
        const response = await fetch('http://localhost:3000/fone');
        const users = await response.json();

        // Inclui o código do país antes dos 10 dígitos finais
        const inputPhoneWithCountryCode = `${countryCode}${userPhone.value.replace(/\D/g, '')}`;

        // Procura o usuário pelo número de telefone com o código do país
        const user = users.find(user => user.phone === inputPhoneWithCountryCode);

        if (user) {
          userName.value = user.name;
          isPhoneRegistered.value = true;
          errorMessage.value = '';
        } else {
          errorMessage.value = 'Número não cadastrado. Cadastre-se antes de iniciar o rastreamento.';
          isPhoneRegistered.value = false;
        }
      } catch (error) {
        errorMessage.value = 'Erro ao verificar o número de telefone.';
        console.error(error);
      }
    };

    const logout = () => {
      isPhoneRegistered.value = false;
      userPhone.value = ''; // Limpa o campo de entrada de telefone
      userName.value = ''; // Limpa o nome do usuário
    };

    return {
      selectedCrypto,
      price,
      buyAlertPrice,
      sellAlertPrice,
      countdown,
      lastDifference,
      tracking,
      toggleTracking,
      formatCurrency,
      userPhone,
      isPhoneRegistered,
      errorMessage,
      userName,
      verifyPhone,
      formatPhoneInput,
      logout,
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

input, select, button {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s;
}

button {
  background-color: #1e88e5;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}

.logout-button {
  background-color: #d9534f;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}

.logout-button:hover {
  background-color: #c9302c;
}

.error-message {
  color: #e53935;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}

.phone-input-section {
  text-align: center;
  margin-bottom: 20px;
}
</style>
