<template>
  <div class="main">
    <div class="header">
      <Box width="custom" custom-width="100%" :shadow="false">
        <div class="period-toggle">
          <button
            class="toggle-btn"
            :class="{ active: periodMode === 'week' }"
            @click="setPeriodMode('week')"
          >
            주간
          </button>
          <button
            class="toggle-btn"
            :class="{ active: periodMode === 'month' }"
            @click="setPeriodMode('month')"
          >
            월간
          </button>
        </div>
      </Box>

      <h3>
        <button class="month-arrow" @click="goPrevPeriod">&lt;</button>
        <span>{{ periodLabel }}</span>
        <button class="month-arrow" @click="goNextPeriod">&gt;</button>
      </h3>

      <Box width="custom" custom-width="100%" id="download-pdf" :shadow="false">
        <div class="box-label-header pdf-button" @click="exportPdf">
          PDF 내보내기
        </div>
      </Box>
    </div>
    <div class="content">
      <div id="common-stats">
        <div id="account-info">
          <Box width="custom" custom-width="100%" class="box-label-account" :shadow="false">
            <div>
              {{ periodMode === 'week' ? '이번주 수입' : '이번달 수입' }}
            </div>
            <div>{{ formatAmount(periodIncome) }}</div>
          </Box>

          <Box width="custom" custom-width="100%" class="box-label-account" :shadow="false">
            <div>
              {{ periodMode === 'week' ? '이번주 지출' : '이번달 지출' }}
            </div>
            <div>{{ formatAmount(periodExpense) }}</div>
          </Box>

          <Box width="custom" custom-width="100%" class="box-label-account" :shadow="false">
            <div>순수익</div>
            <div>{{ formatAmount(netProfit) }}</div>
          </Box>
        </div>
        <div id="emotion-info">
          <Box width="custom" custom-width="100%" :shadow="false">
            <div class="emotion-content">
              <div class="box-label">감정 통계</div>
              <div class="box-content">
                <div id="emotion-stats">
                  {{ emotionSatisfiedCount }}회 만족, {{ emotionRegretCount }}회
                  후회
                </div>

                <ProgressBarChart
                  v-if="expenseTransactions.length > 0"
                  :value="emotionSatisfiedRate"
                  :max-value="100"
                  bar-color="#FFE99A"
                  background-color="white"
                  :height="30"
                  :border-width="1"
                  border-color="#d9d9d9"
                />

                <div id="emotion-ratio">
                  만족한 소비비율: {{ emotionSatisfiedRate }}%
                </div>
              </div>
            </div>
          </Box>
        </div>
        <div id="trade-history-info">
          <Box width="custom" custom-width="100%" class="box-custom" :shadow="false">
            <div class="scroll-box">
              <div class="box-label">거래 내역</div>

              <div v-if="loading" class="status-text">불러오는 중...</div>
              <div v-else-if="error" class="status-text error">{{ error }}</div>

              <div v-else class="deal-list">
                <Deal
                  v-for="item in dealLists"
                  :key="item.id"
                  :title="item.title"
                  :location="item.location"
                  :amount="item.amount"
                  :icon="item.icon"
                />
              </div>
            </div>
          </Box>
        </div>
      </div>
      <div id="theme-stats">
        <div id="location-spend">
          <Box width="custom" custom-width="100%" class="box-custom" :shadow="false">
            <div class="scroll-box">
              <div class="box-label">지역별 소비</div>

              <div v-if="loading" class="status-text">불러오는 중...</div>
              <div v-else class="local-list">
                <LocalSpending
                  v-for="item in localSpendingList"
                  :key="item.rank"
                  :rank="item.rank"
                  :region="item.region"
                  :period="item.period"
                  :amount="item.amount"
                />
              </div>
            </div>
          </Box>
        </div>

        <div id="category-spend">
          <Box width="custom" custom-width="100%" class="box-custom" :shadow="false">
            <div class="scroll-box">
              <div class="box-label">카테고리별 지출</div>

              <div v-if="loading" class="status-text">불러오는 중...</div>
              <div v-else class="category-list">
                <CategorySpending
                  v-for="item in categorySpendingList"
                  :key="item.id"
                  :category="item.category"
                  :amount="item.amount"
                  :icon="item.icon"
                />
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Box from '@/components/Box.vue';
import ProgressBarChart from '@/components/ProgressBarChart.vue';
import Deal from './components/Deal.vue';
import LocalSpending from './components/LocalSpending.vue';
import CategorySpending from './components/CategorySpending.vue';
import { useUserStore } from '@/stores/user';
import { ref, onMounted, computed } from 'vue';
import {
  Beer,
  BusFront,
  Coffee,
  Cross,
  Ellipsis,
  Hamburger,
  Package,
  ShoppingBag,
  Store,
  Utensils,
} from '@lucide/vue';
import { getUserTransactions } from '@/service/user/userApi';

