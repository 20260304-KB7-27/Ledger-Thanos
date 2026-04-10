<template>
  <div class="map-page">
    <div class="map-grid">
      <!-- 지도 영역 (좌측 전체 높이) -->
      <div class="map-area">
        <NaverMapView
          :gu-summary="guSummary"
          :selected-gu="selectedGu"
          @select-gu="selectedGu = $event"
          @map-ready="isMapReady = true"
        />
        <!-- 상세 내역 오버레이 -->
        <div class="detail-overlay">
          <TransactionDetail
            :transactions="detailTransactions"
            :selected-gu="selectedGu"
          />
        </div>
      </div>

      <!-- 우측 패널 -->
      <div class="side-panel">
        <div class="summary-area">
          <RegionalSummary
            :summary="guSummary"
            :selected-gu="selectedGu"
            @select-gu="selectedGu = $event"
          />
        </div>
        <div class="stats-area">
          <RegionalStats :summary="guSummary" :transactions="mapTransactions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import NaverMapView from './components/NaverMapView.vue';
import RegionalSummary from './components/RegionalSummary.vue';
import TransactionDetail from './components/TransactionDetail.vue';
import RegionalStats from './components/RegionalStats.vue';

const { transactions } = storeToRefs(useUserStore());
const selectedGu = ref(null);
const isMapReady = ref(false);

const mapTransactions = computed(() =>
  transactions.value.filter((t) => t.location && t.type === 'expense')
);

const guSummary = computed(() => {
  const map = {};
  for (const t of mapTransactions.value) {
    if (!map[t.location])
      map[t.location] = { gu: t.location, total: 0, count: 0 };
    map[t.location].total += t.amount;
    map[t.location].count++;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
});

const detailTransactions = computed(() =>
  selectedGu.value
    ? mapTransactions.value.filter((t) => t.location === selectedGu.value)
    : []
);
</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background: #fffbf0;
}

.map-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 12px;
  height: 100%;
}

.map-area {
  position: relative;
  min-height: 500px;
}

.detail-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: calc(100% - 24px);
  max-width: 480px;
  z-index: 20;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* overflow: hidden; */
}

.summary-area {
  flex: 1;
  min-height: 0;
  /* overflow: hidden; */
}

.stats-area {
  flex-shrink: 0;
}

/* 태블릿 (769px ~ 1024px) */
@media (max-width: 1024px) {
  .map-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .map-area {
    height: 400px;
    min-height: unset;
  }

  .side-panel {
    overflow: visible;
  }
}

/* 모바일 (≤ 768px) */
@media (max-width: 768px) {
  .map-page {
    padding: 8px;
  }

  .map-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .map-area {
    height: 300px;
    min-height: unset;
  }
}
</style>
