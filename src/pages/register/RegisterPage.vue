<template>
  <div class="ledger-wrapper">
    <main class="content">
      <div class="grid-layout">

        <div class="column left-column">
          <Box width="custom" customWidth="100%" marginY="8px">
            <div class="toggle-group">
              <button type="button" class="toggle-button expense" :class="{ active: transaction.type === 'expense' }"
                @click="transaction.type = 'expense'">
                지출
              </button>
              <button type="button" class="toggle-button income" :class="{ active: transaction.type === 'income' }"
                @click="transaction.type = 'income'">
                수입
              </button>
            </div>
            <p class="mode-indicator" :class="transaction.type">
              {{ transaction.type === 'expense' ? '현재 지출 내역을 기록하고 있어요.' : '현재 수입 내역을 기록하고 있어요.' }}
            </p>
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">금액</p>
            <input type="number" v-model="transaction.amount" placeholder="00원 (입력)" class="transparent-input" />
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">날짜</p>
            <input type="date" v-model="transaction.date" class="transparent-input date-input" />
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">카테고리</p>
            <div class="category-circles">
              <button v-for="cat in categoryList" :key="cat.id" type="button" class="category-option"
                :class="{ 'category-option-active': transaction.category === cat.value }"
                @click="transaction.category = cat.value" :title="cat.label" :aria-label="cat.label">
                <span class="circle" :class="{ 'circle-active': transaction.category === cat.value }">
                  <component :is="cat.icon" :size="20" class="category-icon" />
                </span>
                <span class="category-name">{{ cat.label }}</span>
              </button>
            </div>
          </Box>
        </div>

        <div class="column right-column">
          <Box width="custom" customWidth="100%">
            <p class="label center-text">지금 기분은?</p>
            <div class="mood-group">
              <div class="mood-item clickable" :class="{ active: transaction.emotion === 'happy' }"
                @click="transaction.emotion = 'happy'">
                <img :src="happyIcon" alt="만족" class="face-icon" />
                <span>만족</span>
              </div>
              <div class="mood-item clickable" :class="{ active: transaction.emotion === 'sad' }"
                @click="transaction.emotion = 'sad'">
                <img :src="sadIcon" alt="후회" class="face-icon" />
                <span>후회</span>
              </div>
            </div>
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">위치</p>
            <input type="text" v-model="transaction.location" placeholder="예) 강남구, 구로구, ..."
              class="transparent-input" />
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">메모</p>
            <input type="text" v-model="transaction.memo" placeholder="이 소비에 대해 기록해보세요.." class="transparent-input" />
          </Box>

          <button class="submit-button" @click="saveTransaction">저장하기</button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  Beer,
  Bike,
  Bus,
  Coffee,
  Cross,
  Ellipsis,
  Package,
  ShoppingBag,
  Store,
  UtensilsCrossed,
} from '@lucide/vue';
import happyIcon from '@/assets/svg/happy.svg';
import sadIcon from '@/assets/svg/sad.svg';
import Box from '@/components/Box.vue';
import api from '@/service/api';

// ==========================================
// 2. 가계부 폼 상태 template
// ==========================================
const transaction = ref({
  user_id: "1", // 임시 유저 ID
  type: "expense", // 'expense' 또는 'income'
  amount: null,
  category: "shopping",
  memo: "",
  emotion: "happy", // 'happy' 또는 'sad'
  location: "",
  date: new Date().toISOString().split('T')[0] // 오늘 날짜 셋팅
});

// UI에 뿌려질 카테고리 임시 데이터
const categoryList = ref([
  { id: 1, label: '쇼핑', value: 'shopping', icon: ShoppingBag },
  { id: 2, label: '배달', value: 'delivery', icon: Bike },
  { id: 3, label: '식당', value: 'restaurant', icon: UtensilsCrossed },
  { id: 4, label: '편의점', value: 'convenience', icon: Store },
  { id: 5, label: '카페', value: 'cafe', icon: Coffee },
  { id: 6, label: '술집', value: 'bar', icon: Beer },
  { id: 7, label: '생필품', value: 'essentials', icon: Package },
  { id: 8, label: '교통', value: 'transport', icon: Bus },
  { id: 9, label: '병원', value: 'hospital', icon: Cross },
  { id: 10, label: '기타', value: 'etc', icon: Ellipsis },
]);