const userStore = useUserStore();
// 현재 유저 거래 목록
const transactions = ref([]);

const periodMode = ref('month');

// 화면 기준 월
const baseDate = ref(new Date(2026, 3, 1)); // 2026-04-01

const loading = ref(false);
const error = ref('');

// UI 기준 카테고리 순서
const categoryList = ref([
  { id: 1, label: '쇼핑', value: 'shopping', icon: ShoppingBag },
  { id: 2, label: '배달', value: 'delivery', icon: Hamburger },
  { id: 3, label: '식당', value: 'restaurant', icon: Utensils },
  { id: 4, label: '편의점', value: 'convenience', icon: Store },
  { id: 5, label: '카페', value: 'cafe', icon: Coffee },
  { id: 6, label: '술집', value: 'bar', icon: Beer },
  { id: 7, label: '생필품', value: 'essentials', icon: Package },
  { id: 8, label: '교통', value: 'transport', icon: BusFront },
  { id: 9, label: '병원', value: 'hospital', icon: Cross },
  { id: 10, label: '기타', value: 'etc', icon: Ellipsis },
]);

const categoryMetaMap = computed(() => {
  return categoryList.value.reduce((acc, item) => {
    acc[item.value] = {
      label: item.label,
      icon: item.icon,
      order: item.id,
    };
    return acc;
  }, {});
});

const formatAmount = (value) => `${Number(value || 0).toLocaleString()}원`;

const cloneDate = (date) => new Date(date);

