<template>
  <div class="layout">
    <!-- 좌측 네비게이션 -->
    <Nav />

    <!-- 메인 컨텐츠 영역 -->
    <main class="content">
      <!-- 전체 대시보드 그리드 -->
      <section class="home-dashboard">

        <!-- 1행: 만족지수 (왼쪽 크게) -->
        <SatisfactionCard class="satisfaction"/>

        <!-- 1행: 나의 칭호 (오른쪽) -->
        <PreferenceCard class="preference" />

        <!-- 2행: 수입/지출/순수익 (3개 카드 묶음) -->
        <div class="stats-group">
          <SummaryStatCard
              title="이번달 수입"
              amount="1,200,000원"
              color="#4CE158"
              type="income"
          />

          <SummaryStatCard
              title="이번달 지출"
              amount="850,000원"
              color="#FF945F"
              type="expense"
          />

          <SummaryStatCard
              title="순수익"
              amount="350,000원"
              color="#FFD400"
              type="income"
          />
        </div>

        <!-- 2행 오른쪽: 거래 추가 버튼 -->
        <button class="add-transaction-card" @click="goToAddTransaction">
          새로운 거래 추가
        </button>

        <!-- 3행: 최근 거래 -->
        <RecentTransactionCard class="recent" :list="transactionList" />

        <!-- 3행: 이번달 요약 -->
        <MonthlySummaryCard :total-count="12" :satisfied-count="8" />

      </section>
    </main>
  </div>
</template>

<script setup>
// 공통 네비
import Nav from "@/components/Nav.vue";
import { useRouter } from "vue-router";
const router = useRouter();

// 홈 전용 컴포넌트들
import SatisfactionCard from "@/pages/home/components/SatisfactionCard.vue";
import SummaryStatCard from "@/pages/home/components/SummaryStatCard.vue";
import PreferenceCard from "@/pages/home/components/PreferenceCard.vue";
import RecentTransactionCard from "@/pages/home/components/RecentTransactionCard.vue";
import MonthlySummaryCard from "@/pages/home/components/MonthlySummaryCard.vue";

/* 거래 추가 페이지 이동 */
const goToAddTransaction = () => {
  router.push("/register");
};

/* test용으로 json-server에서 가져올 예정 */
const transactionList = [    {
  "id": "1",
  "user_id": "1",
  "type": "expense",
  "amount": 45000,
  "category": "restaurant",
  "memo": "친구들과 점심",
  "emotion": "happy",
  "location": "강남구",
  "date": "2026-04-07"
}]
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