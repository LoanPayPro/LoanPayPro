function calculateLoan(principal, rate, termMonths) {
  const monthlyRate = rate / 12 / 100;
  const amortization = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
  return amortization.toFixed(2);
}