const startOfMonth = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfMonth = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfWeek = (date) => {
  const d = cloneDate(date);
  const day = d.getDay(); // 0:일 ~ 6:토
  const diff = day === 0 ? -6 : 1 - day; // 월요일 시작
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfWeek = (date) => {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

const getWeekOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekStart = startOfWeek(firstDay);
  const currentWeekStart = startOfWeek(date);
  const diffDays = Math.floor(
    (currentWeekStart - firstWeekStart) / (1000 * 60 * 60 * 24)
  );
  return Math.floor(diffDays / 7) + 1;
};

const currentYear = computed(() => baseDate.value.getFullYear());
const currentMonth = computed(() => baseDate.value.getMonth() + 1);
const currentWeek = computed(() => getWeekOfMonth(baseDate.value));

const periodLabel = computed(() => {
  if (periodMode.value === 'month') {
    return `${currentYear.value}년 ${currentMonth.value}월`;
  }
  return `${currentYear.value}년 ${currentMonth.value}월 ${currentWeek.value}주차`;
});

const periodRange = computed(() => {
  if (periodMode.value === 'month') {
    return {
      start: startOfMonth(baseDate.value),
      end: endOfMonth(baseDate.value),
    };
  }

  return {
    start: startOfWeek(baseDate.value),
    end: endOfWeek(baseDate.value),
  };
});

const isCurrentPeriodTransaction = (tx) => {
  const date = new Date(tx.date);
  return date >= periodRange.value.start && date <= periodRange.value.end;
};

const periodTransactions = computed(() => {
  return transactions.value.filter(isCurrentPeriodTransaction);
});

const periodIncome = computed(() => {
  return periodTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
});

const periodExpense = computed(() => {
  return periodTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
});

const netProfit = computed(() => {
  return periodIncome.value - periodExpense.value;
});

const expenseTransactions = computed(() => {
  return periodTransactions.value
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const emotionSatisfiedCount = computed(() => {
  return expenseTransactions.value.filter((tx) => tx.emotion === 'happy').length;
});

const emotionRegretCount = computed(() => {
  return expenseTransactions.value.filter((tx) => tx.emotion === 'regret').length;
});

const emotionSatisfiedRate = computed(() => {
  const total = expenseTransactions.value.length;
  if (!total) return 0;
  return Math.round((emotionSatisfiedCount.value / total) * 100);
});

const dealLists = computed(() => {
  return periodTransactions.value
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((tx) => ({
      id: tx.id,
      title: categoryMetaMap.value[tx.category]?.label || tx.category,
      location: tx.location,
      amount: tx.amount,
      icon: categoryMetaMap.value[tx.category]?.icon || Ellipsis,
    }));
});

const localSpendingList = computed(() => {
  const grouped = {};

  expenseTransactions.value.forEach((tx) => {
    if (!grouped[tx.location]) {
      grouped[tx.location] = {
        region: tx.location,
        count: 0,
        amount: 0,
      };
    }

    grouped[tx.location].count += 1;
    grouped[tx.location].amount += tx.amount;
  });

  return Object.values(grouped)
    .sort((a, b) => b.amount - a.amount)
    .map((item, index) => ({
      rank: index + 1,
      region: item.region,
      period: `${item.count}건`,
      amount: item.amount,
    }));
});

const categorySpendingList = computed(() => {
  const grouped = {};

  expenseTransactions.value.forEach((tx) => {
    if (!grouped[tx.category]) {
      grouped[tx.category] = 0;
    }
    grouped[tx.category] += tx.amount;
  });

  return categoryList.value
    .filter((category) => grouped[category.value] > 0)
    .map((category) => ({
      id: category.value,
      category: category.label,
      amount: grouped[category.value],
      icon: category.icon,
    }));
});

const setPeriodMode = (mode) => {
  periodMode.value = mode;
};

const goPrevPeriod = () => {
  const next = cloneDate(baseDate.value);

  if (periodMode.value === 'month') {
    next.setMonth(next.getMonth() - 1);
  } else {
    next.setDate(next.getDate() - 7);
  }

  baseDate.value = next;
};

const goNextPeriod = () => {
  const next = cloneDate(baseDate.value);

  if (periodMode.value === 'month') {
    next.setMonth(next.getMonth() + 1);
  } else {
    next.setDate(next.getDate() + 7);
  }

  baseDate.value = next;
};


const exportPdf = () => {
  window.print();
};

onMounted(async () => {
  if (!userStore.user?.id) return;

  /*
    userApi에 있는 거래조회로 사용
    로그인 유저의 거래 목록 조회
  */
  const userTransactions = await getUserTransactions(userStore.user.id);
  transactions.value = userTransactions;
});
</script>

<style scoped>
.main {
  width: 100%;
  min-height: 100vh;
  padding: 20px 28px 24px;
  background-color: #fff8dd;
  box-sizing: border-box;
}

.header {
  height: 72px;
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.header h3 {
  margin: 0;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.period-toggle {
  display: flex;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  background: white;
}

.toggle-btn {
  flex: 1;
  height: 42px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.toggle-btn.active {
  background: #ffe99a;
}

.toggle-btn:not(:last-child) {
  border-right: 1px solid #d9d9d9;
}

.box-label {
  width: 100%;
  text-align: start;
  font-size: 20px;
  white-space: nowrap;
  padding-left: 10px;
  padding-top: 10px;
}

.box-label-header {
  width: 100%;
  text-align: center;
  font-size: 20px;
  white-space: nowrap;
}

.box-content {
  width: 100%;
  font-size: 20px;
  white-space: nowrap;
  padding-left: 10px;
}

.box-label-account {
  width: 100%;
  text-align: center;
  font-size: 20px;
  white-space: nowrap;
}

.box-custom {
  height: 100%;
  min-height: 0;
}

.box-custom:deep(> div) {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.content {
  height: calc(100vh - 72px - 40px - 44px);
  display: grid;
  grid-template-columns: 3fr 1.35fr;
  gap: 20px;
}

.month-arrow {
  border: none;
  background: transparent;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  color: #444;
  padding: 4px 8px;
}

.month-arrow:hover {
  opacity: 0.7;
}

#common-stats {
  height: 100%;
  display: grid;
  grid-template-rows: 84px minmax(0, 1.5fr) minmax(0, 2fr);
  gap: 18px;
  min-width: 0;
  min-height: 0;
}

#account-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  min-width: 0;
}

#emotion-info,
#trade-history-info,
#theme-stats,
#location-spend,
#category-spend {
  min-width: 0;
}

.emotion-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#emotion-stats {
  padding: 10px 0px;
}

#emotion-ratio {
  padding: 10px 0px;
  font-size: small;
}

#theme-stats {
  height: 100%;
  display: grid;
  grid-template-rows: minmax(0, 1.15fr) minmax(0, 0.9fr);
  gap: 18px;
  min-height: 0;
}

#emotion-info,
#trade-history-info,
#location-spend,
#category-spend {
  width: 100%;
  min-width: 0;
  min-height: 0;
}