// ==========================================
// 3. 서버 전송 로직 (json-server 연동)
// ==========================================
const saveTransaction = async () => {
  // 유효성 검사
  if (!transaction.value.amount || transaction.value.amount <= 0) {
    alert("금액을 정확히 입력해주세요!");
    return;
  }

  try {
    await api.post('/transactions', {
      ...transaction.value,
      amount: Number(transaction.value.amount),
    });

    alert("성공적으로 저장되었습니다!");
    // 저장 완료 후 폼 초기화
    transaction.value.amount = null;
    transaction.value.memo = "";
    transaction.value.location = "";
  } catch (error) {
    console.error("통신 에러:", error);
    alert("서버와 연결할 수 없습니다. json-server가 실행 중인지 확인해주세요.");
  }
};
</script>

<style scoped>
/* ==========================================
  전체 레이아웃 및 반응형 처리
========================================== */
.ledger-wrapper {
  background-color: #fdf8e3;
  min-height: 100vh;
}

.content {
  padding: 40px 60px;
  overflow-y: auto;
  box-sizing: border-box;
  min-height: 100vh;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .content {
    padding: 20px;
  }

  .grid-layout {
    flex-direction: column;
  }

  .category-circles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ==========================================
  내부 콘텐츠 스타일링
========================================== */
.grid-layout {
  display: flex;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.center-text {
  text-align: center;
}

.transparent-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 18px;
  width: 100%;
}

.date-input {
  font-family: inherit;
  color: #333;
}

.clickable {
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

/* 토글 그룹 (지출/수입) */
.toggle-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 8px;
  border-radius: 18px;
  background: #fff2bf;
  border: 1px solid #ead9a1;
}

.toggle-button {
  border: 1px solid transparent;
  background: transparent;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 800;
  color: #8c7441;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.toggle-button:hover {
  transform: translateY(-1px);
}

.toggle-button.expense.active {
  background: #d97706;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(217, 119, 6, 0.25);
}

.toggle-button.income.active {
  background: #15803d;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(21, 128, 61, 0.22);
}

.mode-indicator {
  margin: 10px 4px 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
}

.mode-indicator.expense {
  color: #b45309;
}

.mode-indicator.income {
  color: #166534;
}

/* 카테고리 원형 마커 */
.category-circles {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px 10px;
  justify-items: center;
}

.category-option {
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font: inherit;
}

.circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7edd0;
  border: 1px solid #d8c9a0;
  color: #805B2E;
  cursor: pointer;
  transition: all 0.2s;
}

.category-option:hover .circle {
  background-color: #f4d03f;
  transform: scale(1.1);
}

.circle-active {
  background-color: #805B2E;
  border-color: #805B2E;
  color: #ffffff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.category-icon {
  pointer-events: none;
}

.category-name {
  font-size: 12px;
  font-weight: 600;
  color: #7b6742;
  line-height: 1.2;
  word-break: keep-all;
}

.category-option-active .category-name {
  color: #5b3f16;
}

/* 기분 선택 그룹 */
.mood-group {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-radius: 15px;
}

.mood-item.active {
  background-color: #fdf8e3;
}

.face-icon {
  width: 60px;
  height: 60px;
  display: block;
  object-fit: contain;
}

/* 버튼 */
.submit-button {
  margin-top: auto;
  background-color: #f4d03f;
  border: none;
  border-radius: 25px;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  transition: transform 0.1s;
}

.submit-button:active {
  transform: translateY(2px);
}
</style>
