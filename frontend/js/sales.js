// Day-by-day sales totals (admin only). Auto-accumulated from invoice
// finalAmount whenever an invoice is created (see invoiceController.js),
// with a manual edit override per day for corrections/offline sales.

const salesBtn = document.getElementById('salesBtn');
const salesModal = document.getElementById('salesModal');
const salesListEl = document.getElementById('salesList');
const salesSelectedInfo = document.getElementById('salesSelectedInfo');

let salesChartInstance = null;

if (salesBtn) {
  salesBtn.addEventListener('click', () => {
    salesModal.classList.remove('hidden');
    loadSales();
  });
}

function formatSalesDate(dateKey) {
  return new Date(dateKey).toLocaleDateString();
}

function formatChartLabel(dateKey) {
  return new Date(dateKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function computeSalesStats(sales) {
  const totalAll = sales.reduce((sum, s) => sum + s.amount, 0);

  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const totalMonth = sales
    .filter(s => s.date.startsWith(currentMonthPrefix))
    .reduce((sum, s) => sum + s.amount, 0);

  return { totalAll, totalMonth };
}

function renderSalesChart(sales) {
  const canvas = document.getElementById('salesChart');
  if (salesChartInstance) {
    salesChartInstance.destroy();
    salesChartInstance = null;
  }
  salesSelectedInfo.textContent = '';

  if (sales.length === 0) return;

  // Chart reads left-to-right oldest -> newest
  const ascending = [...sales].sort((a, b) => a.date.localeCompare(b.date));
  const labels = ascending.map(s => formatChartLabel(s.date));
  const amounts = ascending.map(s => s.amount);
  const thousands = amounts.map(a => a / 1000);

  salesChartInstance = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Sales (thousands)',
        data: thousands,
        backgroundColor: '#4FC3F7',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Rs. ${amounts[ctx.dataIndex].toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#BDBDBD' },
          grid: { color: '#333' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#BDBDBD' },
          grid: { color: '#333' },
          title: { display: true, text: 'Amount (thousands)', color: '#BDBDBD' }
        }
      },
      onClick: (evt, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        salesSelectedInfo.textContent = `${labels[idx]}: Rs. ${amounts[idx].toLocaleString()}`;
      }
    }
  });
}

async function loadSales() {
  const sales = await api.get('/sales');

  const { totalAll, totalMonth } = computeSalesStats(sales);
  document.getElementById('salesTotalAll').textContent = totalAll.toLocaleString();
  document.getElementById('salesTotalMonth').textContent = totalMonth.toLocaleString();

  renderSalesChart(sales);

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
