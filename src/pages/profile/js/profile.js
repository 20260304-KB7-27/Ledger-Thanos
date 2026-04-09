import { getDisplayImage } from '@/pages/home/home.js';

/*
 * 프로필 화면에서 사용하는 칭호 메타데이터
 * 이미지 경로는 home.js 의 getDisplayImage()를 재사용한다.
 */
export const badgeMetaList = [
  {
    key: 'Fragile Hero',
    name: '유리몸',
    rule: '병원비 10만원 이상',
  },
  {
    key: 'Coffee Zombie',
    name: '카페인 중독',
    rule: '카페 지출 20만원 이상',
  },
  {
    key: 'Coin Guardian',
    name: '짠돌이',
    rule: '월 소비 20만원 이하',
  },
  {
    key: 'Lost Explorer',
    name: '방랑자',
    rule: '거주지 소비가 20% 이하',
  },
  {
    key: 'Money Splash',
    name: '플렉스',
    rule: '월 지출 100만원 이상',
  },
  {
    key: 'Home Potato',
    name: '집순이',
    rule: '거주지 소비가 80% 이상',
  },
  {
    key: 'Tipsy Champ',
    name: '초빼이',
    rule: '술집 소비가 50% 이상',
  },
  {
    key: 'Delivery Addict',
    name: '배달 마스터',
    rule: '배달 소비가 30% 이상',
  },
];

export const seoulDistricts = [
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

// 사용자 정보를 화면에 쓰기 좋은 형태로 정리한다.
export const getProfileInfo = (user) => {
  const selectedTitle = Array.isArray(user?.selectedTitle)
    ? user.selectedTitle
    : user?.selectedTitle
      ? [user.selectedTitle]
      : [];

  return {
    nickname: user?.nickname || '닉네임',
    location: user?.userLocation
      ? `서울시 ${user.userLocation}`
      : '지역 정보 없음',
    selectedTitle,
  };
};

// selectedTitle 배열을 칭호 key 기준 배열로 맞춘다.
export const getNormalizedSelectedTitleKeys = (selectedTitle = []) => {
  return selectedTitle
    .map((title) => {
      const matchedBadge = badgeMetaList.find((badge) => badge.key === title);
      return matchedBadge?.key ?? null;
    })
    .filter(Boolean);
};

// 화면에 그릴 전체 배지 목록을 반환한다.
export const getBadgeCatalog = (selectedTitleKeys = []) => {
  return badgeMetaList.map((badge) => ({
    ...badge,
    image: getDisplayImage('title', badge.key),
    earned: selectedTitleKeys.includes(badge.key),
  }));
};

// 선택된 칭호만 상단 칭호 영역에 보여준다.
export const getSelectedTitleBadges = (badgeCatalog = [], selectedTitleKeys = []) => {
  return badgeCatalog.filter((badge) => selectedTitleKeys.includes(badge.key));
};

// 획득한 배지 개수를 센다.
export const getEarnedBadgeCount = (badgeCatalog = []) => {
  return badgeCatalog.filter((badge) => badge.earned).length;
};

// 대표 칭호는 첫 번째 선택 칭호를 사용한다.
export const getSelectedBadge = (selectedTitleBadges = []) => {
  return selectedTitleBadges[0] ?? null;
};

// 활동 요약 카드에 필요한 계산값을 만든다.
export const getProfileSummary = (transactions = []) => {
  const totalCount = transactions.length;
  const activeDays = new Set(
    transactions
      .map((item) => item.date)
      .filter(Boolean)
  ).size;
  const happyCount = transactions.filter((item) => item.emotion === 'happy').length;
  const satisfactionRate =
    totalCount === 0 ? '0%' : `${Math.round((happyCount / totalCount) * 100)}%`;

  return {
    totalCount,
    activeDays,
    satisfactionRate,
  };
};

// 실제 가입일이 없어서 가장 이른 거래일을 임시 가입일로 사용한다.
export const getMemberSinceText = (transactions = []) => {
  const firstDate = [...transactions]
    .map((item) => item.date)
    .filter(Boolean)
    .sort()[0];

  if (!firstDate) return '가입일 정보 없음';

  const date = new Date(firstDate);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 가입`;
};

// 프로필 수정 모달에서 사용하는 초기 폼 상태
export const createProfileEditForm = (user) => {
  return {
    nickname: user?.nickname ?? '',
    userLocation: user?.userLocation ?? '',
  };
};

// 프로필 수정 입력값 검증
export const validateProfileEditForm = (form) => {
  const nickname = form.nickname?.trim() ?? '';
  const userLocation = form.userLocation?.trim() ?? '';

  if (!nickname) return '닉네임을 입력해주세요.';
  if (!userLocation) return '지역을 선택해주세요.';
  if (!seoulDistricts.includes(userLocation)) {
    return '서울 자치구를 선택해주세요.';
  }

  return '';
};

// 사용자 수정 요청에 사용할 payload 생성
export const buildProfileUpdatePayload = (user, form) => {
  return {
    ...user,
    nickname: form.nickname.trim(),
    userLocation: form.userLocation.trim(),
  };
};
