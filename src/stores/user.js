import { ref } from 'vue';
import { defineStore } from 'pinia';
import { loginUser, getUserById, getUserTransactions } from '@/service/user/userApi';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const transactions = ref([]);

  const login = async (userId, userPassword) => {
    const loggedInUser = await loginUser(userId, userPassword);
    const userTransactions = await getUserTransactions(loggedInUser.id);
    user.value = loggedInUser;
    transactions.value = userTransactions;
    localStorage.setItem('userId', loggedInUser.id);
  };

  const logout = () => {
    user.value = null;
    transactions.value = [];
    localStorage.removeItem('userId');
  };

  const restoreSession = async () => {
    const savedId = localStorage.getItem('userId');
    if (!savedId) return false;
    try {
      const [restoredUser, userTransactions] = await Promise.all([
        getUserById(savedId),
        getUserTransactions(savedId),
      ]);
      user.value = restoredUser;
      transactions.value = userTransactions;
      return true;
    } catch {
      localStorage.removeItem('userId');
      return false;
    }
  };

  const setUser = (nextUser) => {
    user.value = nextUser;
  };

  return { user, transactions, login, logout, restoreSession, setUser };
});
