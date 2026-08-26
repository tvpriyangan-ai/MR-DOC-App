// Invoice page: add material rows, calculate totals, save invoice, download as JPEG

const itemsBody = document.getElementById('itemsBody');
const addItemBtn = document.getElementById('addItemBtn');
const invoiceForm = document.getElementById('invoiceForm');
const discountInput = document.getElementById('discount');
const totalDisplay = document.getElementById('totalDisplay');
const finalDisplay = document.getElementById('finalDisplay');
const downloadJpegBtn = document.getElementById('downloadJpegBtn');

const MATERIALS = ['T-shirt', 'Shirt', 'Jeans', 'Shorts', 'Other'];

const MATERIAL_ICONS = {
  'T-shirt': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 4L4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-4L8 4Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  'Shirt': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 4L6 6 4 9l2 2 2-1v10h8V10l2 1 2-2-2-3-3-2-2 2h-2L9 4Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M10 4l2 3 2-3" stroke="currentColor" stroke-width="1.2"/></svg>',
  'Jeans': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 3h10l1 8-1 10h-4l-1-8-1 8H7L6 11 7 3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  'Shorts': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4h12l1 6-1 3h-3l-1-4-1 4H9l-1-4-1 4H4l-1-3 3-6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  'Other': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="13" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M4 10h16" stroke="currentColor" stroke-width="1.4"/></svg>'
};

function formatMoney(n) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addItemRow() {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>
      <select class="item-material">
        ${MATERIALS.map(m => `<option value="${m}">${m}</option>`).join('')}
      </select>
    </td>
    <td><input type="number" class="item-price" value="0"></td>
    <td><input type="number" class="item-count" value="1"></td>
    <td class="item-line-total">0</td>
    <td><button type="button" class="remove-item">x</button></td>
  `;
  itemsBody.appendChild(row);

  row.querySelector('.item-price').addEventListener('input', recalcTotals);
  row.querySelector('.item-count').addEventListener('input', recalcTotals);
  row.querySelector('.remove-item').addEventListener('click', () => {
    row.remove();
    recalcTotals();
  });
}

function recalcTotals() {
  let total = 0;
  document.querySelectorAll('#itemsBody tr').forEach(row => {
    const price = Number(row.querySelector('.item-price').value) || 0;
    const count = Number(row.querySelector('.item-count').value) || 0;
    const lineTotal = price * count;
    row.querySelector('.item-line-total').textContent = lineTotal;
    total += lineTotal;
  });

  const discount = Number(discountInput.value) || 0;
  totalDisplay.textContent = total;
  finalDisplay.textContent = total - discount;
}

if (addItemBtn) {
  addItemBtn.addEventListener('click', addItemRow);
  discountInput.addEventListener('input', recalcTotals);
  addItemRow(); // start with one row
}

function collectItems() {
  const items = [];
  document.querySelectorAll('#itemsBody tr').forEach(row => {
    items.push({
      material: row.querySelector('.item-material').value,
      price: Number(row.querySelector('.item-price').value) || 0,
      count: Number(row.querySelector('.item-count').value) || 0
    });
  });
  return items;
}

if (invoiceForm) {
  invoiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const date = document.getElementById('invoiceDate').value;
    const items = collectItems();
    const discount = Number(discountInput.value) || 0;

    const invoice = await api.post('/invoices', { customerName, mobileNumber, date, items, discount });

    fillPrintArea(invoice);
    document.getElementById('invoicePrintArea').classList.remove('hidden');
    downloadJpegBtn.classList.remove('hidden');
  });
}

function fillPrintArea(invoice) {
  const dateStr = new Date(invoice.date).toLocaleDateString();

  document.getElementById('printInvoiceNo').textContent = 'No. ' + invoice._id.slice(-6).toUpperCase();
  document.getElementById('printMetaDate').textContent = dateStr;
  document.getElementById('printServedBy').textContent = localStorage.getItem('name') || localStorage.getItem('username') || '-';

  document.getElementById('printCustomerName').textContent = invoice.customerName;
  document.getElementById('printMobile').textContent = invoice.mobileNumber;
  document.getElementById('printPurchaseDate').textContent = dateStr;

  const printBody = document.getElementById('printItemsBody');
  printBody.innerHTML = '';
  invoice.items.forEach(item => {
    const tr = document.createElement('tr');
    const icon = MATERIAL_ICONS[item.material] || MATERIAL_ICONS['Other'];
    tr.innerHTML = `
      <td><div class="ip-material-cell">${icon} ${item.material}</div></td>
      <td>${formatMoney(item.price)}</td>
      <td>${item.count}</td>
      <td class="ip-line-total">${formatMoney(item.price * item.count)}</td>`;
    printBody.appendChild(tr);
  });

  document.getElementById('printTotal').textContent = formatMoney(invoice.totalAmount);
  document.getElementById('printDiscount').textContent = '– ' + formatMoney(invoice.discount);
  document.getElementById('printFinal').textContent = 'Rs. ' + formatMoney(invoice.finalAmount);
}

if (downloadJpegBtn) {
  downloadJpegBtn.addEventListener('click', () => {
    const printArea = document.getElementById('invoicePrintArea');
    html2canvas(printArea).then(canvas => {
      const link = document.createElement('a');
      link.download = 'invoice.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    });
  });
}
