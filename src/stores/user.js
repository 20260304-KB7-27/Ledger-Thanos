import { ref } from 'vue';
import { defineStore } from 'pinia';
import { loginUser, getUserTransactions } from '@/service/user/userApi';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const transactions = ref([]);

  const login = async (userId, userPassword) => {
    const loggedInUser = await loginUser(userId, userPassword);
    const userTransactions = await getUserTransactions(loggedInUser.id);
    user.value = loggedInUser;
    transactions.value = userTransactions;
  };

  const logout = () => {
    user.value = null;
    transactions.value = [];
  };

  return { user, transactions, login, logout };
});
