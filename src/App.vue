<script setup>
import { ref } from 'vue'
import api from '@/service/api'

const result = ref(null)
const error = ref(null)
const loading = ref(false)

// 새 location 데이터 (POST 테스트용)
const newLocation = ref({
  name: '테스트 장소',
  lat: 37.5665,
  lng: 126.978,
  category: '카페',
  visitedAt: '2024-04-08',
})

async function testGet() {
  error.value = null
  loading.value = true
  try {
    result.value = await api.get('/locations')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function testPost() {
  error.value = null
  loading.value = true
  try {
    result.value = await api.post('/locations', newLocation.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function testPatch() {
  error.value = null
  loading.value = true
  try {
    result.value = await api.patch('/locations/1', { name: '수정된 강남역 맛집' })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function testDelete() {
  error.value = null
  loading.value = true
  try {
    result.value = await api.delete('/locations/1')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="padding: 2rem; font-family: monospace">
    <h1>API 테스트</h1>

    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem">
      <button @click="testGet">GET /locations</button>
      <button @click="testPost">POST /locations</button>
      <button @click="testPatch">PATCH /locations/1</button>
      <button @click="testDelete">DELETE /locations/1</button>
    </div>

    <p v-if="loading">로딩 중...</p>
    <p v-if="error" style="color: red">에러: {{ error }}</p>
    <pre v-if="result && !loading" style="background: #f4f4f4; padding: 1rem; border-radius: 6px">{{
      JSON.stringify(result, null, 2)
    }}</pre>
  </div>
</template>

<style scoped>
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
