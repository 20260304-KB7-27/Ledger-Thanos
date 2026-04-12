<template>
  <div class="main">
    <EasterEggOverlay :visible="overlayVisible" />
    <div class="header">
      <Box width="custom" custom-width="100%" :shadow="false" margin-y="8px">
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
          <Box
            width="custom"
            custom-width="100%"
            class="box-label-account"
            :shadow="false"
          >
            <div>
              {{ periodMode === 'week' ? '이번주 수입' : '이번달 수입' }}
            </div>
            <div>{{ formatAmount(periodIncome) }}</div>
          </Box>

          <Box
            width="custom"
            custom-width="100%"
            class="box-label-account"
            :shadow="false"
          >
            <div>
              {{ periodMode === 'week' ? '이번주 지출' : '이번달 지출' }}
            </div>
            <div>{{ formatAmount(periodExpense) }}</div>
          </Box>

          <Box
            width="custom"
            custom-width="100%"
            class="box-label-account"
            :shadow="false"
          >
            <div>순수익</div>
            <div>{{ formatAmount(netProfit) }}</div>
          </Box>
        </div>
        <div id="emotion-info">
          <Box width="custom" custom-width="100%" :shadow="false">
            <div v-if="isHappy" class="emotion-happy-card">
              <div class="box-label emotion-title">감정 통계</div>

              <div class="emotion-happy-content">
                <div class="emotion-item">
                  <img
                    src="@/assets/icon/ico_sad_orange.svg"
                    alt="후회 아이콘"
                    class="emotion-icon"
                  />
                  <span class="emotion-count"
                    >{{ emotionSatisfiedCount }}회 만족</span
                  >
                </div>

                <div class="emotion-item">
                  <img
                    src="@/assets/icon/ico_happy_green.svg"
                    alt="만족 아이콘"
                    class="emotion-icon"
                  />
                  <span class="emotion-count"
                    >{{ emotionRegretCount }}회 후회</span
                  >
                </div>

                <div class="emotion-rate-group">
                  <span class="emotion-rate-value">{{
                    emotionSatisfiedRate
                  }}</span>
                  <span class="emotion-rate-percent">%</span>
                  <span class="emotion-rate-label">만족 소비 비율</span>
                </div>
              </div>
            </div>

            <div v-else class="emotion-content">
              <div class="box-label" style="cursor: default; user-select: none;" @click="onEmotionLabelClick">감정 통계</div>
              <div class="box-content">
                <div id="emotion-stats">
                  {{ emotionSatisfiedCount }}회 만족, {{ emotionRegretCount }}회
                  후회
                </div>
                <div ref="progressBarRef">
                  <ProgressBarChart
                    v-if="expenseTransactions.length > 0"
                    :key="`${periodMode}-${periodLabel}`"
                    :value="emotionRateDisplay"
                    :max-value="100"
                    bar-color="var(--accent-strong)"
                    background-color="var(--surface-primary)"
                    bar-radius="var(--radius-card)"
                    background-radius="var(--radius-card)"
                    :height="30"
                    :border-width="1"
                    border-color="var(--border-soft)"
                  />
                </div>

                <div id="emotion-ratio">
                  만족한 소비비율: {{ emotionRatioDisplay }}%
                </div>
              </div>
            </div>
          </Box>
        </div>
        <div id="trade-history-info">
          <Box
            width="custom"
            custom-width="100%"
            class="box-custom"
            :shadow="false"
          >
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
                  :date="item.date"
                  :emotion="item.emotion"
                />
              </div>
            </div>
          </Box>
        </div>
      </div>
      <div id="theme-stats">
        <div id="location-spend" :class="{ 'happy-chart-section': isHappy }">
          <Box
            width="custom"
            custom-width="100%"
            class="box-custom"
            :shadow="false"
          >
            <div class="scroll-box">
              <div class="box-label">지역별 소비</div>

              <div v-if="loading" class="status-text">불러오는 중...</div>
              <div v-else-if="isHappy" class="happy-chart-wrap">
                <BarChart :items="localSpendingList" />
              </div>
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

        <div id="category-spend" :class="{ 'happy-chart-section': isHappy }">
          <Box
            width="custom"
            custom-width="100%"
            class="box-custom"
            :shadow="false"
          >
            <div class="scroll-box">
              <div class="box-label">카테고리별 지출</div>

              <div v-if="loading" class="status-text">불러오는 중...</div>
              <div v-else-if="isHappy" class="happy-chart-wrap">
                <DoughnutChart :items="categorySpendingList" />
              </div>
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
import EasterEggOverlay from './components/EasterEggOverlay.vue';
import { useUserStore } from '@/stores/user';
import { ref, onMounted, computed, watch } from 'vue';
import { useEasterEggSequence } from '@/composables/useEasterEggSequence';
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
import BarChart from './components/BarChart.vue';
import DoughnutChart from './components/DoughnutChart.vue';

