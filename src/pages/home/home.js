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
      type은 expense만 조회
      만족 지수는 "이번달 거래 중 happy / (happy + regret) 비율"
      happy, regret 둘 다 없으면 0%로 처리
    */
    const currentMonthTransactions = getCurrentMonthTransactions(transactions).filter(
        (item) => item.type === 'expense'
    );

    // 만족
    const happyCount = currentMonthTransactions.filter(
        (item) => item.emotion === 'happy'
    ).length;

    // 후회
    const regretCount = currentMonthTransactions.filter(
        (item) => item.emotion === 'regret'
    ).length;

    const targetCount = happyCount + regretCount;

    return targetCount === 0 ? 0 : Math.round((happyCount / targetCount) * 100);
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


/*
  카테고리 메타데이터는 key 하나만 저장하고,
  화면에서 필요한 라벨/색상/아이콘은 여기에서 꺼내 쓴다.
*/
export const categoryMetaMap = {
    shopping: {
        key: 'shopping',
        label: '쇼핑',
        icon: '🛍️',
        backgroundColor: '#fce7f3',
        textColor: '#db2777',
    },
    delivery: {
        key: 'delivery',
        label: '배달',
        icon: '🛵',
        backgroundColor: '#ffedd5',
        textColor: '#ea580c',
    },
    restaurant: {
        key: 'restaurant',
        label: '식당',
        icon: '🍽️',
        backgroundColor: '#fee2e2',
        textColor: '#dc2626',
    },
    convenience: {
        key: 'convenience',
        label: '편의점',
        icon: '🏪',
        backgroundColor: '#dbeafe',
        textColor: '#2563eb',
    },
    cafe: {
        key: 'cafe',
        label: '카페',
        icon: '☕',
        backgroundColor: '#fef3c7',
        textColor: '#b45309',
    },
    bar: {
        key: 'bar',
        label: '술집',
        icon: '🍷',
        backgroundColor: '#f3e8ff',
        textColor: '#7e22ce',
    },
    necessities: {
        key: 'necessities',
        label: '생필품',
        icon: '📦',
        backgroundColor: '#ccfbf1',
        textColor: '#0f766e',
    },
    transport: {
        key: 'transport',
        label: '교통',
        icon: '🚌',
        backgroundColor: '#e0f2fe',
        textColor: '#0369a1',
    },
    hospital: {
        key: 'hospital',
        label: '병원',
        icon: '🏥',
        backgroundColor: '#dcfce7',
        textColor: '#16a34a',
    },
    other: {
        key: 'other',
        label: '기타',
        icon: '•',
        backgroundColor: '#f3f4f6',
        textColor: '#4b5563',
    },
};

/* 카테고리 key 에 해당하는 메타 정보를 반환한다. */
export const getCategoryMeta = (key) => {
    return categoryMetaMap[key] ?? categoryMetaMap.other;
};
