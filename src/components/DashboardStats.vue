<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <!-- 收入 Income -->
    <div class="bg-white p-4 shadow-sm border border-gray-100 rounded-lg flex flex-col items-center md:items-start">
      <h3 class="text-gray-500 text-sm font-medium">本月总收入</h3>
      <p class="text-2xl font-bold text-green-600 mt-1">¥ {{ income.toFixed(2) }}</p>
    </div>
    <!-- 支出 Expense -->
    <div class="bg-white p-4 shadow-sm border border-gray-100 rounded-lg flex flex-col items-center md:items-start">
      <h3 class="text-gray-500 text-sm font-medium">本月总支出</h3>
      <p class="text-2xl font-bold text-red-500 mt-1">¥ {{ expense.toFixed(2) }}</p>
    </div>
    <!-- 结余 Balance -->
    <div class="bg-white p-4 shadow-sm border border-gray-100 rounded-lg flex flex-col items-center md:items-start">
      <h3 class="text-gray-500 text-sm font-medium">本月结余</h3>
      <p class="text-2xl font-bold mt-1" :class="balance >= 0 ? 'text-gray-800' : 'text-red-500'">
        ¥ {{ balance.toFixed(2) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义接收的属性
// Props definition
defineProps<{
  income: number;
  expense: number;
  balance: number;
}>();
</script>
