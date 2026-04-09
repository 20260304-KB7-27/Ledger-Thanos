<template>
  <div class="main">
    <div class="header">
      <Box width="custom" custom-width="100%">
        <div class="box-label-header">주간/월간</div>
      </Box>

      <h3>
        <button class="month-arrow" @click="goPrevMonth">&lt;</button>
        <span>{{ currentYear }}년 {{ currentMonth }}월</span>
        <button class="month-arrow" @click="goNextMonth">&gt;</button>
      </h3>

      <Box width="custom" custom-width="100%" id="download-pdf">
        <div class="box-label-header pdf-button" @click="exportPdf">
          PDF 내보내기
        </div>
      </Box>
    </div>
    <div class="content">
      <div id="common-stats">
        <div id="account-info">
          <Box width="custom" custom-width="100%" class="box-label-account">
            <div>이번달 수입</div>
            <div>{{ formatAmount(monthlyIncome) }}</div>
          </Box>

          <Box width="custom" custom-width="100%" class="box-label-account">
            <div>이번달 지출</div>
            <div>{{ formatAmount(monthlyExpense) }}</div>
          </Box>

          <Box width="custom" custom-width="100%" class="box-label-account">
            <div>순수익</div>
            <div>{{ formatAmount(netProfit) }}</div>
          </Box>
        </div>
        <div id="emotion-info">
          <Box width="custom" custom-width="100%">
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
          <Box width="custom" custom-width="100%" class="box-custom">
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
                  :icon-color="item.iconColor"
                />
              </div>
            </div>
          </Box>
        </div>
      </div>
      <div id="theme-stats">
        <div id="location-spend">
          <Box width="custom" custom-width="100%" class="box-custom">
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
          <Box width="custom" custom-width="100%" class="box-custom">
            <div class="scroll-box">
              <div class="box-label">카테고리별 지출</div>

              <div v-if="loading" class="status-text">불러오는 중...</div>
              <div v-else class="category-list">
                <CategorySpending
                  v-for="item in categorySpendingList"
                  :key="item.id"
                  :category="item.category"
                  :amount="item.amount"
                  :icon-color="item.iconColor"
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
import { getUserTransactions } from '@/service/user/userApi';

const userStore = useUserStore();
// 현재 유저 거래 목록
const transactions = ref([]);

// 화면 기준 월
const currentYear = ref(2026);
const currentMonth = ref(4);

const loading = ref(false);
const error = ref('');

const categoryLabelMap = {
  restaurant: '식당',
  salary: '급여',
  cafe: '카페',
  shopping: '쇼핑',
  transport: '교통',
  entertainment: '문화/여가',
};

const categoryColorMap = {
  restaurant: '#d9d9d9',
  salary: '#d9d9d9',
  cafe: '#d9d9d9',
  shopping: '#d9d9d9',
  transport: '#d9d9d9',
  entertainment: '#d9d9d9',
};

const formatAmount = (value) => `${Number(value || 0).toLocaleString()}원`;

const isCurrentMonthTransaction = (tx) => {
  const date = new Date(tx.date);
  return (
    date.getFullYear() === currentYear.value &&
    date.getMonth() + 1 === currentMonth.value
  );
};

const monthlyTransactions = computed(() => {
  return transactions.value.filter(isCurrentMonthTransaction);
});

const monthlyIncome = computed(() => {
  return monthlyTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
});

const monthlyExpense = computed(() => {
  return monthlyTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
});

const netProfit = computed(() => {
  return monthlyIncome.value - monthlyExpense.value;
});

const expenseTransactions = computed(() => {
  return monthlyTransactions.value
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const emotionSatisfiedCount = computed(() => {
  return expenseTransactions.value.filter((tx) => tx.emotion === 'happy')
    .length;
});

const emotionRegretCount = computed(() => {
  return expenseTransactions.value.filter((tx) => tx.emotion === 'regret')
    .length;
});

const emotionSatisfiedRate = computed(() => {
  const total = expenseTransactions.value.length;
  console.log(total);
  if (!total) return 0;
  return Math.round((emotionSatisfiedCount.value / total) * 100);
});

const dealLists = computed(() => {
  return monthlyTransactions.value
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((tx) => ({
      id: tx.id,
      title: categoryLabelMap[tx.category] || tx.category,
      location: tx.location,
      amount: tx.amount,
      iconColor: categoryColorMap[tx.category] || '#d9d9d9',
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
      grouped[tx.category] = {
        id: tx.category,
        category: categoryLabelMap[tx.category] || tx.category,
        amount: 0,
        iconColor: categoryColorMap[tx.category] || '#d9d9d9',
      };
    }

    grouped[tx.category].amount += tx.amount;
  });

  return Object.values(grouped).sort((a, b) => b.amount - a.amount);
});

const goPrevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const goNextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
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

  #download-pdf{
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
