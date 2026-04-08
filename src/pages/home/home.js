/* 최근 거래 */
export const getRecentTransactions = (transactions, limit = 5) => {
  return [...transactions]
    .sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;

      return Number(b.id) - Number(a.id);
    })
    .slice(0, limit);
};