#emotion-info :deep(.box-label),
#trade-history-info :deep(.box-label),
#location-spend :deep(.box-label),
#category-spend :deep(.box-label) {
  text-align: left;
}

/* Box가 부모 높이를 채우도록 */
#account-info > *,
#emotion-info > *,
#trade-history-info > *,
#location-spend > *,
#category-spend > * {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.scroll-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-bottom: 30px;
}

.deal-list,
.local-list,
.category-list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  padding-bottom: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.pdf-button {
  cursor: pointer;
}

/* 반응형 */

@media print {
  .main {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    height: auto;
    min-height: auto;
  }

  #download-pdf {
    display: none;
  }

  .content,
  #common-stats,
  #theme-stats {
    height: auto !important;
  }

  #common-stats,
  #theme-stats {
    grid-template-rows: auto auto auto !important;
    gap: 18px !important;
  }

  #trade-history-info,
  #location-spend,
  #category-spend,
  #emotion-info {
    height: auto !important;
  }

  #trade-history-info > *,
  #location-spend > *,
  #category-spend > *,
  #emotion-info > * {
    height: auto !important;
  }

  #trade-history-info .box-custom,
  #location-spend .box-custom,
  #category-spend .box-custom {
    height: auto !important;
    max-height: none !important;
  }

  .scroll-box {
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
  }

  .deal-list,
  .local-list,
  .category-list {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
  }
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
    height: auto;
  }

  .header {
    grid-template-columns: 120px 1fr 120px;
    height: 72px;
    gap: 10px;
  }

  .header h3 {
    font-size: 18px;
  }

  #common-stats,
  #theme-stats {
    height: auto;
  }

  #common-stats {
    grid-template-rows: auto auto auto;
  }

  #theme-stats {
    gap: 50px;
    grid-template-rows: 260px 220px;
  }

  #emotion-info {
    height: auto;
  }

  #emotion-info > * {
    height: auto;
  }

  .emotion-content {
    height: auto;
    gap: 6px;
  }

  .box-label,
  .box-content {
    font-size: 16px;
  }

  #emotion-stats,
  #emotion-ratio {
    padding: 6px 0;
  }
  #account-info {
    grid-template-columns: 1fr;
  }

  #trade-history-info .box-custom {
    height: auto;
    max-height: 240px;
  }
  #location-spend .box-custom {
    height: auto;
    max-height: 290px;
  }
  #category-spend .box-custom {
    height: auto;
    max-height: 230px;
  }

  .scroll-box {
    height: auto;
    min-height: 0;
    padding-bottom: 12px;
  }

  .deal-list {
    max-height: 170px;
    overflow-y: auto;
    gap: 8px;
    padding-bottom: 8px;
  }
  .local-list {
    max-height: 220px;
    overflow-y: auto;
    gap: 8px;
    padding-bottom: 8px;
  }
  .category-list {
    max-height: 160px;
    overflow-y: auto;
    gap: 8px;
    padding-bottom: 8px;
  }

  .box-label,
  .box-content,
  .box-label-account,
  .box-label-header {
    font-size: 16px;
  }
}
</style>
