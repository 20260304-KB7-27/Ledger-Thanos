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

// 오늘 날짜와 같은 연/월에 속하는 거래만 추린다.
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

/* 이번달 수입 계산 */
export const getMonthlyIncome = (transactions) => {
    return getCurrentMonthTransactions(transactions)
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
};

/* 이번달 지출 계산 */
export const getMonthlyExpense = (transactions) => {
    return getCurrentMonthTransactions(transactions)
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
};

/* 순수익 계산 */
export const getNetProfit = (income, expense) => {
    return income - expense;
};
