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
            <input v-model.number="transaction.amount" type="number" placeholder="0원 (입력)" class="transparent-input" />
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">날짜</p>
            <input v-model="transaction.date" type="date" class="transparent-input date-input" />
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">카테고리</p>
            <div class="category-circles">
              <button v-for="cat in categoryList" :key="cat.id" type="button" class="category-option" :class="{
                'category-option-active': isExpense && transaction.category === cat.value,
                'category-option-disabled': !isExpense,
              }" :title="cat.label" :aria-label="cat.label" :disabled="!isExpense"
                @click="transaction.category = cat.value">
                <span class="circle" :class="{ 'circle-active': isExpense && transaction.category === cat.value }">
                  <component :is="cat.icon" :size="20" class="category-icon" />
                </span>
                <span class="category-name">{{ cat.label }}</span>
              </button>
            </div>
          </Box>
        </div>

        <div class="column right-column">
          <Box width="custom" customWidth="100%">
            <p class="label center-text">이 소비에 만족하셨나요?</p>
            <div class="mood-group">
              <button type="button" class="mood-item mood-button"
                :class="{ active: isExpense && transaction.emotion === 'happy', disabled: !isExpense }"
                :disabled="!isExpense" @click="transaction.emotion = 'happy'">
                <img :src="happyIcon" alt="만족" class="face-icon" />
                <span>만족</span>
              </button>
              <button type="button" class="mood-item mood-button"
                :class="{ active: isExpense && transaction.emotion === 'regret', disabled: !isExpense }"
                :disabled="!isExpense" @click="transaction.emotion = 'regret'">
                <img :src="sadIcon" alt="후회" class="face-icon" />
                <span>후회</span>
              </button>
            </div>
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">위치</p>
            <div class="select-wrapper" :class="{ 'select-wrapper-disabled': !isExpense }">
              <select v-model="transaction.location" class="transparent-input select-input" :disabled="!isExpense">
                <option disabled value="">소비가 이뤄진 위치를 선택해주세요</option>
                <option v-for="district in seoulDistricts" :key="district" :value="district">
                  {{ district }}
                </option>
              </select>
              <ChevronDown :size="18" class="select-chevron" />
            </div>
            <p class="select-caption" :class="{ 'select-caption-disabled': !isExpense }">드롭다운 메뉴로 선택</p>
          </Box>

          <Box width="custom" customWidth="100%">
            <p class="label">메모</p>
            <input v-model="transaction.memo" type="text" placeholder="이 소비에 대해 기록해보세요..."
              class="transparent-input memo-input" :disabled="!isExpense" />
          </Box>

          <button class="submit-button" :class="{ disabled: isSubmitting }" :disabled="isSubmitting"
            @click="saveTransaction">
            {{ isSubmitting ? '저장 중...' : '저장하기' }} <!-- 저장 중일 때 버튼 비활성화 -->
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
  Beer,
  BusFront,
  ChevronDown,
  Coffee,
  Cross,
  Ellipsis,
  Hamburger,
  Package,
  ShoppingBag,
  Store,
  Utensils,
} from '@lucide/vue';
import happyIcon from '@/assets/svg/happy.svg';
import sadIcon from '@/assets/svg/sad.svg';
import Box from '@/components/Box.vue';
import api from '@/service/api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const normalizeUserId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const currentUserId = computed(() =>
  normalizeUserId(userStore.user?.id ?? localStorage.getItem('userId'))
);

// ==========================================
// 가계부 폼 상태 생성 및 관리
// ==========================================
const getTodayKST = () => { // UTC -> KST로 변환 (9시간 차이 계산)
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const dateOffset = new Date(now.getTime() - offset);
  return dateOffset.toISOString().split('T')[0];
};

const createInitialTransaction = () => ({
  type: 'expense', // 'expense' 또는 'income'
  amount: null,
  category: 'shopping',
  memo: '',
  emotion: 'happy', // 'happy' 또는 'regret'
  location: '',
  date: getTodayKST(), // 오늘 날짜로 세팅
})

const transaction = ref(createInitialTransaction())
const isExpense = computed(() => transaction.value.type === 'expense') // 지출 모드, 수입 모드 전환
const isSubmitting = ref(false) // 중복 저장 방지를 위한 변수

const resetTransaction = () => {
  transaction.value = createInitialTransaction()
}

// UI에 뿌려질 카테고리 데이터
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

