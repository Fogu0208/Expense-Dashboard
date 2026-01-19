<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 pb-10">
    <!-- 顶部导航 Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
           <!-- Logo Icon -->
           <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold">¥</div>
           <h1 class="text-xl font-bold tracking-tight text-gray-800">月度收支看板</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- 月份选择 Month Picker -->
          <input 
            type="month" 
            v-model="currentMonth"
            class="bg-gray-100 border-none rounded px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-gray-300 outline-none cursor-pointer hover:bg-gray-200 transition-colors"
          />
          <!-- 退出登录 Logout -->
          <button @click="logout" class="text-sm text-gray-500 hover:text-red-500 font-medium">
            退出
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-6">
      
      <!-- 统计卡片 Stats Cards (基于本月所有数据) -->
      <DashboardStats 
        :income="stats.income"
        :expense="stats.expense"
        :balance="stats.balance"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：添加表单 Left Column -->
        <div class="lg:col-span-1 flex flex-col gap-6">
          <AddRecordForm @add="handleAdd" />
        </div>

        <!-- 右侧：列表 & 搜索 Right Column -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <!-- 搜索框 Search Bar -->
          <div class="relative">
             <input 
               v-model="searchQuery"
               type="text" 
               placeholder="🔍 搜索备注关键词..." 
               class="w-full bg-white border border-gray-200 pl-4 pr-4 py-3 rounded-lg shadow-sm focus:outline-none focus:border-gray-400 transition-colors"
             />
          </div>

          <!-- 列表 List -->
          <ExpenseList 
            :records="filteredRecords" 
            @delete="handleDelete" 
          />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useExpenseStore } from '../stores/expense';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import DashboardStats from '../components/DashboardStats.vue';
import AddRecordForm from '../components/AddRecordForm.vue';
import ExpenseList from '../components/ExpenseList.vue';

// 引入 Store
const store = useExpenseStore();
const { records } = storeToRefs(store);
const router = useRouter();

// 状态：当前月份 (默认为 YYYY-MM 格式)
const currentMonth = ref(new Date().toISOString().slice(0, 7));

// 状态：搜索关键词
const searchQuery = ref('');

// 计算属性：本月所有记录 (用于统计和图表)
// Computed: All records for current month
const monthlyRecords = computed(() => {
  return records.value.filter(r => r.date.slice(0, 7) === currentMonth.value);
});

// 计算属性：列表显示的记录 (包含搜索过滤)
// Computed: Displayed records (filtered by search)
const filteredRecords = computed(() => {
  return monthlyRecords.value
    .filter(r => r.note.includes(searchQuery.value))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 按日期倒序
});

// 计算属性：统计数据
// Computed: Stats
const stats = computed(() => {
  const recs = monthlyRecords.value;
  const income = recs.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const expense = recs.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  return {
    income,
    expense,
    balance: income - expense
  };
});

// 初始化加载数据
onMounted(() => {
  store.fetchRecords();
});

// 事件处理：添加
const handleAdd = async (record: any) => {
  await store.addRecord(record);
};

// 事件处理：删除
const handleDelete = async (id: string) => {
  if (confirm('确定删除这条记录吗？')) {
    await store.removeRecord(id);
  }
};

// 退出登录
const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>
