import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ExpenseRecord } from '../types';

export const useExpenseStore = defineStore('expense', () => {
  // 状态：所有记录
  // State: All records
  const records = ref<ExpenseRecord[]>([]);

  // 初始化：从 localStorage 读取
  // Init: Load from localStorage
  const saved = localStorage.getItem('expense_records');
  if (saved) {
    try {
      records.value = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load records', e);
      records.value = [];
    }
  }

  // 监听：数据变动自动保存
  // Watch: Auto-save to localStorage
  watch(records, (newVal) => {
    localStorage.setItem('expense_records', JSON.stringify(newVal));
  }, { deep: true });

  // 动作：添加记录
  // Action: Add record
  const addRecord = (record: Omit<ExpenseRecord, 'id'>) => {
    records.value.push({
      id: Date.now().toString(),
      ...record
    });
  };

  // 动作：删除记录
  // Action: Delete record
  const removeRecord = (id: string) => {
    records.value = records.value.filter(r => r.id !== id);
  };

  return {
    records,
    addRecord,
    removeRecord
  };
});
