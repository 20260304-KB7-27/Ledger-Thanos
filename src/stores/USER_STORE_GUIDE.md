# useUserStore 사용 가이드

## 기본 import

```js
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
```

---

## 상태

### 원본 상태

| 상태           | 타입           | 설명                  |
| -------------- | -------------- | --------------------- |
| `user`         | Object \| null | 로그인한 유저 정보    |
| `transactions` | Array          | 해당 유저의 거래 목록 |

```js
userStore.user; // { id, userId, nickname, userLocation, selectedTitle, ... }
userStore.transactions; // [{ id, user_id, type, amount, category, memo, emotion, date }, ...]
```

### 파생 상태

`transactions`를 기준으로 자동 계산되는 값들입니다.

| 상태                  | 타입   | 설명                                                      |
| --------------------- | ------ | --------------------------------------------------------- |
| `expenseTransactions` | Array  | `type === 'expense'` 인 거래만 필터링한 목록              |
| `happyCount`          | Number | 지출 중 `emotion === 'happy'` 인 건수                     |
| `regretCount`         | Number | 지출 중 `emotion === 'regret'` 인 건수                    |
| `happyRatio`          | Number | `happy / (happy + regret)` 비율. 값 범위는 `0 ~ 1`        |
| `dominantEmotion`     | String | 비율 기준 감정 상태. `happy`, `regret`, `neutral` 중 하나 |
| `appThemeClass`       | String | `App.vue` 등에 바로 바인딩할 수 있는 클래스명             |

```js
userStore.happyCount; // 3
userStore.regretCount; // 2
userStore.happyRatio; // 0.6
userStore.dominantEmotion; // 'happy'
userStore.appThemeClass; // 'theme-happy'
```

`dominantEmotion` 판정 기준은 아래와 같습니다.

- `happyRatio >= 0.6` 이면 `happy`
- `happyRatio <= 0.4` 이면 `regret`
- 그 사이는 `neutral`

---

## 액션

### 로그인

로그인 성공 시 유저 정보와 transactions를 자동으로 fetch해 store에 저장합니다.

```js
await userStore.login(userId, userPassword);
```

### 로그아웃

```js
userStore.logout(); // user, transactions 초기화
```

### 거래 목록 교체

API에서 받아온 거래 배열 전체를 store에 반영할 때 사용합니다.

```js
userStore.setTransactions(userTransactions);
```

### 거래 1건 추가

지출/수입 등록 성공 직후 응답으로 받은 거래를 store에 바로 반영할 때 사용합니다.

```js
userStore.addTransaction(savedTransaction);
```

---

## template에서 사용

```html
<p>{{ userStore.user?.nickname }}</p>
<p>{{ userStore.transactions.length }}건</p>
<p>만족 {{ userStore.happyCount }}건</p>
<p>후회 {{ userStore.regretCount }}건</p>
```

---

## storeToRefs — 반응형 구조 분해

`userStore`를 직접 구조 분해하면 반응성이 깨지므로 `storeToRefs`를 사용합니다.

```js
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const {
  user,
  transactions,
  happyCount,
  regretCount,
  dominantEmotion,
  appThemeClass,
} = storeToRefs(userStore);
// user.value, transactions.value, happyCount.value ... 로 접근
```

## App.vue에서 테마 클래스 사용

```js
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { appThemeClass } = storeToRefs(userStore);
```

```html
<div class="app-layout" :class="appThemeClass">
  <RouterView />
</div>
```

---

## 로그인 여부 체크

```js
if (!userStore.user) router.push('/login');
```
