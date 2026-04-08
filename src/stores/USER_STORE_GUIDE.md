# useUserStore 사용 가이드

## 기본 import

```js
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
```

---

## 상태

| 상태           | 타입           | 설명                  |
| -------------- | -------------- | --------------------- |
| `user`         | Object \| null | 로그인한 유저 정보    |
| `transactions` | Array          | 해당 유저의 거래 목록 |

```js
userStore.user; // { id, userId, nickname, userLocation, selectedTitle, ... }
userStore.transactions; // [{ id, user_id, type, amount, category, memo, emotion, date }, ...]
```

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

---

## template에서 사용

```html
<p>{{ userStore.user?.nickname }}</p>
<p>{{ userStore.transactions.length }}건</p>
```

---

## storeToRefs — 반응형 구조 분해

`userStore`를 직접 구조 분해하면 반응성이 깨지므로 `storeToRefs`를 사용합니다.

```js
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user, transactions } = storeToRefs(userStore);
// user.value, transactions.value 로 접근
```

---

## 로그인 여부 체크

```js
if (!userStore.user) router.push('/login');
```
