import { updateUserProfile } from '@/service/user/userApi';

const STORAGE_KEY = 'badge_calc_ym'; // "YYYY-MM" 형식으로 마지막 계산 월 저장

/**
 * 오늘이 해당 월의 마지막 날인지 확인한다.
 */
const isLastDayOfMonth = () => {
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return tomorrow.getMonth() !== today.getMonth();
};

/**
 * 이번 달에 이미 계산을 완료했는지 확인한다.
 */
const hasCalculatedThisMonth = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;
  const now = new Date();
  return saved === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * 이번 달 계산 완료로 표시한다.
 */
const markCalculatedThisMonth = () => {
  const now = new Date();
  localStorage.setItem(
    STORAGE_KEY,
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );
};

/**
 * 주어진 연/월에 해당하는 지출 거래만 필터링한다.
 */
const getExpensesForMonth = (transactions, year, month) => {
  return transactions.filter((t) => {
    if (t.type !== 'expense' || !t.date) return false;
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

/**
 * 이번 달 지출 거래를 바탕으로 획득한 배지 key 목록을 반환한다.
 *
 * 규칙:
 * - Fragile Hero  : 병원(hospital) 지출 10만원 이상
 * - Coffee Zombie : 카페(cafe) 지출 20만원 이상
 * - Coin Guardian : 월 총 지출 20만원 이하
 * - Lost Explorer : 거주지 지출 비율 20% 이하
 * - Money Splash  : 월 총 지출 100만원 이상
 * - Home Potato   : 거주지 지출 비율 80% 이상
 * - Tipsy Champ   : 술집(bar) 지출 비율 50% 이상
 * - Delivery Addict: 배달(delivery) 지출 비율 30% 이상
 */
const calcEarnedBadges = (expenses, userLocation) => {
  const total = expenses.reduce((sum, t) => sum + (t.amount ?? 0), 0);

  const amountByCategory = (cat) =>
    expenses
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);

  const homeAmount = expenses
    .filter((t) => t.location === userLocation)
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);

  const ratio = (amount) => (total > 0 ? amount / total : 0);

  const earned = [];

  if (amountByCategory('hospital') >= 100_000) earned.push('Fragile Hero');
  if (amountByCategory('cafe') >= 200_000) earned.push('Coffee Zombie');
  if (total > 0 && total <= 200_000) earned.push('Coin Guardian');
  if (total > 0 && ratio(homeAmount) <= 0.2) earned.push('Lost Explorer');
  if (total >= 1_000_000) earned.push('Money Splash');
  if (total > 0 && ratio(homeAmount) >= 0.8) earned.push('Home Potato');
  if (total > 0 && ratio(amountByCategory('bar')) >= 0.5) earned.push('Tipsy Champ');
  if (total > 0 && ratio(amountByCategory('delivery')) >= 0.3) earned.push('Delivery Addict');

  return earned;
};

/**
 * 월말에 한 번만 배지를 계산하고 DB에 반영한다.
 *
 * @param {Array}  transactions - 전체 거래 목록
 * @param {Object} user         - 현재 로그인 사용자 객체
 * @param {Function} onUpdated  - 업데이트 성공 시 호출할 콜백 (갱신된 user 객체 전달)
 */
export const tryCalculateBadges = async (transactions, user, onUpdated) => {
  if (!isLastDayOfMonth()) return;
  if (hasCalculatedThisMonth()) return;
  if (!user?.id) return;

  const now = new Date();
  const expenses = getExpensesForMonth(transactions, now.getFullYear(), now.getMonth());
  const earnedBadges = calcEarnedBadges(expenses, user.userLocation);

  const updated = await updateUserProfile(user.id, { ...user, earnedBadges });

  markCalculatedThisMonth();
  onUpdated?.(updated);
};
