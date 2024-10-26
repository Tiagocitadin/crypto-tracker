<template>
  <div class="phone-input-container">
    <h2>Cadastro de Telefone</h2>

    <div class="input-group">
      <label for="name">Nome: <span>*</span></label>
      <input 
        v-model="name" 
        type="text" 
        id="name" 
        class="input-field" 
        placeholder="Digite seu nome" 
      >
    </div>

    <div class="input-group">
      <label for="countryCode">Código do País: <span>*</span></label>
      <select v-model="selectedCountryCode" id="countryCode" class="input-field">
        <option v-for="code in countryCodes" :key="code.value" :value="code.value">
          {{ code.label }}
        </option>
      </select>
    </div>

    <div class="input-group">
      <label for="phoneNumber">Seu Número de Celular: <span>*</span></label>
      <input 
        v-model="phoneNumber" 
        type="tel" 
        id="phoneNumber" 
        class="input-field" 
        placeholder="(XX)XXXXX-XXXX" 
        @input="formatPhoneNumber"
      >
    </div>

    <button class="register-button" @click="registerUser">Cadastrar</button>

    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'PhoneInput',
  setup() {
    const name = ref('');
    const selectedCountryCode = ref('+55');
    const phoneNumber = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');

    const countryCodes = [
      { label: 'Brasil (+55)', value: '+55' },
      { label: 'Estados Unidos (+1)', value: '+1' },
      { label: 'Argentina (+54)', value: '+54' },
      { label: 'Reino Unido (+44)', value: '+44' },
      { label: 'Canadá (+1)', value: '+1' },
      { label: 'México (+52)', value: '+52' },
      { label: 'França (+33)', value: '+33' },
      { label: 'Alemanha (+49)', value: '+49' },
      { label: 'Espanha (+34)', value: '+34' },
      { label: 'Itália (+39)', value: '+39' },
      { label: 'Portugal (+351)', value: '+351' },
    ];

    const formatPhoneNumber = () => {
      let cleaned = phoneNumber.value.replace(/\D/g, '');
      if (cleaned.length > 11) {
        cleaned = cleaned.slice(0, 11);
      }
      phoneNumber.value = cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    const registerUser = async () => {
  const fullPhoneNumber = `${selectedCountryCode.value}${phoneNumber.value.replace(/\D/g, '')}`;
  if (!name.value || !phoneNumber.value) {
    errorMessage.value = 'Por favor, preencha todos os campos obrigatórios.';
    successMessage.value = '';
    return;
  }

  try {
    // Verifica se o número já está cadastrado
    const checkResponse = await fetch('http://localhost:3000/fone');
    const users = await checkResponse.json();

    const userExists = users.some(user => user.phone === fullPhoneNumber);

    if (userExists) {
      errorMessage.value = 'Este número de telefone já está cadastrado.';
      successMessage.value = '';
      return;
    }

    // Cadastra sem o campo `id`
    const response = await fetch('http://localhost:3000/fone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        phone: fullPhoneNumber,
      }),
    });

    if (response.ok) {
      successMessage.value = `Cadastro realizado com sucesso para ${name.value}!`;
      errorMessage.value = '';
      setTimeout(() => {
        successMessage.value = '';
        name.value = '';
        selectedCountryCode.value = '+55';
        phoneNumber.value = '';
      }, 3000);
    } else {
      throw new Error('Erro ao cadastrar o usuário');
    }
  } catch (error) {
    errorMessage.value = 'Falha ao cadastrar o usuário.';
    console.error(error);
  }
};
    return {
      name,
      selectedCountryCode,
      phoneNumber,
      countryCodes,
      formatPhoneNumber,
      registerUser,
      successMessage,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.phone-input-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fdfdfd;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 22px;
  color: #1e88e5;
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

label span {
  color: red;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #1e88e5;
  outline: none;
}

.register-button {
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

.register-button:hover {
  background-color: #1565c0;
}

.success-message {
  font-size: 16px;
  color: #4caf50;
  text-align: center;
  margin-top: 15px;
}

.error-message {
  font-size: 16px;
  color: #e53935;
  text-align: center;
  margin-top: 15px;
}

input::placeholder {
  color: #aaa;
}

@media (max-width: 400px) {
  .phone-input-container {
    padding: 15px;
  }

  h2 {
    font-size: 18px;
  }

  .input-field, .register-button {
    padding: 8px;
    font-size: 14px;
  }
}
</style>
