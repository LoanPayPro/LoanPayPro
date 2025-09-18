const debtors = JSON.parse(localStorage.getItem('debtors')) || [];

function renderDebtorTable() {
  const tbody = document.getElementById('debtorTableBody');
  tbody.innerHTML = '';
  debtors.forEach(d => {
    const row = `<tr>
      <td>${d.name}</td><td>${d.contact}</td><td>${d.email}</td><td>${d.address}</td>
      <td>${d.status}</td><td>${d.loanBalance}</td><td>${d.savings}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

renderDebtorTable();

function renderLoanRequests() {
  const requests = JSON.parse(localStorage.getItem('loanRequests')) || [];
  const container = document.getElementById('loanManagement');
  container.innerHTML = '<h2>Loan Requests</h2>';
  requests.forEach((r, i) => {
    container.innerHTML += `
      <div>
        Amount: ₱${r.amount}, Term: ${r.term} months, Status: ${r.status}
        <button onclick="approveLoan(${i})">Approve</button>
      </div>`;
  });
}

function approveLoan(index) {
  const requests = JSON.parse(localStorage.getItem('loanRequests'));
  requests[index].status = 'Approved';
  localStorage.setItem('loanRequests', JSON.stringify(requests));
  renderLoanRequests();
}

renderLoanRequests();

function generatePaymentLink(amount) {
  // Placeholder for API call
  alert(`Redirecting to GCash/PayMaya for ₱${amount}`);
  window.location.href = `https://paymentgateway.com/pay?amount=${amount}`;
}

function calculateLoan() {
  const P = parseFloat(document.getElementById('principal').value);
  const r = parseFloat(document.getElementById('rate').value) / 12 / 100;
  const n = parseInt(document.getElementById('term').value);
  const penaltyRate = parseFloat(document.getElementById('penaltyRate').value) / 100;

  const amortization = (P * r) / (1 - Math.pow(1 + r, -n));
  const totalPayment = amortization * n;
  const penalty = P * penaltyRate;

  document.getElementById('loanResult').innerHTML = `
    Monthly Amortization: ₱${amortization.toFixed(2)}<br>
    Total Payment: ₱${totalPayment.toFixed(2)}<br>
    Penalty (if overdue): ₱${penalty.toFixed(2)}
  `;
}

function generateSchedule() {
  const frequency = document.getElementById('frequency').value;
  const startDate = new Date();
  const term = 12; // months
  const schedule = [];
  let currentDate = new Date(startDate);

  const increment = {
    daily: 1,
    weekly: 7,
    monthly: 30
  }[frequency];

  for (let i = 0; i < term * (30 / increment); i++) {
    currentDate.setDate(currentDate.getDate() + increment);
    schedule.push(new Date(currentDate).toLocaleDateString());
  }

  const list = document.getElementById('scheduleList');
  list.innerHTML = schedule.map(date => `<li>${date}</li>`).join('');
}

function computeDividends() {
  const dividendRate = 0.05; // 5%
  savingsData.forEach(user => {
    const totalSavings = user.deposits.reduce((a, b) => a + b, 0) - user.withdrawals.reduce((a, b) => a + b, 0);
    const dividend = totalSavings * dividendRate;
    console.log(`${user.name} - Savings: ₱${totalSavings}, Dividend: ₱${dividend.toFixed(2)}`);
  });
}

function renderSavingsTable() {
  const tbody = document.getElementById('savingsTableBody');
  const dividendRate = 0.05;

  tbody.innerHTML = '';
  savingsData.forEach(user => {
    const totalDeposits = user.deposits.reduce((a, b) => a + b, 0);
    const totalWithdrawals = user.withdrawals.reduce((a, b) => a + b, 0);
    const netSavings = totalDeposits - totalWithdrawals;
    const dividend = netSavings * dividendRate;

    tbody.innerHTML += `<tr>
      <td>${user.name}</td>
      <td>₱${totalDeposits}</td>
      <td>₱${totalWithdrawals}</td>
      <td>₱${netSavings}</td>
      <td>₱${dividend.toFixed(2)}</td>
    </tr>`;
  });
}

renderSavingsTable();

function renderPendingLoans() {
  const requests = JSON.parse(localStorage.getItem('loanRequests')) || [];
  const container = document.getElementById('pendingLoans');
  container.innerHTML = '';

  requests.forEach((r, i) => {
    if (r.status === 'Pending') {
      container.innerHTML += `
        <div>
          <strong>Debtor:</strong> ${r.name || 'Unknown'}<br>
          <strong>Amount:</strong> ₱${r.amount}<br>
          <strong>Term:</strong> ${r.term} months<br>
          <button onclick="releaseLoan(${i})">Approve & Release</button>
        </div><hr>`;
    }
  });
}

function releaseLoan(index) {
  const requests = JSON.parse(localStorage.getItem('loanRequests'));
  requests[index].status = 'Released';
  requests[index].releaseDate = new Date().toISOString();
  localStorage.setItem('loanRequests', JSON.stringify(requests));
  alert('Loan released!');
  renderPendingLoans();
}

renderPendingLoans();

function exportCSV(data, filename) {
  const csv = data.map(row => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function renderRiskDashboard() {
  const tbody = document.getElementById('riskTableBody');
  tbody.innerHTML = '';
  creditData.forEach(user => {
    const risk = user.score >= 700 ? 'Low' : user.score >= 600 ? 'Medium' : 'High';
    tbody.innerHTML += `<tr>
      <td>${user.name}</td>
      <td>${user.score}</td>
      <td>${risk}</td>
    </tr>`;
  });
}

renderRiskDashboard();

function sendReminder() {
  const email = document.getElementById('debtorEmail').value;
  const message = document.getElementById('messageContent').value;

  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  reminders.push({ email, message, date: new Date().toISOString() });
  localStorage.setItem('reminders', JSON.stringify(reminders));

  alert(`Reminder sent to ${email}`);
}

function renderAnalytics() {
  const debtors = JSON.parse(localStorage.getItem('debtors')) || [];
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];

  const totalLoans = loans.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
  const activeDebtors = debtors.filter(d => d.status === 'Active').length;

  document.getElementById('analyticsSummary').innerHTML = `
    Total Loan Volume: ₱${totalLoans.toFixed(2)}<br>
    Active Debtors: ${activeDebtors}<br>
    Total Requests: ${loans.length}
  `;
}

renderAnalytics();

if (localStorage.getItem('userRole') !== 'admin') {
  alert('Access denied');
  window.location.href = 'index.html';
}

function exportDebtors() {
  const debtors = JSON.parse(localStorage.getItem('debtors')) || [];
  const csv = debtors.map(d => `${d.name},${d.email},${d.loanBalance},${d.savings}`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'debtors.csv';
  link.click();
}

function logAction(action) {
  const logs = JSON.parse(localStorage.getItem('auditLogs')) || [];
  logs.push({ action, timestamp: new Date().toISOString() });
  localStorage.setItem('auditLogs', JSON.stringify(logs));
}

function renderLogs() {
  const logs = JSON.parse(localStorage.getItem('auditLogs')) || [];
  const list = document.getElementById('logList');
  list.innerHTML = logs.map(log => `<li>${log.timestamp}: ${log.action}</li>`).join('');
}

// Example usage:
logAction('Approved loan for Maria Santos');
renderLogs();

function renderLoanChart() {
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];
  const monthlyTotals = {};

  loans.forEach(l => {
    const month = new Date(l.releaseDate || l.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(l.amount || 0);
  });

  const chart = document.getElementById('loanChart');
  chart.innerHTML = Object.entries(monthlyTotals).map(([month, total]) => {
    const barHeight = Math.min(total / 100, 100);
    return `<div style="display:inline-block;width:40px;height:${barHeight}px;background:#4caf50;margin:2px;" title="${month}: ₱${total}"></div>`;
  }).join('');
}

renderLoanChart();

function renderWithdrawals() {
  const requests = JSON.parse(localStorage.getItem('withdrawalRequests')) || [];
  const container = document.getElementById('withdrawalList');
  container.innerHTML = '';

  requests.forEach((r, i) => {
    if (r.status === 'Pending') {
      container.innerHTML += `
        <div>
          ₱${r.amount} requested on ${new Date(r.date).toLocaleDateString()}
          <button onclick="approveWithdrawal(${i})">Approve</button>
        </div><hr>`;
    }
  });
}

function approveWithdrawal(index) {
  const requests = JSON.parse(localStorage.getItem('withdrawalRequests'));
  requests[index].status = 'Approved';
  localStorage.setItem('withdrawalRequests', JSON.stringify(requests));
  alert('Withdrawal approved');
  renderWithdrawals();
}

renderWithdrawals();

function restructureLoan() {
  const newTerm = parseInt(document.getElementById('newTerm').value);
  const newRate = parseFloat(document.getElementById('newRate').value) / 12 / 100;
  const principal = 4500; // example balance

  const newAmortization = (principal * newRate) / (1 - Math.pow(1 + newRate, -newTerm));
  document.getElementById('restructureResult').innerHTML = `
    New Monthly Payment: ₱${newAmortization.toFixed(2)}<br>
    New Total Payable: ₱${(newAmortization * newTerm).toFixed(2)}
  `;
}

function renderDocuments() {
  const uploads = JSON.parse(localStorage.getItem('uploads')) || [];
  const list = document.getElementById('docList');
  list.innerHTML = uploads.map(doc => `
    <li>${doc.name} — uploaded on ${new Date(doc.date).toLocaleDateString()}</li>
  `).join('');
}

renderDocuments();

function refreshDashboard() {
  renderAnalytics();
  renderLoanChart();
  renderWithdrawals();
  renderDocuments();
}

setInterval(refreshDashboard, 10000); // refresh every 10 seconds

function updateUnreadCount() {
  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  const unread = reminders.filter(r => !r.read).length;
  document.getElementById('unreadCount').innerText = unread > 0 ? `(${unread})` : '';
}

updateUnreadCount();

function createUser() {
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const role = document.getElementById('newRole').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.push({ username, password, role });
  localStorage.setItem('users', JSON.stringify(users));

  alert(`User ${username} created as ${role}`);
}

const loans = [
  { name: 'Juan Dela Cruz', dueDate: '2025-09-10', status: 'Overdue' },
  { name: 'Maria Santos', dueDate: '2025-09-25', status: 'Pending' }
];

function renderDelinquencyAlerts() {
  const today = new Date();
  const list = document.getElementById('delinquentList');
  list.innerHTML = loans
    .filter(l => new Date(l.dueDate) < today && l.status === 'Overdue')
    .map(l => `<li>${l.name} — Due: ${l.dueDate}</li>`)
    .join('');
}

renderDelinquencyAlerts();

function applyFilters() {
  const month = document.getElementById('filterMonth').value;
  const status = document.getElementById('filterStatus').value;
  const debtors = JSON.parse(localStorage.getItem('debtors')) || [];

  const filtered = debtors.filter(d => {
    const matchStatus = status === 'all' || d.status === status;
    const matchMonth = !month || new Date(d.createdAt || '').toISOString().slice(0, 7) === month;
    return matchStatus && matchMonth;
  });

  document.getElementById('filteredResults').innerHTML = `
    ${filtered.length} result(s) found.
    <ul>${filtered.map(d => `<li>${d.name} — ${d.status}</li>`).join('')}</ul>
  `;
}

function archiveLoan(loanId) {
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];
  const archived = JSON.parse(localStorage.getItem('archivedLoans')) || [];

  const loan = loans.splice(loanId, 1)[0];
  archived.push(loan);

  localStorage.setItem('loanRequests', JSON.stringify(loans));
  localStorage.setItem('archivedLoans', JSON.stringify(archived));
  renderArchivedLoans();
}

function renderArchivedLoans() {
  const archived = JSON.parse(localStorage.getItem('archivedLoans')) || [];
  const list = document.getElementById('archivedLoans');
  list.innerHTML = archived.map((l, i) => `
    <li>
      ₱${l.amount} — ${l.term} months
      <button onclick="recoverLoan(${i})">Recover</button>
    </li>
  `).join('');
}

function recoverLoan(index) {
  const archived = JSON.parse(localStorage.getItem('archivedLoans'));
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];

  const loan = archived.splice(index, 1)[0];
  loans.push(loan);

  localStorage.setItem('loanRequests', JSON.stringify(loans));
  localStorage.setItem('archivedLoans', JSON.stringify(archived));
  renderArchivedLoans();
}

renderArchivedLoans();

function renderKPIs() {
  const debtors = JSON.parse(localStorage.getItem('debtors')) || [];
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];

  const totalLoanVolume = loans.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
  const activeDebtors = debtors.filter(d => d.status === 'Active').length;
  const overdueLoans = loans.filter(l => l.status === 'Overdue').length;

  document.getElementById('kpiWidgets').innerHTML = `
    <div>📈 Total Loan Volume: ₱${totalLoanVolume.toFixed(2)}</div>
    <div>👥 Active Debtors: ${activeDebtors}</div>
    <div>⚠️ Overdue Loans: ${overdueLoans}</div>
  `;
}

renderKPIs();

function sendBroadcast() {
  const message = document.getElementById('broadcastMessage').value;
  const broadcasts = JSON.parse(localStorage.getItem('broadcasts')) || [];
  broadcasts.push({ message, date: new Date().toISOString() });
  localStorage.setItem('broadcasts', JSON.stringify(broadcasts));
  alert('Broadcast sent!');
}

let taggedLoans = JSON.parse(localStorage.getItem('taggedLoans')) || [];

function applyTag() {
  const tag = document.getElementById('loanTagInput').value;
  taggedLoans.push({ id: Date.now(), amount: 10000, tag });
  localStorage.setItem('taggedLoans', JSON.stringify(taggedLoans));
  renderTaggedLoans();
}

function filterByTag(tag) {
  const filtered = tag ? taggedLoans.filter(l => l.tag === tag) : taggedLoans;
  const list = document.getElementById('taggedLoans');
  list.innerHTML = filtered.map(l => `<li>₱${l.amount} — ${l.tag}</li>`).join('');
}

function renderTaggedLoans() {
  filterByTag('');
}

renderTaggedLoans();

function exportFilteredLoans() {
  const tag = document.getElementById('exportTag').value;
  const loans = JSON.parse(localStorage.getItem('taggedLoans')) || [];
  const filtered = tag ? loans.filter(l => l.tag === tag) : loans;

  const csv = filtered.map(l => `${l.amount},${l.tag}`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'filtered_loans.csv';
  link.click();
}

function generateReport() {
  const period = document.getElementById('reportPeriod').value;
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];

  const now = new Date();
  const filtered = loans.filter(l => {
    const date = new Date(l.releaseDate || l.date);
    if (period === 'monthly') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    } else {
      const quarter = Math.floor(now.getMonth() / 3);
      const loanQuarter = Math.floor(date.getMonth() / 3);
      return loanQuarter === quarter && date.getFullYear() === now.getFullYear();
    }
  });

  const total = filtered.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
  document.getElementById('reportOutput').innerHTML = `
    ${filtered.length} loan(s) found<br>
    Total Volume: ₱${total.toFixed(2)}
  `;
}

function populateLoanSelector() {
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];
  const selector = document.getElementById('loanSelector');
  selector.innerHTML = loans.map((l, i) => `<option value="${i}">Loan ₱${l.amount} — ${l.status}</option>`).join('');
}

function updateLoanStatus() {
  const index = document.getElementById('loanSelector').value;
  const newStatus = document.getElementById('statusSelector').value;
  const loans = JSON.parse(localStorage.getItem('loanRequests')) || [];

  loans[index].status = newStatus;
  localStorage.setItem('loanRequests', JSON.stringify(loans));
  document.getElementById('statusUpdateMsg').innerText = `Status updated to "${newStatus}"`;
  populateLoanSelector();
}

populateLoanSelector();

const role = localStorage.getItem('userRole');
if ((window.location.pathname.includes('admin') && role !== 'admin') ||
    (window.location.pathname.includes('debtor') && role !== 'debtor')) {
  alert('Access denied. Please log in with the correct role.');
  window.location.href = 'index.html';
}

function toggleTheme() {
  const theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

function applyTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = theme;
}

applyTheme();