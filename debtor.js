document.getElementById('loanForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const request = {
    amount: document.getElementById('loanAmount').value,
    term: document.getElementById('loanTerm').value,
    status: 'Pending'
  };
  const requests = JSON.parse(localStorage.getItem('loanRequests')) || [];
  requests.push(request);
  localStorage.setItem('loanRequests', JSON.stringify(requests));
  alert('Loan request submitted!');
});

const dueDate = new Date('2025-09-25');
const today = new Date();
const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

if (diffDays <= 3) {
  document.getElementById('reminders').innerHTML = `<p>📢 Your loan is due in ${diffDays} day(s)!</p>`;
}

function showLoanDetails() {
  document.getElementById('loanDetails').innerHTML = `
    Loan Amount: ₱${loan.amount}<br>
    Remaining Balance: ₱${loan.balance}
  `;
}

function showReminder() {
  const today = new Date();
  const due = new Date(loan.dueDate);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff <= 3) {
    document.getElementById('dueReminder').innerHTML = `📢 Your loan is due in ${diff} day(s)!`;
  }
}

showLoanDetails();
showReminder();

function payWithGCash(amount) {
  fetch('https://api.paymentgateway.com/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, method: 'gcash' })
  })
  .then(res => res.json())
  .then(data => window.location.href = data.paymentUrl);
}

const payments = [
  { amount: 1000, date: '2025-08-01', status: 'Partial' },
  { amount: 2000, date: '2025-08-15', status: 'Fully Paid' }
];

function renderPayments() {
  const list = document.getElementById('paymentList');
  list.innerHTML = payments.map(p => `
    <li>
      ₱${p.amount} on ${p.date} — ${p.status}
    </li>
  `).join('');
}

renderPayments();

function estimateLoan() {
  const P = parseFloat(document.getElementById('loanAmount').value);
  const r = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
  const n = parseInt(document.getElementById('termMonths').value);

  const monthly = (P * r) / (1 - Math.pow(1 + r, -n));
  const total = monthly * n;

  document.getElementById('loanEstimateResult').innerHTML = `
    Monthly Payment: ₱${monthly.toFixed(2)}<br>
    Total Payable: ₱${total.toFixed(2)}
  `;
}

function uploadDocument() {
  const file = document.getElementById('docFile').files[0];
  if (!file) return alert('No file selected');

  const uploads = JSON.parse(localStorage.getItem('uploads')) || [];
  uploads.push({ name: file.name, date: new Date().toISOString() });
  localStorage.setItem('uploads', JSON.stringify(uploads));

  document.getElementById('uploadStatus').innerText = `Uploaded: ${file.name}`;
}

if (localStorage.getItem('userRole') !== 'admin') {
  alert('Access denied');
  window.location.href = 'index.html';
}

const transactions = [
  { type: 'Loan Payment', amount: 1000, date: '2025-08-01' },
  { type: 'Savings Deposit', amount: 500, date: '2025-08-10' }
];

function renderTransactions() {
  const list = document.getElementById('transactionList');
  list.innerHTML = transactions.map(t => `
    <li>${t.date}: ${t.type} — ₱${t.amount}</li>
  `).join('');
}

renderTransactions();

function submitWithdrawal() {
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  const requests = JSON.parse(localStorage.getItem('withdrawalRequests')) || [];
  requests.push({ amount, status: 'Pending', date: new Date().toISOString() });
  localStorage.setItem('withdrawalRequests', JSON.stringify(requests));
  document.getElementById('withdrawalStatus').innerText = `Request submitted for ₱${amount}`;
}

function saveProfile() {
  const profile = {
    name: document.getElementById('debtorName').value,
    email: document.getElementById('debtorEmail').value,
    contact: document.getElementById('debtorContact').value
  };
  localStorage.setItem('debtorProfile', JSON.stringify(profile));
  alert('Profile updated!');
}

function setGoal() {
  const goal = parseFloat(document.getElementById('goalAmount').value);
  localStorage.setItem('savingsGoal', goal);
  updateGoalProgress();
}

function updateGoalProgress() {
  const goal = parseFloat(localStorage.getItem('savingsGoal')) || 0;
  const savings = 3200; // example current savings
  const percent = Math.min((savings / goal) * 100, 100);

  document.getElementById('goalProgress').innerHTML = `
    Goal: ₱${goal}<br>
    Current Savings: ₱${savings}<br>
    Progress: ${percent.toFixed(1)}%
    <div style="background:#ccc;width:100%;height:10px;">
      <div style="background:#4caf50;width:${percent}%;height:10px;"></div>
    </div>
  `;
}

