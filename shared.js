const users = [
  { username: 'admin1', password: 'adminpass', role: 'admin' },
  { username: 'debtor1', password: 'debtorpass', role: 'debtor' }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const uname = document.getElementById('username').value;
  const pwd = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  const user = users.find(u => u.username === uname && u.password === pwd && u.role === role);
  if (user) {
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', uname);
    window.location.href = role === 'admin' ? 'admin.html' : 'debtor.html';
  } else {
    alert('Invalid credentials');
  }
});

function renderNotifications() {
  const role = localStorage.getItem('userRole');
  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  const filtered = reminders.filter(r => role === 'debtor' ? r.email === 'debtor@example.com' : true);

  const list = document.getElementById('notificationList');
  list.innerHTML = filtered.map(r => `<li>${r.date}: ${r.message}</li>`).join('');
}

renderNotifications();

const translations = {
  en: { welcome: "Welcome to LoanPayPro", submit: "Submit Request" },
  fil: { welcome: "Maligayang pagdating sa LoanPayPro", submit: "Isumite ang Kahilingan" }
};

function setLanguage(lang) {
  localStorage.setItem('language', lang);
  applyLanguage();
}

function applyLanguage() {
  const lang = localStorage.getItem('language') || 'en';
  document.getElementById('welcomeText').innerText = translations[lang].welcome;
  document.getElementById('submitBtn').innerText = translations[lang].submit;
}