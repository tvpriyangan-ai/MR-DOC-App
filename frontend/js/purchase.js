// Purchase sidebar: load, add (via collapsible form), delete

const purchaseForm = document.getElementById('purchaseForm');
const purchaseList = document.getElementById('purchaseList');
const purchaseAddToggle = document.getElementById('purchaseAddToggle');
const purchaseFormWrap = document.getElementById('purchaseFormWrap');
const purchaseCancelBtn = document.getElementById('purchaseCancelBtn');

async function loadPurchases() {
  const purchases = await api.get('/purchases');
  purchaseList.innerHTML = '';
  purchases.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${p.name} - <span class="entry-amount">${p.amount}</span> (${new Date(p.date).toLocaleDateString()})</span>
      <span>
        <button class="btn-red" onclick="deletePurchase('${p._id}')">Delete</button>
      </span>`;
    purchaseList.appendChild(li);
  });
  updateContainerTotal(document.getElementById('purchaseSection'));
}

async function deletePurchase(id) {
  await api.delete(`/purchases/${id}`);
  loadPurchases();
}

function openPurchaseForm() {
  purchaseFormWrap.classList.add('open');
  purchaseAddToggle.style.display = 'none';
}

function closePurchaseForm() {
  purchaseFormWrap.classList.remove('open');
  purchaseAddToggle.style.display = '';
  purchaseForm.reset();
}

if (purchaseAddToggle) {
  purchaseAddToggle.addEventListener('click', openPurchaseForm);
  purchaseCancelBtn.addEventListener('click', closePurchaseForm);
}

if (purchaseForm) {
  purchaseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('purchaseName').value;
    const date = document.getElementById('purchaseDate').value;
    const amount = Number(document.getElementById('purchaseAmount').value);

    await api.post('/purchases', { name, date, amount });
    closePurchaseForm();
    loadPurchases();
  });

  loadPurchases();
}
