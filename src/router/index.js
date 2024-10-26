// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CryptoTracker from '@/components/CryptoTracker.vue';
import PhoneInput from '@/components/PhoneInput.vue';

const routes = [
  {
    path: '/',
    name: 'CryptoTracker',
    component: CryptoTracker,
  },
  {
    path: '/phone-input',
    name: 'PhoneInput',
    component: PhoneInput,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