const userStore = useUserStore();

// 현재 로그인한 유저의 거래 목록
const transactions = ref([]);

// 조회 기준: 월별 / 주별
const periodMode = ref('month');

// 통계 기준 날짜
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

// 테마 '만족' 상태인지 확인
const isHappy = computed(() => userStore.dominantEmotion === 'happy');

// category value로 label / icon / 정렬순서를 바로 찾기 위한 매핑 객체
// 예: categoryMetaMap.value['shopping'] => { label: '쇼핑', icon: ..., order: 1 }
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

// 금액 포맷: 12345 -> "12,345원"
const formatAmount = (value) => `${Number(value || 0).toLocaleString()}원`;

// Date 객체 복사
const cloneDate = (date) => new Date(date);

// 해당 날짜가 속한 월의 시작일/종료일 계산
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

// 주 시작일: 월요일 기준
const startOfWeek = (date) => {
  const d = cloneDate(date);
  const day = d.getDay(); // 0:일 ~ 6:토
  const diff = day === 0 ? -6 : 1 - day; // 일요일이면 이전 월요일로, 그 외는 이번 주 월요일로
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 주 종료일: 일요일 23:59:59.999
const endOfWeek = (date) => {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

// 현재 날짜가 해당 월의 몇 번째 주차인지 계산
const getWeekOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekStart = startOfWeek(firstDay);
  const currentWeekStart = startOfWeek(date);
  const diffDays = Math.floor(
    (currentWeekStart - firstWeekStart) / (1000 * 60 * 60 * 24)
  );
  return Math.floor(diffDays / 7) + 1;
};

// 화면 표시에 필요한 현재 연/월/주차
const currentYear = computed(() => baseDate.value.getFullYear());
const currentMonth = computed(() => baseDate.value.getMonth() + 1);
const currentWeek = computed(() => getWeekOfMonth(baseDate.value));

// 상단 제목용 문자열
// month 모드면 "2026년 4월"
// week 모드면 "2026년 4월 1주차"
const periodLabel = computed(() => {
  if (periodMode.value === 'month') {
    return `${currentYear.value}년 ${currentMonth.value}월`;
  }
  return `${currentYear.value}년 ${currentMonth.value}월 ${currentWeek.value}주차`;
});

// 현재 선택된 조회 범위(start, end) 계산
// month 모드: 해당 월 전체
// week 모드: 해당 주 전체
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

// 거래 1건이 현재 조회 범위 안에 포함되는지 판별
const isCurrentPeriodTransaction = (tx) => {
  const date = new Date(tx.date);
  return date >= periodRange.value.start && date <= periodRange.value.end;
};

// 현재 기간에 해당하는 거래만 필터링
const periodTransactions = computed(() => {
  return transactions.value.filter(isCurrentPeriodTransaction);
});

// 현재 기간 수입 합계
const periodIncome = computed(() => {
  return periodTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
});

// 현재 기간 지출 합계
const periodExpense = computed(() => {
  return periodTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
});

// 순이익 = 수입 - 지출
const netProfit = computed(() => {
  return periodIncome.value - periodExpense.value;
});

// 지출 내역만 따로 모으고, 최신순으로 정렬
const expenseTransactions = computed(() => {
  return periodTransactions.value
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 소비 감정 통계
// happy: 만족
// regret: 후회
const emotionSatisfiedCount = computed(() => {
  return expenseTransactions.value.filter((tx) => tx.emotion === 'happy')
    .length;
});

const emotionRegretCount = computed(() => {
  return expenseTransactions.value.filter((tx) => tx.emotion === 'regret')
    .length;
});

// 만족 소비 비율(%)
const emotionSatisfiedRate = computed(() => {
  const total = expenseTransactions.value.length;
  if (!total) return 0;
  return Math.round((emotionSatisfiedCount.value / total) * 100);
});

// 이스터에그: ProgressBar에 바인딩되는 display용 값 (시퀀스 중 override)
const emotionRateDisplay = ref(emotionSatisfiedRate.value);
// 이스터에그: 비율 텍스트에 바인딩되는 display용 값 (100000%까지 상승)
const emotionRatioDisplay = ref(emotionSatisfiedRate.value);
// emotionSatisfiedRate가 바뀌면 (기간 변경 등) display도 동기화
watch(emotionSatisfiedRate, (v) => {
  if (!isPlaying.value) {
    emotionRateDisplay.value = v;
    emotionRatioDisplay.value = v;
  }
});

// 이스터에그 오버레이 표시 여부
const overlayVisible = ref(false);

// 이스터에그 트리거: 감정 통계 레이블 5회 클릭
const labelClickCount = ref(0);
function onEmotionLabelClick() {
  labelClickCount.value += 1;
  if (labelClickCount.value >= 5) {
    labelClickCount.value = 0;
    triggerSequence(
      () => {
        overlayVisible.value = true;
      },
      () => {
        overlayVisible.value = false;
      }
    );
  }
}

const progressBarRef = ref(null);

const { isPlaying, triggerSequence } = useEasterEggSequence({
  emotionRateDisplay,
  emotionRatioDisplay,
  emotionSatisfiedRate,
  progressBarRef,
});

// 거래 목록 UI용 데이터 변환
// 카테고리명을 title로, 아이콘도 함께 붙여서 컴포넌트에 넘김
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
      date: tx.date,
      emotion: tx.emotion || '',
    }));
});