// 드롭다운 메뉴 서울 자치구
const seoulDistricts = [
  '종로구',
  '중구',
  '용산구',
  '성동구',
  '광진구',
  '동대문구',
  '중랑구',
  '성북구',
  '강북구',
  '도봉구',
  '노원구',
  '은평구',
  '서대문구',
  '마포구',
  '양천구',
  '강서구',
  '구로구',
  '금천구',
  '영등포구',
  '동작구',
  '관악구',
  '서초구',
  '강남구',
  '송파구',
  '강동구',
];

const emotionOptions = ['happy', 'regret'];

// payload 제작
const buildTransactionPayload = () => {
  const amount = Number(transaction.value.amount);
  const userId = currentUserId.value;

  if (isExpense.value) {
    return {
      ...transaction.value,
      user_id: userId,
      amount,
      memo: transaction.value.memo.trim(),
    };
  }

  return { // 수입 모드인 경우 카테고리, 감정, 위치, 메모를 null로 넘김
    ...transaction.value,
    user_id: userId,
    amount,
    category: null,
    emotion: null,
    location: null,
    memo: null,
  };
};

// ==========================================
// 서버 전송 로직 (json-server 연동)
// ==========================================
const saveTransaction = async () => {
  if (isSubmitting.value) {
    return; // 중복 저장 방지
  }

  if (currentUserId.value === null) {
    alert("로그인 정보를 확인해주세요.");
    return;
  }

  // 유효성 검사
  if (!transaction.value.amount || transaction.value.amount <= 0) {
    alert("금액을 정확히 입력해주세요!");
    return;
  }

  if (isExpense.value) {
    if (!categoryList.value.some((cat) => cat.value === transaction.value.category)) {
      alert("지출 카테고리를 선택해주세요!");
      return;
    }

    if (!emotionOptions.includes(transaction.value.emotion)) {
      alert("지출 감정을 선택해주세요!");
      return;
    }

    if (!seoulDistricts.includes(transaction.value.location)) {
      alert("서울 자치구를 선택해주세요!");
      return;
    }
  }

  try {
    isSubmitting.value = true;
    await api.post('/transactions', buildTransactionPayload());

    alert("성공적으로 저장되었습니다!");
    // 저장 완료 후 폼 초기화
    resetTransaction();
  } catch (error) {
    console.error("통신 에러:", error);
    alert("서버와 연결할 수 없습니다. json-server가 실행 중인지 확인해주세요.");
  } finally {
    isSubmitting.value = false;
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

.select-input {
  appearance: none;
  cursor: pointer;
  color: #333;
  width: 100%;
  padding: 14px 44px 14px 16px;
  border-radius: 14px;
  border: 1px solid #d8c9a0;
  background: #fff8de;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.select-input:invalid {
  color: #9a865d;
}

.select-wrapper {
  position: relative;
}

.select-wrapper:focus-within .select-input {
  border-color: #c89a2b;
  box-shadow: 0 0 0 3px rgba(244, 208, 63, 0.2);
}

.select-wrapper-disabled {
  opacity: 0.55;
}

.select-wrapper-disabled .select-input,
.select-wrapper-disabled .select-chevron {
  cursor: not-allowed;
}

.select-chevron {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: #8c7441;
  pointer-events: none;
}

.select-caption {
  margin: 8px 4px 0;
  font-size: 12px;
  font-weight: 600;
  color: #8a774e;
}

.select-caption-disabled {
  color: #aa9a74;
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

.category-option-disabled {
  cursor: not-allowed;
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

.category-option-disabled:hover .circle {
  background-color: #f7edd0;
  transform: none;
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

.category-option-disabled .circle {
  background-color: #efe5c8;
  border-color: #ded1ad;
  color: #b29b70;
  box-shadow: none;
}

.category-option-disabled .category-name {
  color: #b29b70;
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

.mood-button {
  border: none;
  background: transparent;
  font: inherit;
}

.mood-item.active {
  background-color: #fdf8e3;
}

.mood-item.disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.face-icon {
  width: 60px;
  height: 60px;
  display: block;
  object-fit: contain;
}

.memo-input:disabled,
.select-input:disabled {
  color: #9a865d;
  cursor: not-allowed;
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

.submit-button.disabled,
.submit-button:disabled {
  background-color: #d9c87d;
  color: #6f6340;
  cursor: not-allowed;
  box-shadow: none;
}

.submit-button:active {
  transform: translateY(2px);
}

.submit-button:disabled:active {
  transform: none;
}
</style>
