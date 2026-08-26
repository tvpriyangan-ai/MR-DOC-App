// Loan / Shop Rent / CB Bill / Food: each is its own row (own list + collapsible
// add form), driven by the ledger type it's tagged with in the HTML. All admin-only.

const ledgerReloaders = {};

function initLedgerRow(row) {
  const type = row.dataset.ledgerType;
  const label = row.dataset.ledgerLabel;

  row.innerHTML = `
    <h4>${label}</h4>
    <ul class="entry-list"></ul>
    <button type="button" class="add-toggle-btn">+ Add ${label}</button>
    <div class="add-form-collapse">
      <form class="entry-form">
        <input type="text" class="ledger-name" placeholder="Name" required>
        <input type="date" class="ledger-date" required>
        <input type="number" class="ledger-amount" placeholder="Amount" required>
        <label>Deadline</label>
        <input type="date" class="ledger-deadline">
        <div class="form-actions">
          <button type="submit" class="btn-save">Save</button>
          <button type="button" class="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  `;

  const list = row.querySelector('ul');
  const toggleBtn = row.querySelector('.add-toggle-btn');
  const formWrap = row.querySelector('.add-form-collapse');
  const form = row.querySelector('form');
  const cancelBtn = row.querySelector('.btn-cancel');

  function openForm() {
    formWrap.classList.add('open');
    toggleBtn.style.display = 'none';
  }

  function closeForm() {
    formWrap.classList.remove('open');
    toggleBtn.style.display = '';
    form.reset();
  }

  toggleBtn.addEventListener('click', openForm);
  cancelBtn.addEventListener('click', closeForm);

  async function load() {
    const entries = await api.get(`/ledger?type=${type}`);
    list.innerHTML = '';
    entries.forEach(entry => {
      const li = document.createElement('li');
      const deadline = entry.deadlineDate ? new Date(entry.deadlineDate).toLocaleDateString() : '-';
      li.innerHTML = `
        <div class="entry-info">
          <span class="entry-main">${entry.name} - <span class="entry-amount">${entry.amount}</span></span>
          <span class="entry-deadline">Deadline: ${deadline}</span>
        </div>
        <button class="btn-red" onclick="deleteLedgerEntry('${entry._id}', '${type}')">Delete</button>`;
      list.appendChild(li);
    });
    updateContainerTotal(row.closest('.sidebar'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('.ledger-name').value;
    const date = form.querySelector('.ledger-date').value;
    const amount = Number(form.querySelector('.ledger-amount').value);
    const deadlineDate = form.querySelector('.ledger-deadline').value || null;

    await api.post('/ledger', { type, name, date, amount, deadlineDate });
    closeForm();
    load();
  });

  ledgerReloaders[type] = load;
  load();
}

async function deleteLedgerEntry(id, type) {
  await api.delete(`/ledger/${id}`);
  if (ledgerReloaders[type]) ledgerReloaders[type]();
}

if (localStorage.getItem('role') === 'admin') {
  document.querySelectorAll('.ledger-row[data-ledger-type]').forEach(initLedgerRow);
}
