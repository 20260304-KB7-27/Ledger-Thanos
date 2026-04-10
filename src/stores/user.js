import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  loginUser,
  getUserById,
  getUserTransactions,
} from '@/service/user/userApi';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const transactions = ref([]);

  // 거래 목록은 항상 이 함수로 갱신해서 파생 상태 계산 기준을 한곳으로 (ex) 새 유저 로그인
  const setTransactions = (nextTransactions = []) => {
    transactions.value = Array.isArray(nextTransactions)
      ? nextTransactions
      : [];
  };

  // 등록 성공 직후 새 거래를 붙이면 관련 집계가 즉시 다시 계산
  const addTransaction = (nextTransaction) => {
    if (!nextTransaction) return;
    transactions.value = [...transactions.value, nextTransaction];
  };

  // 감정 집계는 지출만 대상
  const expenseTransactions = computed(() =>
    transactions.value.filter((transaction) => transaction.type === 'expense')
  );

  const happyCount = computed(
    () =>
      expenseTransactions.value.filter(
        (transaction) => transaction.emotion === 'happy'
      ).length
  );

  const regretCount = computed(
    () =>
      expenseTransactions.value.filter(
        (transaction) => transaction.emotion === 'regret'
      ).length
  );

  const happyRatio = computed(() => {
    const totalEmotionCount = happyCount.value + regretCount.value;

    if (totalEmotionCount === 0) {
      return 0;
    }

    return happyCount.value / totalEmotionCount;
  });

  // happy 비율이 60% 이상이면 happy, 40% 이하면 regret, 그 사이는 neutral
  const dominantEmotion = computed(() => {
    if (happyCount.value === 0 && regretCount.value === 0) {
      return 'neutral';
    }

    if (happyRatio.value >= 0.6) {
      return 'happy';
    }

    if (happyRatio.value <= 0.4) {
      return 'regret';
    }

    return 'neutral';
  });

  // 실제 App에 적용될 css
  const appThemeClass = computed(() => `theme-${dominantEmotion.value}`);

  const login = async (userId, userPassword) => {
    const loggedInUser = await loginUser(userId, userPassword);
    const userTransactions = await getUserTransactions(loggedInUser.id);
    user.value = loggedInUser;
    setTransactions(userTransactions);
    localStorage.setItem('userId', loggedInUser.id);
  };

  const logout = () => {
    user.value = null;
    setTransactions([]);
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
      setTransactions(userTransactions);
      return true;
    } catch {
      localStorage.removeItem('userId');
      return false;
    }
  };

  const setUser = (nextUser) => {
    user.value = nextUser;
  };

  return {
    user,
    transactions,
    expenseTransactions,
    happyCount,
    regretCount,
    happyRatio,
    dominantEmotion,
    appThemeClass,
    login,
    logout,
    restoreSession,
    setUser,
    setTransactions,
    addTransaction,
  };
});
