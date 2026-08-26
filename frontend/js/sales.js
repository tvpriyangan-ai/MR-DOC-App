// Day-by-day sales totals (admin only). Auto-accumulated from invoice
// finalAmount whenever an invoice is created (see invoiceController.js),
// with a manual edit override per day for corrections/offline sales.

const salesBtn = document.getElementById('salesBtn');
const salesModal = document.getElementById('salesModal');
const salesListEl = document.getElementById('salesList');

if (salesBtn) {
  salesBtn.addEventListener('click', () => {
    salesModal.classList.remove('hidden');
    loadSales();
  });
}

function formatSalesDate(dateKey) {
  return new Date(dateKey).toLocaleDateString();
}

async function loadSales() {
  const sales = await api.get('/sales');
  salesListEl.innerHTML = '';
  if (sales.length === 0) {
    salesListEl.innerHTML = '<li class="empty-state">No sales recorded yet</li>';
    return;
  }
  sales.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${formatSalesDate(s.date)} - <span class="entry-amount">${s.amount}</span></span>
      <span><button onclick="editSales('${s.date}', ${s.amount})">Edit</button></span>`;
    salesListEl.appendChild(li);
  });
}

async function editSales(date, currentAmount) {
  const input = prompt(`Set total sales for ${formatSalesDate(date)}:`, currentAmount);
  if (input === null) return;
  const amount = Number(input);
  if (Number.isNaN(amount)) return;

  await api.put(`/sales/${date}`, { amount });
  loadSales();
}

// Generic close button, shared by every modal (Sales / Manage Users / History / Customer)
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.target).classList.add('hidden');
  });
});
