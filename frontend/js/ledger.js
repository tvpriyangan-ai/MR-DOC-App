// Loans / Shop Rent / CB Bill sidebar: load, add, delete

const ledgerForm = document.getElementById('ledgerForm');
const ledgerList = document.getElementById('ledgerList');

async function loadLedger() {
  const entries = await api.get('/ledger');
  ledgerList.innerHTML = '';
  entries.forEach(entry => {
    const li = document.createElement('li');
    const deadline = entry.deadlineDate ? new Date(entry.deadlineDate).toLocaleDateString() : '-';
    li.innerHTML = `
      <span>[${entry.type}] ${entry.name} - ${entry.amount} (deadline: ${deadline})</span>
      <span>
        <button onclick="deleteLedgerEntry('${entry._id}')">Delete</button>
      </span>`;
    ledgerList.appendChild(li);
  });
}

async function deleteLedgerEntry(id) {
  await api.delete(`/ledger/${id}`);
  loadLedger();
}

if (ledgerForm) {
  ledgerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('ledgerType').value;
    const name = document.getElementById('ledgerName').value;
    const date = document.getElementById('ledgerDate').value;
    const amount = Number(document.getElementById('ledgerAmount').value);
    const deadlineDate = document.getElementById('ledgerDeadline').value || null;

    await api.post('/ledger', { type, name, date, amount, deadlineDate });
    ledgerForm.reset();
    loadLedger();
  });

  loadLedger();
}