// 지역별 소비 집계
// 같은 location끼리 묶어서 건수와 총액 계산
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

// 카테고리별 소비 집계
// 지출 내역에서 category 기준으로 합산
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

// 조회 모드 변경 (월별/주별)
const setPeriodMode = (mode) => {
  periodMode.value = mode;
};

// 이전 기간으로 이동
// month 모드면 이전 달, week 모드면 이전 주
const goPrevPeriod = () => {
  const next = cloneDate(baseDate.value);

  if (periodMode.value === 'month') {
    next.setMonth(next.getMonth() - 1);
  } else {
    next.setDate(next.getDate() - 7);
  }

  baseDate.value = next;
};

// 다음 기간으로 이동
const goNextPeriod = () => {
  const next = cloneDate(baseDate.value);

  if (periodMode.value === 'month') {
    next.setMonth(next.getMonth() + 1);
  } else {
    next.setDate(next.getDate() + 7);
  }

  baseDate.value = next;
};

// 브라우저 인쇄 기능으로 PDF 저장
const exportPdf = () => {
  window.print();
};

// 컴포넌트가 마운트되면 로그인한 유저의 거래내역 조회
onMounted(async () => {
  // 로그인 유저 정보가 없으면 종료
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
  background-color: var(--page-bg-stats);
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
  font-size: 22px;
  font-weight: 600;
}

.period-toggle {
  display: flex;
  width: 100%;
  overflow: hidden;
  background: var(--surface-primary);
  padding: 0px;
}

.toggle-btn {
  flex: 1;
  height: 50px;
  border: none;
  border-radius: var(--radius-button);
  background: transparent;
  cursor: pointer;
  font-size: 22px;
  font-weight: 600;
  transition: var(--btn-transition);
}

.toggle-btn:hover {
  transform: var(--btn-hover-lift);
}

.toggle-btn.active {
  background: var(--surface-emphasis);
}

.box-label {
  width: 100%;
  text-align: start;
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
  padding-left: 10px;
  padding-top: 10px;
}

.box-label-header {
  width: 100%;
  text-align: center;
  font-size: 22px;
  white-space: nowrap;
}

.box-content {
  width: 100%;
  font-size: 20px;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
  padding-left: 10px;
}

.box-label-account {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
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
  color: var(--text-secondary);
  padding: 4px 8px;
  transition: var(--btn-transition);
}

.month-arrow:hover {
  opacity: 0.7;
}

#common-stats {
  height: 100%;
  display: grid;
  grid-template-rows: 100px auto minmax(0, 1fr);
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
}

