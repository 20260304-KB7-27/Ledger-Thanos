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