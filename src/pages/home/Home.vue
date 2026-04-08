<template>
  <div class="layout">
    <!-- 좌측 네비게이션 -->
    <Nav/>

    <!-- 메인 컨텐츠 영역 -->
    <main class="content">
      <!-- 전체 대시보드 그리드 -->
      <section class="home-dashboard">

        <!-- 만족지수 (왼쪽 크게) -->
        <SatisfactionCard
          class="satisfaction"
          :score="monthlySatisfactionScore"
        />

        <!-- 나의 칭호 (오른쪽) -->
        <PreferenceCard
          class="preference"
          :titles="selectedTitles"
          empty-text="아직 칭호가 없어요."
        />

        <!-- 수입/지출/순수익 (3개 카드 묶음) -->
        <div class="stats-group">
          <SummaryStatCard
              title="이번달 수입"
              :amount="`${monthlyIncome.toLocaleString()}원`"
              sign="+"
              color="#4CE158"
          />

          <SummaryStatCard
              title="이번달 지출"
              :amount="`${monthlyExpense.toLocaleString()}원`"
              sign="-"
              color="#FF945F"
          />

          <SummaryStatCard
              title="순수익"
              :amount="`${Math.abs(netProfit).toLocaleString()}원`"
              :sign="netProfit < 0 ? '-' : '+'"
              color="#FFD400"
          />
        </div>

        <!-- 오른쪽: 거래 추가 버튼 -->
        <button class="add-transaction-card" @click="goToAddTransaction">
          새로운 거래 추가
        </button>

        <!-- 3행: 최근 거래 -->
        <RecentTransactionCard class="recent" :list="recentTransactions" />

        <!-- 이번달 요약 -->
        <MonthlySummaryCard
            :total-count="monthlySummary.totalCount"
            :satisfied-count="monthlySummary.happyCount"
            :top-category="monthlySummary.topCategory.label"
            :top-category-count="monthlySummary.topCategory.count"
        />

      </section>
    </main>
  </div>
</template>

<script setup>
/*
* import
* */
// 공통 네비게이션과 페이지 이동에 필요한 라우터
import Nav from "@/components/Nav.vue";
import {useRouter} from "vue-router";

// 홈 대시보드에 배치되는 카드 컴포넌트
import SatisfactionCard from "@/pages/home/components/SatisfactionCard.vue";
import SummaryStatCard from "@/pages/home/components/SummaryStatCard.vue";
import PreferenceCard from "@/pages/home/components/PreferenceCard.vue";
import RecentTransactionCard from "@/pages/home/components/RecentTransactionCard.vue";
import MonthlySummaryCard from "@/pages/home/components/MonthlySummaryCard.vue";

// 반응형 상태, 계산 속성, 마운트 시점 데이터를 가져오기 위한 Vue API
import { ref, computed, onMounted } from 'vue';
// 로그인 유저 정보를 확인하기 위해 user store
import { useUserStore } from '@/stores/user';
// 홈 진입 시 현재 로그인한 유저의 거래 목록을 조회
import { getUserTransactions } from '@/service/user/userApi.js';
// 홈 화면에서 사용하는 계산 로직
import {
  getMonthlyExpense,
  getMonthlyIncome,
  getMonthlySatisfactionScore,
  getMonthlySummary,
  getNetProfit,
  getRecentTransactions
} from "@/pages/home/home.js";

/*
* 변수
* */
const router = useRouter();
const userStore = useUserStore();
// 홈 화면에서 사용하는 현재 유저의 거래 목록
const transactions = ref([]);
// 유저 프로필에서 가져온 획득 칭호 배열을 저장
const selectedTitles = ref([]);

// 거래 등록 화면으로 이동
const goToAddTransaction = () => {
  router.push("/register");
};

onMounted(async () => {
  /*
    TODO::
    로그인한 유저 정보가 없으면 어떤 거래를 조회해야 하는지 알 수 없으므로
    홈 최초 진입 시 API 호출을 하지 않고 바로 종료
  */
  if (!userStore.user?.id) return;

  /*
    userApi에 있는 거래조회로 사용
    로그인 유저의 거래 목록 조회
    이후 대시보드 카드 계산은 전부 transactions.value로
  */
  const userTransactions = await getUserTransactions(userStore.user.id);

  /*
  로그인 시 store에 저장된 user 객체에서 획득 칭호 배열을 바로 사용
  ex) "selectedTitle": ["Home Potato", "Tipsy Champ"]
  */
  selectedTitles.value = Array.isArray(userStore.user?.selectedTitle)
    ? userStore.user.selectedTitle
    : [];
  transactions.value = userTransactions;
});

 // 최근 거래 카드는 날짜 최신순으로 정렬된 일부 거래만 사용. 지금은 최대 5개로 지정
const recentTransactions = computed(() => getRecentTransactions(transactions.value));
// 오늘 날짜 기준 같은 달의 income(추후 수정될 수 있음) 거래만 모아 이번달 수입계산
const monthlyIncome = computed(() => getMonthlyIncome(transactions.value));
// 오늘 날짜 기준 같은 달의 expense 거래만 모아 이번달 지출계산
const monthlyExpense = computed(() => getMonthlyExpense(transactions.value));
// 이번달 전체 거래 중 happy 비율을 퍼센트로 계산한 만족 지수
const monthlySatisfactionScore = computed(() =>
  getMonthlySatisfactionScore(transactions.value)
);
// 순수익은 수입 합계에서 지출 합계를 뺀 값
const netProfit = computed(() => getNetProfit(monthlyIncome.value, monthlyExpense.value));
// 거래 목록이 바뀔 때마다 요약 카드에 필요한 총 거래 수, happy 건수, 최다 카테고리 정보
const monthlySummary = computed(() => getMonthlySummary(transactions.value));
</script>


<style scoped>
/* =========================
   기본 레이아웃 설정
========================= */

/* 메인 영역 */
.content {
  min-height: 100vh;
  background: #f6efcf; /* 전체 배경색 (첨부 이미지 베이지톤) */
  padding: 32px;
  box-sizing: border-box;
}

/* =========================
   대시보드 GRID
========================= */
/*
  2열 구조

  [ 큰 카드 ][ 작은 카드 ]
  [ 통계3개 ][ 버튼 ]
  [ 최근거래 ][ 요약 ]
*/
.home-dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 왼쪽이 더 큼 */
  gap: 24px;
  max-width: 1200px;
}


/* =========================
   수입/지출/순수익 묶음
========================= */
/*
  내부 카드 3개를 가로 정렬
*/
.stats-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}


/* =========================
   거래 추가 버튼 카드
========================= */
.add-transaction-card {
  width: 100%;
  min-height: 160px;
  border: none;
  border-radius: 36px;
  background: #FFD400;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;
}

/* =========================
   반응형 처리
========================= */

/* PC */
@media (min-width: 1025px) {
  .content {
    padding-left: 30%; /* 네비바 공간 확보 */
  }
}

/* 태블릿 */
@media (min-width: 769px) and (max-width: 1024px) {
  .content {
    padding-top: 15%;
  }

  /* 1열로 변경 */
  .home-dashboard {
    grid-template-columns: 1fr;
  }
}

/* 모바일 */
@media (max-width: 768px) {
  .content {
    padding-top: 5%;
    padding-left: 16px;
    padding-right: 16px;
  }

  /* 전부 세로 스택 */
  .home-dashboard {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* 통계 카드도 세로 */
  .stats-group {
    grid-template-columns: 1fr;
  }
}

</style>
