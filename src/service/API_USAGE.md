# API 사용 가이드

`src/service/api.js`는 json-server(`http://localhost:3000`)와 통신하는 공통 axios 인스턴스입니다.

---

## 기본 사용법

```js
import api from '@/service/api'
```

모든 메서드는 `async/await` 기반이며, 응답은 `response.data`가 자동으로 반환됩니다.  
에러 발생 시 `try/catch`로 처리합니다.

---

## GET — 데이터 조회

```js
// 전체 조회
const transactions = await api.get('/transactions')

// 쿼리 파라미터로 필터링
const filtered = await api.get('/transactions', { category: '카페', month: '2024-03' })

// 단건 조회
const item = await api.get('/transactions/1')
```

---

## POST — 데이터 생성

```js
const newTransaction = await api.post('/transactions', {
  date: '2024-03-20',
  amount: 4500,
  memo: '아메리카노',
  category: '카페',
  emotion: '행복',
  location: '강남구',
})
```

---

## PUT — 데이터 전체 수정

```js
await api.put('/transactions/1', {
  date: '2024-03-20',
  amount: 5000,
  memo: '라떼',
  category: '카페',
  emotion: '행복',
  location: '강남구',
})
```

---

## PATCH — 데이터 부분 수정

```js
// 특정 필드만 수정
await api.patch('/transactions/1', { memo: '라떼로 변경' })
```

---

## DELETE — 데이터 삭제

```js
await api.delete('/transactions/1')
```

---

## 로그인 예시

json-server는 별도 인증 기능이 없으므로, `users` 컬렉션에서 직접 조회하여 로그인을 구현합니다.

```js
// db.json 예시
// { "users": [{ "id": 1, "userId": "kim", "password": "1234", "nickname": "김철수", "region": "강남구" }] }

async function login(userId, password) {
  try {
    const users = await api.get('/users', { userId, password })

    if (users.length === 0) {
      throw new Error('아이디 또는 비밀번호가 틀렸습니다.')
    }

    return users[0] // 로그인 성공 시 유저 정보 반환
  } catch (error) {
    console.error(error.message)
  }
}
```

---

## 에러 처리 예시

```js
try {
  const data = await api.get('/transactions')
  console.log(data)
} catch (error) {
  console.error(error.message) // 서버 에러 메시지 또는 네트워크 에러
}
```

---

## Vue 컴포넌트에서 사용 예시

```vue
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/service/api'

const transactions = ref([])

onMounted(async () => {
  try {
    transactions.value = await api.get('/transactions')
  } catch (error) {
    console.error(error.message)
  }
})
</script>
```

---

## Pinia 스토어에서 사용 예시

```js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/service/api'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])

  async function fetchAll() {
    transactions.value = await api.get('/transactions')
  }

  async function add(payload) {
    const created = await api.post('/transactions', payload)
    transactions.value.push(created)
  }

  async function remove(id) {
    await api.delete(`/transactions/${id}`)
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  return { transactions, fetchAll, add, remove }
})
```
