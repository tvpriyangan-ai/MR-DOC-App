// Handles login, logout, and hiding admin-only buttons.

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    try {
      const data = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      localStorage.setItem('name', data.name || data.username);
      window.location.href = 'dashboard.html';
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
}

// Runs on every page that has a logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try { await api.post('/auth/logout'); } catch (err) { /* still log out locally even if this fails */ }
    localStorage.clear();
    window.location.href = 'index.html';
  });
}

// Show username + hide admin-only elements for guests
const userLabel = document.getElementById('userLabel');
if (userLabel) {
  userLabel.textContent = localStorage.getItem('name') || localStorage.getItem('username') || '';
}

const role = localStorage.getItem('role');
if (role !== 'admin') {
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
}

// If no token and we're on a protected page, send back to login
const protectedPages = ['dashboard.html', 'invoice.html'];
const currentPage = window.location.pathname.split('/').pop();
if (protectedPages.includes(currentPage) && !localStorage.getItem('token')) {
  window.location.href = 'index.html';
}
