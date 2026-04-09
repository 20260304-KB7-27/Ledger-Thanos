<template>
  <div class="main">
    <div class="header">
      <Box width="custom" custom-width="100%">
        <div class="box-label-header">주간/월간</div>
      </Box>
      <h3><span><</span> 2024년 8월 <span>></span></h3>
      <Box width="custom" custom-width="100%">
        <div class="box-label-header">PDF 내보내기</div>
      </Box>
    </div>
    <div class="content">
      <div id="common-stats">
        <div id="account-info">
          <Box width="custom" custom-width="100%" class="box-label-account"
            ><div>이번달 수입</div>
            <div>00원</div></Box
          >
          <Box width="custom" custom-width="100%" class="box-label-account"
            ><div>이번달 지출</div>
            <div>00원</div></Box
          >
          <Box width="custom" custom-width="100%" class="box-label-account"
            ><div>순수익</div>
            <div>00원</div></Box
          >
        </div>
        <div id="emotion-info">
          <Box width="custom" custom-width="100%">
            <div class="emotion-content">
              <div class="box-label">감정 통계</div>
              <div class="box-content">
                <div id="emotion-stats">15회 만족, 5회 후회</div>
                <ProgressBarChart
                  :value="75"
                  :max-value="100"
                  bar-color="#FFE99A"
                  background-color="white"
                  :height="30"
                  :border-width="1"
                  border-color="#d9d9d9"
                />
                <div id="emotion-ratio">만족한 소비비율: 71%</div>
              </div>
            </div>
          </Box>
        </div>
        <div id="trade-history-info">
          <Box width="custom" custom-width="100%" class="box-custom">
            <div class="scroll-box">
              <div class="box-label">거래 내역</div>
              <div class="deal-list">
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
              <div class="local-list">
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
              <div class="category-list">
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
    <div></div>
  </div>
</template>

<script setup>
import Box from '@/components/Box.vue';
import ProgressBarChart from '@/components/ProgressBarChart.vue';
import Deal from './components/Deal.vue';
import LocalSpending from './components/LocalSpending.vue';
import CategorySpending from './components/CategorySpending.vue';
import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';
import { getUserTransactions } from '@/service/user/userApi';

const userStore = useUserStore();
// 현재 유저 거래 목록
const transactions = ref([]);

onMounted(async () => {

  if (!userStore.user?.id) return;

  /*
    userApi에 있는 거래조회로 사용
    로그인 유저의 거래 목록 조회
  */
  const userTransactions = await getUserTransactions(userStore.user.id);
  transactions.value = userTransactions;
  console.log(transactions);
});


</script>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
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

/* 반응형 */
@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
    height: auto;
  }

  #common-stats,
  #theme-stats {
    height: auto;
  }

  #theme-stats {
    grid-template-rows: 260px 220px;
  }
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: 100px 1fr 100px;
    height: 72px;
    gap: 10px;
  }

  .header h3 {
    font-size: 16px;
  }

  #account-info {
    grid-template-columns: 1fr;
  }
}
</style>
