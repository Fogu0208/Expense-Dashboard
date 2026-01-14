<template>
  <div class="bg-white p-6 shadow-sm border border-gray-100 rounded-lg h-full flex flex-col items-center justify-center">
    <h2 class="text-lg font-bold mb-4 text-gray-700 w-full text-left border-l-4 border-gray-800 pl-3">支出构成</h2>
    
    <div v-if="hasData" class="w-full max-w-[250px] aspect-square relative">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-gray-400 text-sm py-10">
      暂无支出数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';
import type { ExpenseRecord } from '../types';

// 注册 Chart.js 组件
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  records: ExpenseRecord[]
}>();

const hasData = computed(() => {
  return props.records.some(r => r.type === 'expense');
});

const chartData = computed(() => {
  // 1. 筛选支出
  const expenses = props.records.filter(r => r.type === 'expense');
  
  // 2. 按备注(类别)分组求和
  const groups: Record<string, number> = {};
  expenses.forEach(r => {
    const key = r.note || '其他';
    groups[key] = (groups[key] || 0) + r.amount;
  });

  // 3. 排序并取前5，其他的归为“其他”
  // Sort entries
  let entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
  
  // 简单的颜色库
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#9CA3AF'];

  return {
    labels: entries.map(e => e[0]),
    datasets: [
      {
        backgroundColor: colors,
        data: entries.map(e => e[1]),
        borderWidth: 0
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8
      }
    }
  }
};
</script>
