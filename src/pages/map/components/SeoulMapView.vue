<template>
  <div class="seoul-map-wrapper">
    <div class="image-container" ref="containerRef">
      <img
        src="/seoulmap.png"
        class="seoul-map-img"
        alt="서울 지도"
        @load="onImageLoad"
        draggable="false"
      />
      <template v-if="imageReady">
        <div
          v-for="item in guSummary"
          :key="item.gu"
          class="gu-marker"
          :class="{ active: item.gu === selectedGu }"
          :style="getMarkerStyle(item.gu)"
          @click="emit('select-gu', item.gu)"
        >
          <span class="gu-name">{{ item.gu.replace('구', '') }}</span>
          <span class="gu-count">{{ item.count }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// seoulmap.png 이미지 상의 각 구 중심 위치 (%, %) — 직접 시각 매핑
const SEOUL_GU_IMAGE_POS = {
  강남구: { x: 68, y: 66 },
  강동구: { x: 97, y: 50 },
  강북구: { x: 69, y: 28 },
  강서구: { x: 15, y: 49 },
  관악구: { x: 36, y: 79 },
  광진구: { x: 85, y: 48 },
  구로구: { x: 18, y: 73 },
  금천구: { x: 27, y: 79 },
  노원구: { x: 90, y: 17 },
  도봉구: { x: 72, y: 20 },
  동대문구: { x: 75, y: 40 },
  동작구: { x: 37, y: 70 },
  마포구: { x: 34, y: 50 },
  서대문구: { x: 35, y: 43 },
  서초구: { x: 57, y: 70 },
  성동구: { x: 70, y: 47 },
  성북구: { x: 69, y: 34 },
  송파구: { x: 89, y: 60 },
  양천구: { x: 24, y: 63 },
  영등포구: { x: 34, y: 60 },
  용산구: { x: 50, y: 56 },
  은평구: { x: 39, y: 30 },
  종로구: { x: 51, y: 41 },
  중구: { x: 55, y: 49 },
  중랑구: { x: 92, y: 39 },
};

const props = defineProps({
  guSummary: { type: Array, default: () => [] },
  selectedGu: { type: String, default: null },
});

const emit = defineEmits(['select-gu', 'map-ready']);

const containerRef = ref(null);
const imageReady = ref(false);

function onImageLoad() {
  imageReady.value = true;
  emit('map-ready');
}

function getMarkerStyle(gu) {
  const pos = SEOUL_GU_IMAGE_POS[gu];
  if (!pos) return { display: 'none' };
  return {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
  };
}
</script>

<style scoped>
.seoul-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  background: #fff;
  border: 2px solid #000;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.seoul-map-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
}

.gu-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
}

.gu-name {
  background: #fff;
  color: #000;
  border: 1.5px solid #000;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 4px;
  white-space: nowrap;
  line-height: 1.2;
}

.gu-count {
  background: #000;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 4px;
  min-width: 16px;
  text-align: center;
  line-height: 1.4;
}

.gu-marker.active .gu-name {
  background: #000;
  color: #fff;
}

.gu-marker.active .gu-count {
  background: #fff;
  color: #000;
  border: 1.5px solid #000;
}

.gu-marker:hover .gu-name {
  text-decoration: underline;
}
</style>