#emotion-stats {
  padding: 10px 0px;
  white-space: normal;
}

#emotion-ratio {
  padding: 10px 0px;
  font-size: small;
  white-space: normal;
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
  font-weight: 600;
}

.emotion-happy-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 18px;
  box-sizing: border-box;
}

.emotion-title {
  padding-left: 0;
  padding-top: 0;
  margin-bottom: 10px;
}

.emotion-happy-content {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 20px;
  width: 100%;
  min-height: 96px;
}

.emotion-item,
.emotion-rate-group {
  min-width: 0;
  justify-self: center;
}

.emotion-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.emotion-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
}

.emotion-count {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.emotion-rate-value {
  font-size: 56px;
  line-height: 1;
  font-weight: 800;
  color: #ffd400;
}

.emotion-rate-percent {
  font-size: 28px;
  font-weight: 800;
  color: #ffd400;
}

.emotion-rate-label {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-left: 4px;
}

#category-spend .happy-chart-wrap,
#location-spend .happy-chart-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

#category-spend .happy-chart-wrap > *,
#location-spend .happy-chart-wrap > * {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.emotion-rate-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
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

  .emotion-happy-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    column-gap: 16px;
    width: 100%;
    min-height: auto;
  }

  .emotion-item,
  .emotion-rate-group {
    min-width: 0;
    justify-self: center;
  }

  .emotion-item {
    gap: 10px;
  }

  .emotion-icon {
    width: 52px;
    height: 52px;
  }

  .emotion-count {
    font-size: 18px;
  }

  .emotion-rate-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    white-space: nowrap;
  }

  .emotion-rate-value {
    font-size: 42px;
  }

  .emotion-rate-percent {
    font-size: 22px;
  }

  .emotion-rate-label {
    font-size: 18px;
    margin-left: 2px;
  }
}

@media (max-width: 1366px) {
  .emotion-happy-card {
    padding: 10px 14px;
  }

  .emotion-title {
    margin-bottom: 6px;
  }

  .emotion-happy-content {
    gap: 12px;
    min-height: 78px;
  }

  .emotion-item {
    gap: 10px;
  }

  .emotion-icon {
    width: 48px;
    height: 48px;
  }

  .emotion-count {
    font-size: 18px;
  }

  .emotion-rate-group {
    gap: 4px;
  }

  .emotion-rate-value {
    font-size: 40px;
  }

  .emotion-rate-percent {
    font-size: 22px;
  }

  .emotion-rate-label {
    font-size: 17px;
    margin-left: 2px;
  }
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
    height: auto;
  }

  .toggle-btn {
    border-radius: 20px;
    font-size: 16px;
  }

  .header {
    grid-template-columns: 130px 1fr 130px;
    height: 72px;
    gap: 10px;
  }

  .header h3 {
    font-size: 16px;
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

  #theme-stats {
    gap: 24px;
    grid-template-rows: auto auto;
  }

  #location-spend.happy-chart-section .box-custom,
  #category-spend.happy-chart-section .box-custom {
    height: auto;
    max-height: none;
  }

  #location-spend.happy-chart-section .scroll-box,
  #category-spend.happy-chart-section .scroll-box {
    height: auto;
    min-height: auto;
    overflow: visible;
    padding-bottom: 12px;
  }

  #location-spend.happy-chart-section .happy-chart-wrap,
  #category-spend.happy-chart-section .happy-chart-wrap {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  #location-spend.happy-chart-section,
  #category-spend.happy-chart-section {
    min-height: auto;
    height: auto;
  }
  .emotion-happy-card {
    padding: 12px 14px;
  }
}

@media (max-width: 640px) {
  .emotion-happy-card {
    padding: 12px 14px;
  }

  .emotion-happy-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    min-height: auto;
  }

  .emotion-item {
    gap: 10px;
    justify-self: auto;
  }

  .emotion-icon {
    width: 52px;
    height: 52px;
  }

  .emotion-count {
    font-size: 20px;
  }

  .emotion-rate-group {
    justify-self: auto;
    margin-left: 0;
    flex-wrap: wrap;
    gap: 4px;
  }

  .emotion-rate-value {
    font-size: 42px;
  }

  .emotion-rate-percent {
    font-size: 24px;
  }

  .emotion-rate-label {
    font-size: 18px;
  }
}
</style>
