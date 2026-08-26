// Loan / Shop Rent / CB Bill / Others: each is its own row (own form + own list)
// in the right sidebar, driven by the ledger type it's tagged with in the HTML.

const ledgerReloaders = {};

function initLedgerRow(row) {
  const type = row.dataset.ledgerType;
  const label = row.dataset.ledgerLabel;

  row.innerHTML = `
    <h4>${label}</h4>
    <form class="entry-form">
      <input type="text" class="ledger-name" placeholder="Name" required>
      <input type="date" class="ledger-date" required>
      <input type="number" class="ledger-amount" placeholder="Amount" required>
      <label>Deadline</label>
      <input type="date" class="ledger-deadline">
      <button type="submit">Add</button>
    </form>
    <ul class="entry-list"></ul>
  `;

  const form = row.querySelector('form');
  const list = row.querySelector('ul');

  async function load() {
    const entries = await api.get(`/ledger?type=${type}`);
    list.innerHTML = '';
    entries.forEach(entry => {
      const li = document.createElement('li');
      const deadline = entry.deadlineDate ? new Date(entry.deadlineDate).toLocaleDateString() : '-';
      li.innerHTML = `
        <span>${entry.name} - ${entry.amount} (deadline: ${deadline})</span>
        <span><button class="btn-red" onclick="deleteLedgerEntry('${entry._id}', '${type}')">Delete</button></span>`;
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('.ledger-name').value;
    const date = form.querySelector('.ledger-date').value;
    const amount = Number(form.querySelector('.ledger-amount').value);
    const deadlineDate = form.querySelector('.ledger-deadline').value || null;

    await api.post('/ledger', { type, name, date, amount, deadlineDate });
    form.reset();
    load();
  });

  ledgerReloaders[type] = load;
  load();
}

async function deleteLedgerEntry(id, type) {
  await api.delete(`/ledger/${id}`);
  if (ledgerReloaders[type]) ledgerReloaders[type]();
}

document.querySelectorAll('.ledger-row[data-ledger-type]').forEach(initLedgerRow);
