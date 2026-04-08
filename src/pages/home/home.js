import baedalBadge from '@/assets/badge/baedal.png';
import caffeineBadge from '@/assets/badge/caffeine.png';
import chobaiBadge from '@/assets/badge/chobai.png';
import flexBadge from '@/assets/badge/flex.png';
import glassBadge from '@/assets/badge/glass.png';
import houseBadge from '@/assets/badge/house.png';
import jjanBadge from '@/assets/badge/jjan.png';
import tripBadge from '@/assets/badge/trip.png';

// 최근 거래
export const getRecentTransactions = (transactions, limit = 5) => {
  return [...transactions]
    .sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;

      return Number(b.id) - Number(a.id);
    })
    .slice(0, limit);
};

// 오늘 날짜와 같은 연/월에 속하는 거래만
export const getCurrentMonthTransactions = (transactions) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter((item) => {
        if (!item.date) return false;

        const itemDate = new Date(item.date);

        return (
            itemDate.getFullYear() === currentYear &&
            itemDate.getMonth() === currentMonth
        );
    });
};

// 이번달 수입 계산
export const getMonthlyIncome = (transactions) => {
    return getCurrentMonthTransactions(transactions)
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
};

// 이번달 지출 계산
export const getMonthlyExpense = (transactions) => {
    return getCurrentMonthTransactions(transactions)
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
};

// 순수익 계산
export const getNetProfit = (income, expense) => {
    return income - expense;
};

// 이번달 만족 지수 계산
export const getMonthlySatisfactionScore = (transactions) => {
    /*
      만족 지수는 "이번달 거래 중 emotion 이 happy 인 거래 비율"이다.
      이번달 거래가 하나도 없으면 0%로 처리한다.
    */
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);

    if (currentMonthTransactions.length === 0) {
        return 0;
    }

    const happyCount = currentMonthTransactions.filter(
        (item) => item.emotion === 'happy'
    ).length;

    return Math.round((happyCount / currentMonthTransactions.length) * 100);
};


// 이번달 요약 카드에서 사용하는 모든 계산 함수
export const getMonthlySummary = (transactions) => {
    // 만족한 소비 계산 (emotion : happy)
    const happyCount = transactions.filter((item) => item.emotion === 'happy').length;

    // 거래에 제일 많은  category 별 건수
    const categoryMap = transactions.reduce((acc, item) => {
        const key = item.category ?? '기타';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

    const [topCategoryLabel = '-', topCategoryCount = 0] =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] ?? [];

    return {
        totalCount: transactions.length,
        happyCount,
        topCategory: {
            label: topCategoryLabel,
            count: topCategoryCount,
        }
    };
};

// TODO::이후 수정될 수 있음.
/*
집순이      'Home Potato': houseBadge,
플렉스      'Money Splash': flexBadge,
짠돌이      'Coin Guardian': jjanBadge,
방랑자      'Lost Explorer': tripBadge,
초빼이      'Tipsy Champ': chobaiBadge,
배달 마스터 'Delivery Addict': baedalBadge,
카페인 중독 'Coffee Zombie': caffeineBadge,
유리몸      'Fragile Hero': glassBadge,
 */
// 칭호 이미지는 기존 연결
const titleImageMap = {
    'Home Potato': houseBadge,
    'Money Splash': flexBadge,
    'Coin Guardian': jjanBadge,
    'Lost Explorer': tripBadge,
    'Tipsy Champ': chobaiBadge,
    'Delivery Addict': baedalBadge,
    'Coffee Zombie': caffeineBadge,
    'Fragile Hero': glassBadge,
};

// 칭호 key 에 맞는 이미지 URL 반환
export const getDisplayImage = (type, key) => {
    if (type === 'title') {
        return titleImageMap[key] ?? '';
    }

    return '';
};
