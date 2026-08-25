// Activity History modal (admin only): shows the last 200 logged actions

const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');

const ACTION_ICONS = {
  login: '🔑',
  logout: '🔒',
  purchase_add: '🛒',
  purchase_update: '🛒',
  purchase_delete: '🗑️',
  ledger_add: '💳',
  ledger_update: '💳',
  ledger_delete: '🗑️',
  invoice_create: '🧾',
  salary_add: '💰',
  salary_update: '💰',
  shopvalue_add: '🏬',
  shopvalue_update: '🏬',
  shopvalue_delete: '🗑️',
  user_add: '👤',
  user_update: '👤',
  user_delete: '🗑️'
};

if (historyBtn) {
  historyBtn.addEventListener('click', () => {
    historyModal.classList.remove('hidden');
    loadHistory();
  });
}

async function loadHistory() {
  const logs = await api.get('/activity-logs');
  historyList.innerHTML = '';
  if (logs.length === 0) {
    historyList.innerHTML = '<li class="empty-state">No activity yet</li>';
    return;
  }
  logs.forEach(log => {
    const li = document.createElement('li');
    const icon = ACTION_ICONS[log.action] || '•';
    const time = new Date(log.timestamp).toLocaleString();
    li.innerHTML = `
      <span>${icon} <strong>${log.username}</strong> - ${log.details}</span>
      <span class="history-time">${time}</span>`;
    historyList.appendChild(li);
  });
}
