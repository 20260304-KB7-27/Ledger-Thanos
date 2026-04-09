<template>
  <div class="map-wrapper">
    <div v-if="loadError" class="map-message error-msg">
      지도를 불러오지 못했습니다.<br />API 키를 확인하세요.
    </div>
    <div v-else-if="!isLoaded" class="map-message loading-msg">
      지도 불러오는 중...
    </div>
    <div ref="mapContainer" class="naver-map"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const SEOUL_GU_COORDS = {
  강남구: { lat: 37.5172, lng: 127.0473 },
  강동구: { lat: 37.5301, lng: 127.1238 },
  강북구: { lat: 37.6396, lng: 127.0257 },
  강서구: { lat: 37.5509, lng: 126.8495 },
  관악구: { lat: 37.4784, lng: 126.9516 },
  광진구: { lat: 37.5385, lng: 127.0823 },
  구로구: { lat: 37.4955, lng: 126.8877 },
  금천구: { lat: 37.4569, lng: 126.8954 },
  노원구: { lat: 37.6542, lng: 127.0568 },
  도봉구: { lat: 37.6688, lng: 127.0471 },
  동대문구: { lat: 37.5744, lng: 127.0398 },
  동작구: { lat: 37.5124, lng: 126.9393 },
  마포구: { lat: 37.5663, lng: 126.9014 },
  서대문구: { lat: 37.5791, lng: 126.9368 },
  서초구: { lat: 37.4837, lng: 127.0324 },
  성동구: { lat: 37.5633, lng: 127.0369 },
  성북구: { lat: 37.5894, lng: 127.0167 },
  송파구: { lat: 37.5145, lng: 127.1059 },
  양천구: { lat: 37.527, lng: 126.8561 },
  영등포구: { lat: 37.5263, lng: 126.8964 },
  용산구: { lat: 37.5324, lng: 126.9902 },
  은평구: { lat: 37.6026, lng: 126.9291 },
  종로구: { lat: 37.5735, lng: 126.979 },
  중구: { lat: 37.5641, lng: 126.9979 },
  중랑구: { lat: 37.6063, lng: 127.0928 },
};

const props = defineProps({
  guSummary: { type: Array, default: () => [] },
  selectedGu: { type: String, default: null },
});

const emit = defineEmits(['select-gu', 'map-ready']);

const mapContainer = ref(null);
const isLoaded = ref(false);
const loadError = ref(false);
let mapInstance = null;
const markers = {};

function buildMarkerContent(gu, isActive, count = 0) {
  const bg = isActive ? '#FF8C00' : '#FFE99A';
  const border = isActive ? '#cc6f00' : '#E5A900';
  const textColor = isActive ? '#fff' : '#333';
  const badgeBg = isActive ? '#fff' : '#FF8C00';
  const badgeColor = isActive ? '#FF8C00' : '#fff';
  const shortName = gu.replace('구', '');
  return `<div style="position:relative;display:inline-block;cursor:pointer;">
    <div style="
      background:${bg};
      border:2px solid ${border};
      border-radius:50%;
      width:44px;height:44px;
      display:flex;align-items:center;justify-content:center;
      font-size:10px;font-weight:700;color:${textColor};
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
      white-space:nowrap;
    ">${shortName}</div>
    <div style="
      position:absolute;
      top:-6px;right:-6px;
      background:${badgeBg};
      color:${badgeColor};
      border:1.5px solid ${border};
      border-radius:50%;
      min-width:18px;height:18px;
      display:flex;align-items:center;justify-content:center;
      font-size:9px;font-weight:800;
      padding:0 3px;
      box-sizing:border-box;
      box-shadow:0 1px 3px rgba(0,0,0,0.2);
      line-height:1;
    ">${count}</div>
  </div>`;
}

function syncMarkers(summary) {
  if (!mapInstance) return;

  const currentGus = new Set(summary.map((s) => s.gu));

  // 현재 summary에 없는 마커 제거
  Object.keys(markers).forEach((gu) => {
    if (!currentGus.has(gu)) {
      markers[gu].setMap(null);
      delete markers[gu];
    }
  });

  // 마커 추가 또는 갱신
  summary.forEach(({ gu, count }) => {
    const coords = SEOUL_GU_COORDS[gu];
    if (!coords) return;

    const isActive = gu === props.selectedGu;
    const content = buildMarkerContent(gu, isActive, count);

    if (!markers[gu]) {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(coords.lat, coords.lng),
        map: mapInstance,
        title: gu,
        icon: {
          content,
          anchor: new window.naver.maps.Point(28, 28),
        },
      });
      window.naver.maps.Event.addListener(marker, 'click', () => {
        emit('select-gu', gu);
      });
      markers[gu] = marker;
    } else {
      markers[gu].setIcon({
        content,
        anchor: new window.naver.maps.Point(28, 28),
      });
    }
  });
}

function loadNaverScript() {
  if (window.naver?.maps) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  try {
    await loadNaverScript();
    mapInstance = new window.naver.maps.Map(mapContainer.value, {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 11,
      mapTypeId: window.naver.maps.MapTypeId.NORMAL,
    });
    isLoaded.value = true;
    emit('map-ready');
    syncMarkers(props.guSummary);
  } catch {
    loadError.value = true;
  }
});

onBeforeUnmount(() => {
  Object.values(markers).forEach((m) => m.setMap(null));
});

// guSummary 변경 시 마커 동기화
watch(
  () => props.guSummary,
  (newSummary) => {
    if (!isLoaded.value) return;
    syncMarkers(newSummary);
  },
  { deep: true }
);

// selectedGu 변경 시 마커 하이라이트 + 지도 이동
watch(
  () => props.selectedGu,
  (newGu, oldGu) => {
    if (!isLoaded.value) return;

    if (oldGu && markers[oldGu]) {
      const oldCount = props.guSummary.find((s) => s.gu === oldGu)?.count ?? 0;
      markers[oldGu].setIcon({
        content: buildMarkerContent(oldGu, false, oldCount),
        anchor: new window.naver.maps.Point(28, 28),
      });
    }
    if (newGu && markers[newGu]) {
      const newCount = props.guSummary.find((s) => s.gu === newGu)?.count ?? 0;
      markers[newGu].setIcon({
        content: buildMarkerContent(newGu, true, newCount),
        anchor: new window.naver.maps.Point(28, 28),
      });
      const coords = SEOUL_GU_COORDS[newGu];
      if (coords) {
        mapInstance.panTo(new window.naver.maps.LatLng(coords.lat, coords.lng));
      }
    }
  }
);
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

.naver-map {
  width: 100%;
  height: 100%;
}

.map-message {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
}

.loading-msg {
  background: #fffdf7;
  color: #888;
}

.error-msg {
  background: #fffdf7;
  color: #e53935;
}
</style>
