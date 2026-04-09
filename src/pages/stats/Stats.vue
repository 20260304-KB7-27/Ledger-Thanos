<template>
  <div class="main">
    <div class="header">
      <Box width="custom" custom-width="100%">
        <div class="box-label">주간/월간</div>
      </Box>
      <h3><span><</span> 2024년 8월 <span>></span></h3>
      <Box width="custom" custom-width="100%">
        <div class="box-label">PDF 내보내기</div>
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
                <div>15회 만족, 5회 후회</div>
                <ProgressBarChart></ProgressBarChart>
              </div>
            </div>
          </Box>
        </div>
        <div id="trade-history-info">
          <Box width="custom" custom-width="100%"
            ><div class="box-label">거래 내역</div>
            <div v-for="item in dealLists">
              <Deal></Deal>
            </div>
            </Box
          >
        </div>
      </div>
      <div id="theme-stats">
        <div id="location-spend">
          <Box width="custom" custom-width="100%"
            ><div class="box-label">지역별 소비</div>
            <div v-for="item in localSpendingList">
              <LocalSpending></LocalSpending>
            </div>
            </Box
          >
        </div>

        <div id="category-spend">
          <Box width="custom" custom-width="100%"
            ><div class="box-label">카테고리별 지출</div>
            <div v-for="item in categorySpendingList">
              <CategorySpending></CategorySpending>
            </div>
            </Box
          >
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

.box-content {
  width: 100%;
  font-size: 20px;
  white-space: nowrap;
}

.box-label-account {
  width: 100%;
  text-align: center;
  font-size: 20px;
  white-space: nowrap;
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
  grid-template-rows: 84px 1.5fr 2fr;
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
  gap: 25px;
}

#theme-stats {
  height: 100%;
  display: grid;
  grid-template-rows: 1.15fr 0.9fr;
  gap: 18px;
}

#emotion-info,
#trade-history-info,
#location-spend,
#category-spend {
  width: 100%;
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
