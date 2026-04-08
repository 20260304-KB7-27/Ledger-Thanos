<template>
  <div class="common-box" :class="[widthClass, shadowClass]" :style="boxStyles">
    <div class="box-content" :style="{ margin: `${marginY} 0` }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 가로 길이 규격 (small / middle / big / custom)
  width: {
    type: String,
    default: 'middle',
    validator: (v) => ['small', 'middle', 'big', 'custom'].includes(v),
  },
  customWidth: { type: String, default: '100%' }, // width가 'custom'일 때 적용될 구체적인 값 (예: '450px', '50vw')

  // 내용 위아래 마진 (세로 길이는 css에서 height: auto로 반응형 처리됨)
  marginY: {
    type: String,
    default: '16px', // 콘텐츠 위아래로 들어갈 마진 값
  },

  // border 설정
  border: { type: String, default: '1px solid #d9d9d9' }, // figma-외곽선 기준

  // background 설정
  bgColor: { type: String, default: '#ffffff' },

  // shadow 설정
  shadow: { type: Boolean, default: true },

  // font family 설정
  fontFamily: { type: String, default: 'inherit' }, // 기본값은 부모 상속
});

// 가로 길이 규격에 따른 클래스 부여
const widthClass = computed(
  () => (props.width !== 'custom' ? `w-${props.width}` : '') // custom일 경우 style 바인딩에서 처리
);

// 그림자 클래스
const shadowClass = computed(() => (props.shadow ? 'has-shadow' : ''));

// 동적 스타일 바인딩 (Custom Box 가로, 테두리, 배경색)
const boxStyles = computed(() => ({
  width: props.width === 'custom' ? props.customWidth : undefined,
  border: props.border,
  backgroundColor: props.bgColor,
  fontFamily: props.fontFamily,
}));
</script>

<style scoped>
.common-box {
  box-sizing: border-box;
  border-radius: 25px; /* figma 설정 기준 */
  height: auto; /* 내용물에 따라 세로 길이가 유동적으로 늘어남 */
  overflow: hidden; /* 내부 마진 병합(Margin Collapsing) 방지 */
  transition: all 0.2s ease-in-out;
}

/* 가로 길이 규격 클래스 */
.w-small {
  width: 300px;
}
.w-middle {
  width: 500px;
}
.w-big {
  width: 800px;
}

/* 그림자 설정 */
.has-shadow {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25); /* figma-바깥쪽 그림자 기준 */
}

/* 내부 콘텐츠 래퍼 (좌우는 padding으로, 위아래는 인라인 style 마진으로 제어) */
.box-content {
  padding: 0 16px; /* 좌우 기본 여백 */
  /* 위아래 마진은 props.marginY를 통해 동적으로 주입 */
}
</style>
