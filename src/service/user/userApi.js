import api from '@/service/api';

export const getUserById = async (id) => {
  const result = await api.get('/users');
  const users = Array.isArray(result) ? result : (result.data ?? []);
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error('사용자를 찾을 수 없습니다.');
  return user;
};

export const getUserTransactions = async (userId) => {
  const result = await api.get('/transactions', { user_id: userId });
  return Array.isArray(result) ? result : (result.data ?? []);
};

export const loginUser = async (userId, userPassword) => {
  const result = await api.get('/users');
  const users = Array.isArray(result) ? result : (result.data ?? []);
  const user = users.find(
    (u) => u.userId === userId && u.userPassword === userPassword
  );
  if (!user) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  return user;
};

export const signupUser = async ({
  userId,
  userPassword,
  nickname,
  userLocation,
}) => {
  const result = await api.get('/users');
  const users = Array.isArray(result) ? result : (result.data ?? []);
  const exists = users.find((u) => u.userId === userId);
  if (exists) throw new Error('이미 사용 중인 아이디입니다.');

  const maxId = users.reduce((max, u) => {
    const n = parseInt(u.id, 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);

  return api.post('/users', {
    id: String(maxId + 1),
    userId,
    userPassword,
    nickname,
    userLocation,
    selectedTitle: [],
    earnedBadges: [],
    createdAt: new Date().toISOString().slice(0, 10),
  });
};

// 사용자 프로필 수정
export const updateUserProfile = async (id, payload) => {
  try {
    return await api.patch(`/users/${id}`, payload);
  } catch {
    return await api.put(`/users/${id}`, payload);
  }
};
