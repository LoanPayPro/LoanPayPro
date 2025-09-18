// Sample user database (can be replaced with dynamic registration)
const defaultUsers = [
  { username: 'admin1', password: 'adminpass', role: 'admin' },
  { username: 'debtor1', password: 'debtorpass', role: 'debtor' }
];

// Save default users if not already present
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(defaultUsers));
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const uname = document.getElementById('username').value.trim();
  const pwd = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === uname && u.password === pwd && u.role === role);

  if (user) {
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', uname);
    window.location.href = role === 'admin' ? 'admin.html' : 'debtor.html';
  } else {
    document.getElementById('loginMessage').innerText = '❌ Invalid credentials or role mismatch.';
  }
});