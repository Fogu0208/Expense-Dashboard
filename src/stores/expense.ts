import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import type { ExpenseRecord } from '../types';

export const useExpenseStore = defineStore('expense', () => {
  const records = ref<ExpenseRecord[]>([]);

  // 获取所有记录
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      records.value = response.data;
    } catch (e) {
      console.error('Failed to fetch records', e);
    }
  };

  // 添加记录
  const addRecord = async (record: Omit<ExpenseRecord, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/expenses', record, {
        headers: { Authorization: `Bearer ${token}` }
      });
      records.value.push(response.data);
    } catch (e) {
      console.error('Failed to add record', e);
    }
  };

  // 删除记录
  const removeRecord = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      records.value = records.value.filter(r => r.id !== id);
    } catch (e) {
      console.error('Failed to delete record', e);
    }
  };

  return {
    records,
    fetchRecords,
    addRecord,
    removeRecord
  };
});
