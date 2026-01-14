<template>
  <div class="bg-white p-6 shadow-sm border border-gray-100 rounded-lg mb-6">
    <h2 class="text-lg font-bold mb-4 text-gray-700 border-l-4 border-gray-800 pl-3">记一笔</h2>
    <form @submit.prevent="submit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- 金额 Amount -->
        <div>
          <label class="block text-sm text-gray-500 mb-1 font-medium">金额</label>
          <input 
            v-model.number="form.amount" 
            type="number" 
            step="0.01" 
            required
            class="w-full bg-gray-50 border border-gray-200 p-2 rounded focus:outline-none focus:border-gray-400 transition-colors"
            placeholder="0.00"
          />
        </div>
        <!-- 日期 Date -->
        <div>
          <label class="block text-sm text-gray-500 mb-1 font-medium">日期</label>
          <input 
            v-model="form.date" 
            type="date" 
            required
            class="w-full bg-gray-50 border border-gray-200 p-2 rounded focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- 类型 Type -->
        <div>
          <label class="block text-sm text-gray-500 mb-1 font-medium">类型</label>
          <div class="flex space-x-2">
            <button 
              type="button"
              @click="form.type = 'expense'"
              class="flex-1 py-2 rounded border text-sm font-bold transition-all"
              :class="form.type === 'expense' ? 'bg-red-50 border-red-500 text-red-600' : 'border-gray-200 text-gray-400 hover:border-gray-300'"
            >
              支出
            </button>
            <button 
              type="button"
              @click="form.type = 'income'"
              class="flex-1 py-2 rounded border text-sm font-bold transition-all"
              :class="form.type === 'income' ? 'bg-green-50 border-green-500 text-green-600' : 'border-gray-200 text-gray-400 hover:border-gray-300'"
            >
              收入
            </button>
          </div>
        </div>
        <!-- 备注 Note -->
        <div>
           <label class="block text-sm text-gray-500 mb-1 font-medium">备注 (类别)</label>
           <input 
             v-model="form.note" 
             type="text" 
             class="w-full bg-gray-50 border border-gray-200 p-2 rounded focus:outline-none focus:border-gray-400 transition-colors"
           />
        </div>
      </div>

      <button 
        type="submit" 
        class="w-full bg-gray-800 text-white py-3 rounded font-bold hover:bg-gray-700 active:scale-[0.99] transition-all"
      >
        确认添加
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { TransactionType } from '../types';

// 定义事件
const emit = defineEmits(['add']);

// 表单数据
const form = reactive({
  amount: '' as any, // 初始为空
  type: 'expense' as TransactionType,
  date: new Date().toISOString().split('T')[0], // 默认今天
  note: ''
});

// 提交处理
const submit = () => {
  if (!form.amount) return;
  
  emit('add', {
    amount: Number(form.amount),
    type: form.type,
    date: form.date,
    // 如果没填备注，默认显示类型
    note: form.note || (form.type === 'expense' ? '一般支出' : '一般收入')
  });

  // 重置表单 (保留日期)
  form.amount = '';
  form.note = '';
};
</script>
