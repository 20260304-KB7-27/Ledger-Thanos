import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? error.message
    return Promise.reject(new Error(message))
  },
)

const api = {
  async get(url, params = {}) {
    return await instance.get(url, { params })
  },

  async post(url, data = {}) {
    return await instance.post(url, data)
  },

  async put(url, data = {}) {
    return await instance.put(url, data)
  },

  async patch(url, data = {}) {
    return await instance.patch(url, data)
  },

  async delete(url) {
    return await instance.delete(url)
  },
}

export default api
