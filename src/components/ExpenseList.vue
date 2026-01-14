<template>
  <div class="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden flex flex-col h-full">
    <div class="p-4 border-b border-gray-100 bg-gray-50/50">
      <h2 class="text-lg font-bold text-gray-700">📋 本月明细</h2>
    </div>
    
    <div class="overflow-y-auto max-h-[400px]">
      <ul v-if="records.length > 0">
        <li 
          v-for="record in records" 
          :key="record.id" 
          class="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group"
        >
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">{{ record.note }}</span>
            <span class="text-xs text-gray-400 mt-1">{{ record.date }}</span>
          </div>
          
          <div class="flex items-center gap-4">
            <span 
              class="font-bold font-mono" 
              :class="record.type === 'income' ? 'text-green-600' : 'text-red-500'"
            >
              {{ record.type === 'income' ? '+' : '-' }} {{ record.amount.toFixed(2) }}
            </span>
            <!-- 删除按钮：鼠标悬停时颜色变深 -->
            <button 
              @click="$emit('delete', record.id)" 
              class="text-gray-300 hover:text-red-500 transition-colors p-1"
              title="删除"
            >
              ✕
            </button>
          </div>
        </li>
      </ul>
      <div v-else class="p-10 text-center text-gray-400 flex flex-col items-center">
        <p>📭 本月暂无记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExpenseRecord } from '../types';

defineProps<{
  records: ExpenseRecord[]
}>();

defineEmits(['delete']);
</script>