updateGoalProgress();

const schedule = [
  { date: '2025-09-25', amount: 1000, status: 'Pending' },
  { date: '2025-10-25', amount: 1000, status: 'Pending' }
];

function renderSchedule() {
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = schedule.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>₱${s.amount}</td>
      <td>${s.status}</td>
    </tr>
  `).join('');
}

renderSchedule();

function uploadPayment() {
  const file = document.getElementById('paymentFile').files[0];
  if (!file) return alert('No file selected');

  const confirmations = JSON.parse(localStorage.getItem('paymentConfirmations')) || [];
  confirmations.push({ name: file.name, date: new Date().toISOString() });
  localStorage.setItem('paymentConfirmations', JSON.stringify(confirmations));

  document.getElementById('paymentStatus').innerText = `Uploaded: ${file.name}`;
}

const loanStages = [
  { label: 'Application Submitted', date: '2025-08-01' },
  { label: 'Approved', date: '2025-08-03' },
  { label: 'Released', date: '2025-08-05' },
  { label: 'First Payment Made', date: '2025-09-05' }
];

function renderTimeline() {
  const list = document.getElementById('timelineSteps');
  list.innerHTML = loanStages.map(stage => `
    <li>
      <strong>${stage.label}</strong><br>
      <small>${new Date(stage.date).toLocaleDateString()}</small>
    </li>
  `).join('');
}

renderTimeline();

function renderBroadcasts() {
  const broadcasts = JSON.parse(localStorage.getItem('broadcasts')) || [];
  const list = document.getElementById('broadcastList');
  list.innerHTML = broadcasts.map(b => `
    <li>${new Date(b.date).toLocaleDateString()}: ${b.message}</li>
  `).join('');
}

renderBroadcasts();

const checklist = [
  { task: 'Update Profile', done: true },
  { task: 'Set Savings Goal', done: true },
  { task: 'Submit Loan Request', done: false },
  { task: 'Upload Payment Confirmation', done: false }
];

function renderChecklist() {
  const list = document.getElementById('checklistItems');
  list.innerHTML = checklist.map(item => `
    <li>
      ${item.done ? '✅' : '⬜'} ${item.task}
    </li>
  `).join('');
}

renderChecklist();

const savingsHistory = [
  { type: 'Deposit', amount: 1000, date: '2025-08-01' },
  { type: 'Withdrawal', amount: 300, date: '2025-08-15' }
];

function renderSavingsHistory() {
  const list = document.getElementById('savingsList');
  list.innerHTML = savingsHistory.map(s => `
    <li>${s.date}: ${s.type} — ₱${s.amount}</li>
  `).join('');
}

renderSavingsHistory();

function renderSummaryCard() {
  const loanBalance = 4500;
  const savings = 3200;
  const nextDue = '2025-09-25';

  document.getElementById('summaryBox').innerHTML = `
    <strong>Loan Balance:</strong> ₱${loanBalance}<br>
    <strong>Savings:</strong> ₱${savings}<br>
    <strong>Next Due Date:</strong> ${nextDue}
  `;
}

renderSummaryCard();

function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  const newTheme = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme();
}

function applyTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.style.background = theme === 'dark' ? '#222' : '#fff';
  document.body.style.color = theme === 'dark' ? '#eee' : '#000';
}

applyTheme();

function savePaymentMethod(method) {
  localStorage.setItem('paymentMethod', method);
  renderSelectedMethod();
}

function renderSelectedMethod() {
  const method = localStorage.getItem('paymentMethod') || 'gcash';
  const label = {
    gcash: 'GCash',
    paymaya: 'PayMaya',
    bank: 'Bank Transfer',
    cash: 'Cash (In-Person)'
  }[method];

  document.getElementById('selectedMethod').innerText = `Selected Method: ${label}`;
  document.getElementById('methodSelector').value = method;
}

renderSelectedMethod();

const role = localStorage.getItem('userRole');
if ((window.location.pathname.includes('admin') && role !== 'admin') ||
    (window.location.pathname.includes('debtor') && role !== 'debtor')) {
  alert('Access denied. Please log in with the correct role.');
  window.location.href = 'index.html';
}