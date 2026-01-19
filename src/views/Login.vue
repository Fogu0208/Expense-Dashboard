<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <div>
        <div class="mx-auto h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-2xl">¥</div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录账户
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">用户名</label>
            <input id="username" name="username" type="text" required v-model="username" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm" placeholder="用户名">
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input id="password" name="password" type="password" required v-model="password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm" placeholder="密码">
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            登录
          </button>
        </div>
        <div class="text-center">
          <router-link to="/register" class="font-medium text-gray-600 hover:text-gray-500">
            还没有账号？去注册
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.token);
    router.push('/');
  } catch (e: any) {
    error.value = e.response?.data?.message || '登录失败';
  }
};
</script>
