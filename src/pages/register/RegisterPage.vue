<template>
  <div class="ledger-wrapper register-page" :class="registerThemeClass">
    <main class="content">
      <div class="grid-layout">

        <div class="column left-column">
          <Box width="custom" customWidth="100%" marginY="8px" class="form-card card-toggle" :shadow="false">
            <div class="toggle-group">
              <button type="button" class="toggle-button expense" :class="{ active: transaction.type === 'expense' }"
                :aria-pressed="transaction.type === 'expense'" @click="transaction.type = 'expense'">
                지출
              </button>
              <button type="button" class="toggle-button income" :class="{ active: transaction.type === 'income' }"
                :aria-pressed="transaction.type === 'income'" @click="transaction.type = 'income'">
                수입
              </button>
            </div>
            <p class="mode-indicator" :class="transaction.type">
              {{ transaction.type === 'expense' ? '현재 지출 내역을 기록하고 있어요.' : '현재 수입 내역을 기록하고 있어요.' }}
            </p>
          </Box>

          <Box width="custom" customWidth="100%" class="form-card card-amount" :shadow="false">
            <p class="label">금액</p>
            <input v-model.number="transaction.amount" type="number" placeholder="0원 (입력)" class="transparent-input" />
          </Box>

          <Box width="custom" customWidth="100%" class="form-card card-date date-box" role="button" tabindex="0" @click="openDatePicker"
            @keydown.enter.prevent="openDatePicker" @keydown.space.prevent="openDatePicker" :shadow="false">
            <p class="label">날짜</p>
            <input ref="dateInput" v-model="transaction.date" type="date" class="transparent-input date-input"
              :min="MIN_TRANSACTION_DATE" :max="MAX_TRANSACTION_DATE" inputmode="none" @keydown="handleDateKeydown"
              @beforeinput.prevent @paste.prevent />
          </Box>

          <Box width="custom" customWidth="100%" class="form-card card-category" :shadow="false">
            <p class="label">카테고리</p>
            <div v-if="isExpense">
              <div v-if="isRegretTheme" class="category-text-grid">
                <button v-for="cat in categoryList" :key="cat.id" type="button" class="category-text-option"
                  :class="{ active: transaction.category === cat.value }" :title="cat.label" :aria-label="cat.label"
                  :aria-pressed="transaction.category === cat.value" @click="transaction.category = cat.value">
                  {{ cat.label }}
                </button>
              </div>
              <div v-else class="category-circles">
                <button v-for="cat in categoryList" :key="cat.id" type="button" class="category-option" :class="{
                  'category-option-active': isExpense && transaction.category === cat.value,
                  'category-option-disabled': !isExpense,
                }" :title="cat.label" :aria-label="cat.label"
                  :aria-pressed="isExpense && transaction.category === cat.value" :disabled="!isExpense"
                  @click="transaction.category = cat.value">
                  <span class="circle" :class="{ 'circle-active': isExpense && transaction.category === cat.value }">
                    <component :is="cat.icon" :size="20" class="category-icon" />
                  </span>
                  <span class="category-name">{{ cat.label }}</span>
                </button>
              </div>
            </div>
            <div v-else class="fixed-field">
              <div class="fixed-field-heading">
                <DollarSign :size="18" class="fixed-field-icon income-icon" />
                <strong class="fixed-field-title">Income</strong>
              </div>
              <!-- 수입 모드 시 자동 카테고리 선택 비활성화 -->
              <p class="fixed-field-description">수입은 자동으로 카테고리가 부여돼요.</p>
            </div>
          </Box>
        </div>

        <div class="column right-column">
          <Box width="custom" customWidth="100%" class="form-card card-emotion" :shadow="false">
            <p class="label">{{ isExpense ? '이 소비에 만족하셨나요?' : '감정' }}</p>
            <div v-if="isExpense">
              <div v-if="isRegretTheme" class="mood-text-group">
                <button type="button" class="mood-text-button" :class="{ active: transaction.emotion === 'happy' }"
                  :aria-pressed="transaction.emotion === 'happy'" @click="transaction.emotion = 'happy'">
                  만족
                </button>
                <button type="button" class="mood-text-button" :class="{ active: transaction.emotion === 'regret' }"
                  :aria-pressed="transaction.emotion === 'regret'" @click="transaction.emotion = 'regret'">
                  후회
                </button>
              </div>
              <div v-else class="mood-group">
                <button type="button" class="mood-item mood-button mood-happy"
                  :class="{ active: isExpense && transaction.emotion === 'happy', disabled: !isExpense }"
                  :aria-pressed="isExpense && transaction.emotion === 'happy'" :disabled="!isExpense"
                  @click="transaction.emotion = 'happy'">
                  <img :src="displayedHappyIcon" alt="만족" class="face-icon" />
                  <span>만족</span>
                </button>
                <button type="button" class="mood-item mood-button mood-regret"
                  :class="{ active: isExpense && transaction.emotion === 'regret', disabled: !isExpense }"
                  :aria-pressed="isExpense && transaction.emotion === 'regret'" :disabled="!isExpense"
                  @click="transaction.emotion = 'regret'">
                  <img :src="displayedSadIcon" alt="후회" class="face-icon" />
                  <span>후회</span>
                </button>
              </div>
            </div>
            <div v-else class="fixed-field">
              <!-- 수입 모드 시 감정 선택 비활성화 -->
              <p class="fixed-field-description">수입은 감정을 저장하지 않아요.</p>
            </div>
          </Box>

          <Box width="custom" customWidth="100%" class="form-card card-location" :shadow="false">
            <p class="label">위치</p>
            <div v-if="isExpense" class="select-wrapper">
              <select v-model="transaction.location" class="transparent-input select-input" :disabled="!isExpense">
                <option disabled value="">소비가 이뤄진 위치를 선택해주세요</option>
                <option v-for="district in seoulDistricts" :key="district" :value="district">
                  {{ district }}
                </option>
              </select>
              <ChevronDown :size="18" class="select-chevron" />
            </div>
            <div v-else class="fixed-field">
              <p class="fixed-field-description">수입은 위치를 저장하지 않아요.</p>
            </div>
            <p v-if="isExpense" class="select-caption">드롭다운 메뉴로 선택</p>
          </Box>

          <Box width="custom" customWidth="100%" class="form-card card-memo" :shadow="false">
            <p class="label">메모</p>
            <textarea ref="memoTextarea" v-model="transaction.memo" :placeholder="memoPlaceholder"
              class="transparent-input memo-input" rows="3" @input="handleMemoInput"></textarea>
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
import { computed, nextTick, onMounted, ref } from 'vue';
import {
  Beer,
  BusFront,
  ChevronDown,
  Coffee,
  Cross,
  DollarSign,
  Ellipsis,
  Hamburger,
  Package,
  ShoppingBag,
  Store,
  Utensils,
} from '@lucide/vue';
import happyColorIcon from '@/assets/icon/ico_happy_green.svg';
import sadColorIcon from '@/assets/icon/ico_sad_orange.svg';
import happyIcon from '@/assets/svg/happy.svg';
import sadIcon from '@/assets/svg/sad.svg';
import Box from '@/components/Box.vue';
import api from '@/service/api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const registerThemeClass = computed(() => {
  if (userStore.appThemeClass === 'theme-happy') {
    return 'register-theme-happy';
  }

  if (userStore.appThemeClass === 'theme-regret') {
    return 'register-theme-regret';
  }

  return 'register-theme-neutral';
});
const isHappyTheme = computed(() => registerThemeClass.value === 'register-theme-happy');
const isRegretTheme = computed(() => registerThemeClass.value === 'register-theme-regret');
const displayedHappyIcon = computed(() => (isHappyTheme.value ? happyColorIcon : happyIcon));
const displayedSadIcon = computed(() => (isHappyTheme.value ? sadColorIcon : sadIcon));

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
const KST_TIME_ZONE = 'Asia/Seoul';
const KST_UTC_OFFSET = '+09:00';

