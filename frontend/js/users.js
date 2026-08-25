// Manage Users modal (admin only): add, edit, delete individual logins

const usersBtn = document.getElementById('usersBtn');
const usersModal = document.getElementById('usersModal');
const userForm = document.getElementById('userForm');
const usersList = document.getElementById('usersList');

if (usersBtn) {
  usersBtn.addEventListener('click', () => {
    usersModal.classList.remove('hidden');
    loadUsers();
  });
}

async function loadUsers() {
  const users = await api.get('/users');
  const myUsername = localStorage.getItem('username');
  usersList.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${u.name} - ${u.username} (${u.role})</span>
      <span>
        <button onclick="editUser('${u._id}')">Edit</button>
        ${u.username === myUsername ? '' : `<button onclick="deleteUser('${u._id}')">Delete</button>`}
      </span>`;
    usersList.appendChild(li);
  });
}

async function editUser(id) {
  const name = prompt('Full name (leave blank to cancel):');
  if (!name) return;
  const username = prompt('Username:', name);
  if (!username) return;
  const role = confirm('Should this user be an Admin?\nOK = Admin, Cancel = Staff (guest)') ? 'admin' : 'guest';
  const password = prompt('New password (leave blank to keep current):') || undefined;

  await api.put(`/users/${id}`, { name, username, role, password });
  loadUsers();
}

async function deleteUser(id) {
  if (!confirm('Delete this user? They will no longer be able to log in.')) return;
  await api.delete(`/users/${id}`);
  loadUsers();
}

if (userForm) {
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const username = document.getElementById('userUsername').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;

    await api.post('/users', { name, username, password, role });
    userForm.reset();
    loadUsers();
  });
}