// UTC -> KST 변환 로직
const getKSTDateTimeParts = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: KST_TIME_ZONE,
    hour12: false,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return Object.fromEntries(
    formatter
      .formatToParts(new Date())
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );
};

const getTodayKST = () => {
  const { year, month, day } = getKSTDateTimeParts();
  return `${year}-${month}-${day}`;
};

const MIN_TRANSACTION_DATE = '1900-01-01'; // 최대 과거 날짜
const MAX_TRANSACTION_DATE = '2099-12-31'; // 최대 미래 날짜

const isValidDateString = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isDateInAllowedRange = (value) =>
  value >= MIN_TRANSACTION_DATE && value <= MAX_TRANSACTION_DATE;

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
// 날짜 박스 어디를 눌러도 네이티브 date picker를 열 수 있게 input을 직접 제어
const dateInput = ref(null)
const memoTextarea = ref(null)

const resetTransaction = () => {
  transaction.value = createInitialTransaction()
  nextTick(resizeMemoInput)
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
const memoPlaceholder = computed(() =>
  isExpense.value ? '이 소비에 대해 기록해보세요...' : '이 수입에 대해 기록해보세요...'
);

// 브라우저가 지원하면 picker를 직접 열고, 아니면 input에 포커스
const openDatePicker = () => {
  if (!dateInput.value) {
    return;
  }

  if (typeof dateInput.value.showPicker === 'function') {
    dateInput.value.showPicker();
    return;
  }

  dateInput.value.focus();
};

// 날짜는 키보드로 직접 수정하지 않고 picker 선택만 허용
const handleDateKeydown = (event) => {
  if (event.key === 'Tab' || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  event.preventDefault();

  if (event.key === 'Enter' || event.key === ' ') {
    openDatePicker();
  }
};

const resizeMemoInput = () => {
  if (!memoTextarea.value) {
    return;
  }

  memoTextarea.value.style.height = 'auto';
  memoTextarea.value.style.height = `${memoTextarea.value.scrollHeight}px`;
};

const handleMemoInput = () => {
  resizeMemoInput();
};

onMounted(() => {
  resizeMemoInput();
});

const buildTransactionDateTime = (date) => { // 몇시 몇분을 포함하도록 변경
  const { hour, minute } = getKSTDateTimeParts();

  return `${date}T${hour}:${minute}:00${KST_UTC_OFFSET}`; // (ex) 2026-04-26T08:58:00+09:00
};

// payload 제작
const buildTransactionPayload = () => {
  const amount = Number(transaction.value.amount);
  const userId = currentUserId.value;
  const memo = transaction.value.memo.trim();
  const date = buildTransactionDateTime(transaction.value.date);

  if (isExpense.value) {
    return {
      ...transaction.value,
      user_id: userId,
      amount,
      date,
      memo,
    };
  }

  return { // 수입 모드 시 감정, 위치는 null
    ...transaction.value,
    user_id: userId,
    amount,
    date,
    category: 'income',
    emotion: null,
    location: null,
    memo,
  };
};

// ==========================================
// 서버 전송 로직 (json-server 연동)
// ==========================================
const saveTransaction = async () => {
  if (isSubmitting.value) {
    return; // 중복 저장 방지
  }

  // 로그인 상태 확인
  if (currentUserId.value === null) {
    alert("로그인 정보를 확인해주세요.");
    return;
  }

  // 유효성 검사
  if (!transaction.value.amount || transaction.value.amount <= 0) {
    alert("금액을 정확히 입력해주세요!");
    return;
  }

  const date = transaction.value.date?.trim?.() ?? '';

  if (!date) {
    alert("날짜를 선택해주세요!");
    return;
  }

  if (!isValidDateString(date)) {
    alert("올바른 날짜를 선택해주세요!");
    return;
  }

  if (!isDateInAllowedRange(date)) {
    alert("날짜는 1900-01-01부터 2099-12-31까지 선택할 수 있어요.");
    return;
  }

  const memo = transaction.value.memo.trim();

  if (!memo) {
    alert("메모를 입력해주세요!");
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
    const savedTransaction = await api.post('/transactions', buildTransactionPayload());

    // 저장 직후 pinia userStore에도 반영해서 감정 집계와 전역 UI를 즉시 갱신
    userStore.addTransaction(savedTransaction);

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
  background-color: var(--page-bg-register);
  min-height: 100vh;
  --register-panel-highlight: rgba(255, 255, 255, 0.58);
  --register-expense-shadow: 0 14px 28px rgba(255, 148, 95, 0.28);
  --register-income-shadow: 0 14px 28px rgba(31, 110, 52, 0.24);
  --register-mood-shadow: 0 18px 30px rgba(255, 140, 0, 0.14);
  --register-category-shadow: 0 14px 26px rgba(255, 140, 0, 0.18);
  --register-income-button-bg: linear-gradient(135deg, #24592e 0%, #3e8c4c 100%);
  --register-income-button-border: rgba(24, 82, 42, 0.42);
  --register-income-button-text: #ffffff;
}

.register-page.register-theme-happy {
  --register-panel-highlight: rgba(255, 255, 255, 0.74);
  --register-expense-shadow: 0 18px 34px rgba(255, 152, 152, 0.3);
  --register-income-shadow: 0 18px 34px rgba(36, 89, 46, 0.22);
  --register-mood-shadow: 0 22px 40px rgba(255, 170, 170, 0.26);
  --register-category-shadow: 0 20px 32px rgba(255, 170, 170, 0.24);
  --register-income-button-bg: linear-gradient(135deg, #2f6b37 0%, #4d9d5d 100%);
  --register-income-button-border: rgba(47, 107, 55, 0.44);
}

.register-page.register-theme-neutral {
  --register-panel-highlight: transparent;
  --register-income-button-bg: #3e8c4c;
  font-family: initial;
}

.register-page.register-theme-regret {
  --register-panel-highlight: rgba(0, 0, 0, 0.04);
  --register-expense-shadow: none;
  --register-income-shadow: none;
  --register-mood-shadow: none;
  --register-category-shadow: none;
  --icon-display: block;
  --image-display: block;
  --illustration-opacity: 1;
  --register-income-button-bg: var(--accent-primary);
  --register-income-button-border: var(--border-strong);
}

.content {
  padding: clamp(16px, 2vw, 24px) clamp(16px, 2.6vw, 32px) clamp(24px, 3vw, 36px);
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  min-height: 100vh;
  transition: all 0.3s ease;
}

@media (max-width: 1024px) {
  .grid-layout {
    grid-template-columns: minmax(0, 1fr);
    min-height: auto;
  }

  .left-column,
  .right-column {
    grid-template-rows: auto;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 16px;
  }

  .category-circles {
    grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  }

  .category-text-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .mood-group,
  .mood-text-group {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ==========================================
  내부 콘텐츠 스타일링
========================================== */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(18px, 2.4vw, 30px);
  margin: 0;
  width: 100%;
  min-height: calc(100vh - clamp(48px, 6vw, 72px));
  align-items: stretch;
}

.register-page :deep(.common-box) {
  width: 100%;
  min-width: 0;
  border-color: var(--card-border);
  background-color: var(--card-bg);
}

.column {
  display: grid;
  gap: clamp(16px, 1.8vw, 20px);
  min-width: 0;
  min-height: 0;
}

.column > * {
  width: 100%;
}

.left-column {
  grid-template-rows:
    minmax(0, 1fr)
    minmax(0, 0.95fr)
    minmax(0, 0.95fr)
    minmax(0, 1.45fr);
}

.right-column {
  grid-template-rows:
    minmax(0, 1.15fr)
    minmax(0, 0.95fr)
    minmax(0, 1.2fr)
    auto;
}

.form-card {
  min-height: 0;
}

.form-card:deep(.box-content) {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.2vw, 14px);
  justify-content: flex-start;
}

.card-category .category-circles,
.card-category .category-text-grid,
.card-emotion .mood-group,
.card-emotion .mood-text-group {
  flex: 1;
  align-content: start;
}

.card-toggle .mode-indicator {
  margin-top: 4px;
}

.card-location .select-caption {
  margin-top: 6px;
}

.card-toggle .toggle-button {
  min-height: 64px;
  font-size: clamp(22px, 1.8vw, 26px);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.card-toggle .mode-indicator {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

.card-amount .transparent-input,
.card-date .date-input,
.card-location .select-wrapper,
.card-location .fixed-field,
.card-category .fixed-field,
.card-emotion .fixed-field {
  width: 100%;
  margin-top: 2px;
}

.card-amount .transparent-input {
  font-size: clamp(30px, 3vw, 42px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.card-amount .transparent-input::placeholder {
  font-size: inherit;
  font-weight: 700;
}

.card-date .date-input {
  font-size: clamp(22px, 2.1vw, 28px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.card-location .select-input {
  padding: 16px 48px 16px 18px;
  font-size: clamp(18px, 1.6vw, 21px);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.card-location .select-input:invalid {
  font-weight: 600;
}

.card-location .select-caption {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.card-memo .memo-input {
  flex: 1;
  height: 100%;
  min-height: 180px;
}

.label {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.transparent-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 18px;
  width: 100%;
  color: var(--input-text);
}

.transparent-input::placeholder {
  color: var(--text-placeholder);
}

.date-box {
  cursor: pointer;
  transition: var(--card-transition);
}

.date-input {
  font-family: inherit;
  color: var(--text-secondary);
  cursor: pointer;
}

.date-box:hover,
.date-box:focus-within {
  transform: var(--card-hover-lift);
  box-shadow: var(--card-hover-shadow);
}

.memo-input {
  display: block;
  min-height: 84px;
  resize: none;
  overflow: hidden;
  line-height: 1.6;
  font-family: inherit;
}

.select-input {
  appearance: none;
  cursor: pointer;
  color: var(--input-text);
  width: 100%;
  padding: 14px 44px 14px 16px;
  border-radius: var(--radius-input);
  border: var(--border-width) solid var(--border-strong);
  background: var(--surface-secondary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
  transition: var(--btn-transition);
}

.select-input:invalid {
  color: var(--text-placeholder);
}

.select-wrapper {
  position: relative;
}

.select-wrapper:focus-within .select-input {
  border-color: var(--accent-strong);
  box-shadow: var(--input-focus-shadow);
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
  color: var(--text-secondary);
  pointer-events: none;
  display: var(--icon-display);
}

.select-caption {
  margin: 8px 4px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.fixed-field {
  min-height: 64px;
  padding: 14px 16px;
  border-radius: var(--radius-input);
  border: var(--border-width) solid var(--border-strong);
  background: var(--surface-secondary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  transition: var(--card-transition);
}

.fixed-field-heading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fixed-field-icon {
  flex-shrink: 0;
  display: var(--icon-display);
}

.income-icon {
  color: var(--amount-plus);
}

.fixed-field-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--amount-plus);
}

.fixed-field-description {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  line-height: 1.4;
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
  gap: 12px;
  padding: 10px;
  border-radius: var(--radius-card);
  border: var(--border-width) solid var(--border-soft);
  background:
    linear-gradient(180deg, var(--register-panel-highlight) 0%, rgba(255, 255, 255, 0.1) 100%),
    var(--surface-emphasis);
}

.toggle-button {
  position: relative;
  overflow: hidden;
  min-height: 58px;
  border: var(--border-width) solid transparent;
  background: rgba(255, 255, 255, 0.24);
  border-radius: var(--radius-input);
  padding: 12px 16px;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition:
    var(--btn-transition),
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.toggle-button:hover:not(.active) {
  transform: var(--btn-hover-lift);
  background: rgba(255, 255, 255, 0.38);
}

.toggle-button.expense.active {
  background: linear-gradient(135deg, var(--accent-secondary) 0%, var(--amount-minus) 100%);
  border-color: rgba(255, 95, 0, 0.2);
  color: var(--button-primary-text);
  box-shadow: var(--register-expense-shadow);
}

.toggle-button.income.active {
  background: var(--register-income-button-bg);
  border-color: var(--register-income-button-border);
  color: var(--register-income-button-text);
  box-shadow: var(--register-income-shadow);
}

.mode-indicator {
  display: inline-flex;
  align-items: center;
  margin: 12px 4px 0;
  padding: 8px 12px;
  border-radius: var(--radius-chip);
  border: var(--border-width) solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.mode-indicator.expense {
  color: var(--accent-primary);
}

.mode-indicator.income {
  color: var(--amount-plus);
}

/* 카테고리 원형 마커 */
.category-circles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: clamp(12px, 1.8vw, 16px);
  align-items: stretch;
}

.category-text-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.category-text-option {
  min-height: 48px;
  border: var(--border-width) solid var(--border-strong);
  background: var(--surface-primary);
  color: var(--text-primary);
  padding: 12px 10px;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--btn-transition);
}

.category-text-option.active {
  background: var(--accent-primary);
  color: var(--button-primary-text);
}

.category-option {
  width: 100%;
  max-width: none;
  border: var(--border-width) solid transparent;
  border-radius: calc(var(--radius-card) - 4px);
  background: transparent;
  padding: 12px 8px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font: inherit;
  transition:
    var(--btn-transition),
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.category-option:hover {
  transform: var(--btn-hover-lift);
}

.category-option-active {
  background: rgba(255, 255, 255, 0.24);
  border-color: rgba(255, 255, 255, 0.24);
}

.category-option-disabled {
  cursor: not-allowed;
}

.circle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: var(--border-width) solid var(--border-soft);
  background:
    linear-gradient(180deg, var(--register-panel-highlight) 0%, rgba(255, 255, 255, 0.12) 100%),
    var(--surface-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.52);
  transition:
    var(--btn-transition),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.category-option:hover .circle {
  transform: var(--chip-hover-scale);
  box-shadow: var(--shadow-emphasis);
}

.category-option-disabled:hover .circle {
  transform: none;
}

.circle-active {
  border-color: rgba(255, 255, 255, 0.24);
  background: linear-gradient(135deg, var(--button-primary-bg) 0%, var(--accent-secondary) 100%);
  color: var(--button-primary-text);
  box-shadow: var(--register-category-shadow);
}

.category-icon {
  pointer-events: none;
  display: var(--icon-display);
}

.category-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  line-height: 1.2;
  word-break: keep-all;
  transition: color 0.2s ease, transform 0.2s ease;
}

.category-option-active .category-name {
  color: var(--text-primary);
  transform: translateY(-2px);
}

.category-option-disabled .circle {
  color: var(--text-placeholder);
  box-shadow: none;
}

.category-option-disabled .category-name {
  color: var(--surface-secondary);
}

/* 기분 선택 그룹 */
.mood-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 1.8vw, 16px);
  margin-top: 10px;
}

.mood-text-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 1.8vw, 16px);
}

.mood-text-button {
  min-height: 56px;
  border: var(--border-width) solid var(--border-strong);
  background: var(--surface-primary);
  color: var(--text-primary);
  font: inherit;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--btn-transition);
}

.mood-text-button.active {
  background: var(--accent-primary);
  color: var(--button-primary-text);
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: clamp(136px, 18vw, 150px);
  padding: 18px 16px;
  border-radius: calc(var(--radius-card) - 4px);
}

.mood-button {
  border: var(--border-width) solid var(--border-soft);
  background:
    linear-gradient(180deg, var(--register-panel-highlight) 0%, rgba(255, 255, 255, 0.14) 100%),
    var(--surface-primary);
  font: inherit;
  cursor: pointer;
  color: var(--text-secondary);
  transition:
    var(--btn-transition),
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.mood-button:hover:not(:disabled) {
  transform: var(--btn-hover-lift);
  box-shadow: var(--shadow-emphasis);
}

.mood-item.active {
  background: linear-gradient(180deg, var(--surface-primary) 0%, var(--surface-secondary) 100%);
  color: var(--text-primary);
  box-shadow: var(--register-mood-shadow);
}

.mood-button.mood-happy.active {
  border-color: rgba(255, 152, 152, 0.46);
}

.mood-button.mood-regret.active {
  border-color: rgba(255, 140, 0, 0.24);
}

.mood-item.disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.mood-button span {
  font-size: 18px;
  font-weight: 700;
}

.face-icon {
  width: 60px;
  height: 60px;
  display: var(--image-display);
  object-fit: contain;
  opacity: var(--illustration-opacity);
  transition: transform 0.22s ease, filter 0.22s ease, opacity 0.22s ease;
}

.mood-button:not(.active) .face-icon {
  opacity: 0.72;
}

.mood-button.active .face-icon {
  transform: scale(1.08);
  filter: drop-shadow(0 12px 20px rgba(255, 140, 0, 0.16));
}

.memo-input:disabled,
.select-input:disabled {
  color: var(--text-placeholder);
  cursor: not-allowed;
}

/* 버튼 */
.submit-button {
  position: relative;
  overflow: hidden;
  margin-top: auto;
  width: 100%;
  min-height: 68px;
  background: linear-gradient(135deg, var(--accent-secondary) 0%, var(--button-primary-bg) 100%);
  background-size: 200% 100%;
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-button);
  padding: 20px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--button-primary-text);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition:
    var(--btn-transition),
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.submit-button::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, transparent 62%);
  pointer-events: none;
}

.submit-button:hover:not(:disabled) {
  transform: var(--btn-hover-lift);
  box-shadow: var(--card-hover-shadow);
}

.submit-button.disabled,
.submit-button:disabled {
  background: var(--surface-emphasis);
  color: var(--text-muted);
  cursor: not-allowed;
  box-shadow: none;
}

.submit-button.disabled::before,
.submit-button:disabled::before {
  display: none;
}

.submit-button:active:not(:disabled) {
  transform: var(--btn-active-lift);
}

.submit-button:disabled:active {
  transform: none;
}

.toggle-button:focus-visible,
.category-text-option:focus-visible,
.category-option:focus-visible,
.mood-text-button:focus-visible,
.mood-button:focus-visible,
.submit-button:focus-visible {
  outline: none;
  box-shadow: var(--input-focus-shadow);
}

.register-page.register-theme-happy .submit-button {
  background: var(--button-primary-bg);
}

.register-page.register-theme-happy .toggle-button {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 236, 207, 0.92) 100%);
}

.register-page.register-theme-happy .toggle-button:hover:not(.active) {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 228, 196, 0.98) 100%);
}

.register-page.register-theme-happy .toggle-button.expense.active {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--amount-minus) 100%);
  border-color: rgba(255, 152, 152, 0.36);
}

.register-page.register-theme-happy .toggle-button.income.active {
  background: linear-gradient(135deg, #53cf74 0%, #2f8f5b 100%);
}

.register-page.register-theme-happy .circle-active {
  background: var(--button-primary-bg);
}

.register-page.register-theme-neutral .toggle-group {
  background: var(--surface-emphasis);
}

.register-page.register-theme-neutral .toggle-button.expense.active {
  background: var(--accent-secondary);
}

.register-page.register-theme-neutral .circle {
  background: var(--surface-secondary);
}

.register-page.register-theme-neutral .circle-active {
  background: var(--button-primary-bg);
}

.register-page.register-theme-neutral .mood-button {
  background: var(--surface-primary);
}

.register-page.register-theme-neutral .mood-item.active {
  background: var(--surface-secondary);
}

.register-page.register-theme-neutral .submit-button {
  background: var(--button-primary-bg);
}

.register-page.register-theme-neutral .submit-button::before {
  display: none;
}

.register-page.register-theme-regret .toggle-group,
.register-page.register-theme-regret .mode-indicator,
.register-page.register-theme-regret .category-option,
.register-page.register-theme-regret .mood-button,
.register-page.register-theme-regret .fixed-field,
.register-page.register-theme-regret .select-input {
  background: var(--surface-primary);
  border-color: var(--border-strong);
  box-shadow: none;
}

.register-page.register-theme-regret :deep(.common-box) {
  border: var(--border-width) solid var(--border-strong) !important;
  background: var(--surface-primary) !important;
  box-shadow: none !important;
}

.register-page.register-theme-regret .toggle-button {
  color: var(--text-primary);
}

.register-page.register-theme-regret .toggle-button.active {
  background: var(--accent-primary);
  color: var(--button-primary-text);
}

.register-page.register-theme-regret .mode-indicator {
  color: var(--text-primary);
}

.register-page.register-theme-regret .category-option {
  gap: 8px;
  min-height: auto;
  padding: 12px 8px;
  justify-content: center;
}

.register-page.register-theme-regret .circle {
  width: 48px;
  height: 48px;
  background: var(--surface-primary);
  border-color: var(--border-strong);
  color: var(--text-primary);
  box-shadow: none;
}

.register-page.register-theme-regret .category-option:hover .circle,
.register-page.register-theme-regret .mood-button.active .face-icon {
  transform: none;
}

.register-page.register-theme-regret .category-option-active {
  background: var(--surface-primary);
}

.register-page.register-theme-regret .category-option-active .category-name,
.register-page.register-theme-regret .mood-item.active,
.register-page.register-theme-regret .mood-item.active span {
  color: var(--text-primary);
}

.register-page.register-theme-regret .mood-item.active {
  background: var(--surface-primary);
  border-color: var(--border-strong);
  box-shadow: none;
}

.register-page.register-theme-regret .category-option-active .category-name {
  transform: none;
}

.register-page.register-theme-regret .circle-active {
  background: var(--accent-primary);
  color: var(--button-primary-text);
  border-color: var(--border-strong);
}

.register-page.register-theme-regret .face-icon {
  filter: grayscale(1) contrast(1.1);
}

.register-page.register-theme-regret .submit-button {
  background: var(--accent-primary);
  color: var(--button-primary-text);
  border-color: var(--border-strong);
  box-shadow: none;
}

.register-page.register-theme-regret .submit-button::before {
  display: none;
}
</style>
